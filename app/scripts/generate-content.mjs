#!/usr/bin/env node
/**
 * DSA Pattern Vault — build-time content generator.
 *
 * Parses ../content/patterns/*.md (+ masters) into typed JSON consumed by the
 * React app. Mirrors the regex/section approach of anki/build_deck.py and
 * site/build_pdf.py so all three tools read the same files the same way.
 * Content stays single-sourced in content/ — this script never writes there.
 *
 * Output: src/content/generated/*.json (gitignored, regenerated on dev/build).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const CONTENT = path.join(REPO, "content");
const OUT_DIR = path.resolve(HERE, "..", "src", "content", "generated");

// ---------------------------------------------------------------- helpers

/** Body of the `## <name>` section, up to the next `## ` heading. */
function section(body, name) {
  const re = new RegExp(`^## ${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m");
  const m = re.exec(body);
  if (!m) return "";
  const start = m.index + m[0].length;
  const rest = body.slice(start);
  const next = rest.search(/^## /m);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

/** Inner markdown of <div class="wbox use|avoid" markdown> ... </div>. */
function wbox(html, kind) {
  const re = new RegExp(`<div class="wbox ${kind}" markdown>\\s*([\\s\\S]*?)\\s*</div>`);
  const m = re.exec(html);
  return m ? m[1].trim() : "";
}

/** Source of the first ```mermaid fence. */
function mermaidFence(body) {
  const m = /```mermaid\n([\s\S]*?)\n```/.exec(body);
  return m ? m[1] : "";
}

/**
 * Flatten `=== "Lang"` tab blocks (port of build_pdf.py's consumer):
 * consume the indented block after each tab label, dedent it, then pull the
 * code out of its fence. Returns { java, python, cpp }.
 */
function tabGroup(md) {
  const lines = md.split("\n");
  const out = {};
  let i = 0;
  while (i < lines.length) {
    const m = /^===\s*"([^"]+)"\s*$/.exec(lines[i].trim());
    if (!m) { i++; continue; }
    const label = m[1].toLowerCase().replace("++", "pp"); // Java→java, C++→cpp
    i++;
    const block = [];
    while (i < lines.length && (lines[i].trim() === "" || /^\s/.test(lines[i]))) {
      block.push(lines[i]);
      i++;
    }
    const dedented = dedent(block.join("\n"));
    const fence = /```\w*\n([\s\S]*?)\n\s*```/.exec(dedented);
    if (fence) out[label] = fence[1];
  }
  return out;
}

/**
 * Template variants. Normal pages: one group under `## Template`.
 * The DP mega-page instead has `## The six recurrences` with `###`-titled
 * sub-groups — capture each as a named variant. variants[0] is the canonical
 * template (mirrors build_deck.py, which clozes the file's first Java fence).
 */
function templateVariants(body) {
  const single = section(body, "Template");
  if (single) {
    const g = tabGroup(single);
    return { sectionTitle: "Template", variants: [{ title: "", templates: g }] };
  }
  // find the ## section that contains tab groups
  for (const m of body.matchAll(/^## (.+)$/gm)) {
    const sec = section(body, m[1]);
    if (!/^===\s*"/m.test(sec)) continue;
    const variants = [];
    const chunks = sec.split(/^### /m);
    for (const chunk of chunks.slice(1)) {
      const nl = chunk.indexOf("\n");
      const title = chunk.slice(0, nl).trim();
      const rest = chunk.slice(nl + 1);
      let g = tabGroup(rest);
      if (!Object.keys(g).length) {
        // bare fences (DP sub-cards 2-6 skip the tab syntax)
        for (const f of rest.matchAll(/```(\w+)?\n([\s\S]*?)\n```/g)) {
          const lang = (f[1] ?? "java").toLowerCase().replace("++", "pp");
          if (!(lang in g)) g[lang] = f[2];
        }
      }
      const note = /^_([^_]+)_\s*$/m.exec(rest)?.[1] ?? "";
      if (Object.keys(g).length) variants.push({ title, note, templates: g });
    }
    if (variants.length) return { sectionTitle: m[1], variants };
  }
  return { sectionTitle: "Template", variants: [] };
}

function dedent(text) {
  const lines = text.split("\n");
  let min = Infinity;
  for (const l of lines) {
    if (!l.trim()) continue;
    min = Math.min(min, l.length - l.trimStart().length);
  }
  if (!isFinite(min) || min === 0) return text;
  return lines.map((l) => l.slice(min)).join("\n");
}

/** Pitfalls: bullet list → string[]; prose fallback → single item. */
function pitfalls(body) {
  const sec = section(body, "Pitfalls");
  if (!sec) return [];
  const bullets = sec
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim());
  return bullets.length ? bullets : [sec.replace(/\n+/g, " ").trim()];
}

/** Parse a GFM table into an array of cell-arrays (skips header rule row). */
function parseTable(md) {
  const rows = [];
  for (const line of md.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("|")) continue;
    const cells = t.slice(1, t.endsWith("|") ? -1 : undefined).split("|").map((c) => c.trim());
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue; // separator row
    rows.push(cells);
  }
  return rows;
}

const DIFF = { E: "Easy", M: "Medium", H: "Hard" };

// ---------------------------------------------------------------- patterns

function buildPatterns() {
  const dir = path.join(CONTENT, "patterns");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content: body } = matter(raw);
    for (const key of ["pattern", "slug", "mnemonic"]) {
      if (!data[key]) throw new Error(`${file}: missing frontmatter '${key}'`);
    }
    if (!Array.isArray(data.signals)) throw new Error(`${file}: 'signals' must be a list`);
    if (!Array.isArray(data.problems)) throw new Error(`${file}: 'problems' must be a list`);
    const { sectionTitle, variants } = templateVariants(body);
    const tpl = variants[0]?.templates ?? {};
    return {
      id: file.replace(/\.md$/, ""),
      number: Number(file.slice(0, 2)),
      name: data.pattern,
      slug: data.slug,
      sprint: data.sprint ?? 0,
      tier: data.tier ?? "",
      mnemonic: data.mnemonic,
      signals: data.signals.map(String),
      complexity: { time: data.complexity?.time ?? "", space: data.complexity?.space ?? "" },
      complexityNote: section(body, "Complexity"),
      use: wbox(body, "use"),
      avoid: wbox(body, "avoid"),
      diagram: mermaidFence(body),
      templates: { java: tpl.java ?? "", python: tpl.python ?? "", cpp: tpl.cpp ?? "" },
      templateSectionTitle: sectionTitle,
      templateVariants: variants.map((v) => ({
        title: v.title ?? "",
        note: v.note ?? "",
        templates: { java: v.templates.java ?? "", python: v.templates.python ?? "", cpp: v.templates.cpp ?? "" },
      })),
      pitfalls: pitfalls(body),
      problems: data.problems.map((p) => ({
        name: p.name,
        diff: DIFF[p.diff] ?? String(p.diff),
        url: p.url,
      })),
    };
  });
}

