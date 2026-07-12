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

/**
 * Classic single-token bugs. Comparison, logic, and bare-shift operators are
 * matched **space-delimited** — these templates always write comparisons with
 * spaces (`lo < hi`, `sum >= target`), while Java generics (`Map<Integer>`,
 * `PriorityQueue<>`) and compound operators (`>>=`) never have surrounding
 * spaces. That single constraint keeps a mutation from ever corrupting a type
 * parameter or a shift-assign and mislabeling it as a comparison bug.
 * Compound `>>=`/`<<=` are handled explicitly (unambiguously shifts).
 */
const MUTATIONS: Mutation[] = [
  // comparison — spaced, so `<Integer>` / `>>=` are never touched
  { category: "off-by-one comparison", find: / <= /, replace: " < " },
  { category: "off-by-one comparison", find: / >= /, replace: " > " },
  { category: "off-by-one comparison", find: / < /, replace: " <= " },
  { category: "off-by-one comparison", find: / > /, replace: " >= " },
  // direction — increment/decrement/compound-assign never collide with generics
  { category: "reversed direction", find: /\+\+/, replace: "--" },
  { category: "reversed direction", find: /--/, replace: "++" },
  { category: "reversed direction", find: /\+=/, replace: "-=" },
  { category: "reversed direction", find: /-=/, replace: "+=" },
  // wrong extreme (Java uses Math.max/min; covers the common case without dupes)
  { category: "wrong extreme", find: /Math\.max/, replace: "Math.min" },
  { category: "wrong extreme", find: /Math\.min/, replace: "Math.max" },
  // inverted logic — spaced
  { category: "inverted logic", find: / && /, replace: " || " },
  { category: "inverted logic", find: / \|\| /, replace: " && " },
  { category: "inverted logic", find: / == /, replace: " != " },
  { category: "inverted logic", find: / != /, replace: " == " },
  // shift — explicit compound-assign, plus spaced bare shift
  { category: "wrong shift", find: />>=/, replace: "<<=" },
  { category: "wrong shift", find: /<<=/, replace: ">>=" },
  { category: "wrong shift", find: / >> /, replace: " << " },
  { category: "wrong shift", find: / << /, replace: " >> " },
  // off-by-one literal — spaced, word-bounded
  { category: "off-by-one", find: / \+ 1\b/, replace: " - 1" },
  { category: "off-by-one", find: / - 1\b/, replace: " + 1" },
];

export interface DebugRound {
  lines: DrillLine[]; // with the bug applied
  bugIndex: number;
  originalCode: string; // the correct line
  category: string; // shown as the hint ("a reversed-direction bug")
}

/**
 * Sabotage one line with one classic bug. Comments are left intact — the code
 * contradicting its own comment is the tell, like a real code review.
 *
 * Selection is **line-uniform**: pick a random mutable line, then a random
 * applicable mutation on it. (Picking uniformly over (line, mutation) pairs
 * would over-select operator-dense lines.) If a chosen mutation somehow
 * produces no change, fall through to another mutation/line rather than bail.
 */
export function makeDebugRound(java: string): DebugRound | null {
  const lines = splitLines(java);
  const siteLines = substantiveIndices(lines).filter((idx) =>
    MUTATIONS.some((m) => m.find.test(lines[idx].code)),
  );
  for (const idx of sample(siteLines, siteLines.length)) {
    const original = lines[idx].code;
    const applicable = MUTATIONS.filter((m) => m.find.test(original));
    for (const m of sample(applicable, applicable.length)) {
      const mutated = original.replace(m.find, m.replace);
      if (mutated !== original) {
        const out = lines.map((l, i) => (i === idx ? { ...l, code: mutated } : l));
        return { lines: out, bugIndex: idx, originalCode: original, category: m.category };
      }
    }
  }
  return null;
}

/** Whitespace-insensitive comparison — retrieval check, not a typing test. */
export function sameCode(a: string, b: string): boolean {
  return a.replace(/\s+/g, " ").trim() === b.replace(/\s+/g, " ").trim();
}
