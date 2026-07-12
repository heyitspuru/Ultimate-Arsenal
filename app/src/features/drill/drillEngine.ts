import { commentIndex, type ClozeLine } from "../../lib/srs/cards";

/** A template line split into code + trailing comment (hint). */
export interface DrillLine {
  code: string;
  comment: string;
}

export function splitLines(java: string): DrillLine[] {
  return java.split("\n").map((line) => {
    const idx = commentIndex(line);
    if (idx === -1) return { code: line, comment: "" };
    return { code: line.slice(0, idx).trimEnd(), comment: line.slice(idx + 2).trim() };
  });
}

/** Lines worth blanking/mutating: real statements, not just braces or the signature. */
function substantiveIndices(lines: DrillLine[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < lines.length; i++) {
    const t = lines[i].code.trim();
    if (t.length > 3 && !/^[{})\];]*$/.test(t)) out.push(i);
  }
  return out;
}

function sample<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

/**
 * Fill mode with ROTATING blanks: a random subset of substantive lines per
 * round — unlike the Review cloze (lib/srs/cards.ts clozeLines), which must
 * stay deterministic so FSRS cards keep a stable identity.
 */
export function makeFillRound(java: string, blanks = 3): ClozeLine[] {
  const lines = splitLines(java);
  const chosen = new Set(sample(substantiveIndices(lines), blanks));
  return lines.map((l, i) => ({
    text: l.code,
    comment: l.comment,
    blank: chosen.has(i),
  }));
}

// ---------------------------------------------------------------- debug mode

interface Mutation {
  category: string;
  find: RegExp;
  replace: string;
}

/** Classic single-token bugs. Ordered pairs — longer operators first so
 *  `<=` matches before `<`. Each must change behavior on these templates. */
const MUTATIONS: Mutation[] = [
  { category: "off-by-one comparison", find: /<=/, replace: "<" },
  { category: "off-by-one comparison", find: />=/, replace: ">" },
  { category: "off-by-one comparison", find: /(?<![<>=!<])<(?![<=])/, replace: "<=" },
  { category: "off-by-one comparison", find: /(?<![<>=\-])>(?![>=])/, replace: ">=" },
  { category: "reversed direction", find: /\+\+/, replace: "--" },
  { category: "reversed direction", find: /--/, replace: "++" },
  { category: "reversed direction", find: /\+=/, replace: "-=" },
  { category: "reversed direction", find: /-=/, replace: "+=" },
  { category: "wrong extreme", find: /Math\.max/, replace: "Math.min" },
  { category: "wrong extreme", find: /Math\.min/, replace: "Math.max" },
  { category: "wrong extreme", find: /\bmax\(/, replace: "min(" },
  { category: "wrong extreme", find: /\bmin\(/, replace: "max(" },
  { category: "inverted logic", find: /&&/, replace: "||" },
  { category: "inverted logic", find: /\|\|/, replace: "&&" },
  { category: "inverted logic", find: /==/, replace: "!=" },
  { category: "inverted logic", find: /!=/, replace: "==" },
  { category: "wrong shift", find: /<</, replace: ">>" },
  { category: "wrong shift", find: />>(?!>)/, replace: "<<" },
  { category: "off-by-one", find: /\+ 1\b/, replace: "- 1" },
  { category: "off-by-one", find: /- 1\b/, replace: "+ 1" },
];

export interface DebugRound {
  lines: DrillLine[]; // with the bug applied
  bugIndex: number;
  originalCode: string; // the correct line
  category: string; // shown as the hint ("a reversed-direction bug")
}

/**
 * Sabotage one line with one classic bug. Collect every applicable
 * (line, mutation) site, pick one at random. Comments are left intact — the
 * code contradicting its own comment is the tell, like a real code review.
 */
export function makeDebugRound(java: string): DebugRound | null {
  const lines = splitLines(java);
  const sites: { idx: number; m: Mutation }[] = [];
  for (const idx of substantiveIndices(lines)) {
    for (const m of MUTATIONS) {
      if (m.find.test(lines[idx].code)) sites.push({ idx, m });
    }
  }
  if (sites.length === 0) return null;
  const { idx, m } = sites[Math.floor(Math.random() * sites.length)];
  const original = lines[idx].code;
  const mutated = original.replace(m.find, m.replace);
  if (mutated === original) return null;
  const out = lines.map((l, i) => (i === idx ? { ...l, code: mutated } : l));
  return { lines: out, bugIndex: idx, originalCode: original, category: m.category };
}

/** Whitespace-insensitive comparison — retrieval check, not a typing test. */
export function sameCode(a: string, b: string): boolean {
  return a.replace(/\s+/g, " ").trim() === b.replace(/\s+/g, " ").trim();
}