// ---------------------------------------------------------------- masters

function buildKeywordLookup(patterns) {
  const raw = fs.readFileSync(path.join(CONTENT, "masters", "keyword-lookup.md"), "utf-8");
  const bySlugFile = new Map(patterns.map((p) => [p.id, p]));
  const rows = parseTable(raw)
    .filter((r) => r.length >= 3 && r[2].includes("../patterns/"))
    .map((r) => {
      const file = /\.\.\/patterns\/([\w-]+)\.md/.exec(r[2])?.[1] ?? "";
      const p = bySlugFile.get(file);
      return {
        phrase: r[0].replace(/\*\*/g, ""),
        pattern: r[1],
        slug: p?.slug ?? file.replace(/^\d+-/, ""),
      };
    });
  const tieBreakers = section(raw.replace(/^---[\s\S]*?---/, ""), "Fast tie-breakers")
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim());
  return { rows, tieBreakers };
}

function buildComplexity() {
  const raw = fs.readFileSync(path.join(CONTENT, "masters", "complexity-cheatsheet.md"), "utf-8");
  const dsOps = parseTable(section(raw, "Data-structure operations")).slice(1)
    .map(([structure, access, search, insert, del, notes]) => ({
      structure, access, search, insert, delete: del, notes,
    }));
  // Source has the per-pattern table split in two by a blank line — parseTable
  // reads every |-row in the section, so both halves merge; drop the repeated header.
  const perPattern = parseTable(section(raw, "Per-pattern Big-O"))
    .filter((r) => r[0] !== "Pattern")
    .map(([pattern, time, space]) => ({ pattern, time, space }));
  const growth = parseTable(section(raw, "Growth reference")).slice(1)
    .map(([bigO, ops, feels]) => ({ bigO, ops, feels }));
  return { dsOps, perPattern, growth };
}

// ---------------------------------------------------------------- main

function main() {
  const patterns = buildPatterns();
  const lookup = buildKeywordLookup(patterns);
  const complexity = buildComplexity();

  // sanity checks (fail the build loudly rather than render half a vault)
  if (patterns.length < 24) throw new Error(`only ${patterns.length} patterns parsed`);
  for (const p of patterns) {
    if (!p.templates.java) throw new Error(`${p.id}: no Java template parsed`);
    if (p.problems.length === 0) throw new Error(`${p.id}: no problems parsed`);
    if (p.pitfalls.length === 0) throw new Error(`${p.id}: no pitfalls parsed`);
  }
  if (lookup.rows.length < patterns.length) {
    throw new Error(`keyword lookup has ${lookup.rows.length} rows < ${patterns.length} patterns`);
  }
  if (complexity.perPattern.length < 24) throw new Error("per-pattern complexity table too short");

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "patterns.json"), JSON.stringify(patterns, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "keyword-lookup.json"), JSON.stringify(lookup, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "complexity.json"), JSON.stringify(complexity, null, 2));
  console.log(
    `generated: ${patterns.length} patterns, ${lookup.rows.length} lookup rows, ` +
    `${complexity.perPattern.length} complexity rows -> src/content/generated/`,
  );
}

main();
