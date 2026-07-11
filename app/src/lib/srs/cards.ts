import type { Pattern } from "../../content/types";
import { PATTERNS } from "../content";

/**
 * The 3 card types, mirroring anki/build_deck.py so the app and the Anki deck
 * stay conceptually aligned: Keyword→Pattern, Template cloze, Problem-as-scheduler.
 */
export type CardKind = "keyword" | "cloze" | "problem";

export interface ReviewCard {
  id: string; // stable: kw:{slug}:{i} | cz:{slug} | pb:{slug}:{i}
  kind: CardKind;
  patternSlug: string;
  patternName: string;
  mnemonic: string;
  /** keyword: the signal phrase · problem: the problem name */
  front: string;
  /** problem cards only */
  url?: string;
  diff?: string;
  /** cloze cards only */
  clozeLines?: ClozeLine[];
}

export interface ClozeLine {
  text: string; // code without the comment
  comment: string; // the hint comment ("" if none)
  blank: boolean; // true → hide `text`, keep `comment` as the hint
}

/** Index of a `//` line comment, or -1 — ignoring `//` inside string/char
 *  literals. Direct port of build_deck.py's _comment_index. */
function commentIndex(line: string): number {
  let inStr: string | null = null;
  let i = 0;
  while (i < line.length - 1) {
    const c = line[i];
    if (inStr) {
      if (c === "\\") {
        i += 2;
        continue;
      }
      if (c === inStr) inStr = null;
    } else if (c === '"' || c === "'") {
      inStr = c;
    } else if (c === "/" && line[i + 1] === "/") {
      return i;
    }
    i++;
  }
  return -1;
}

/** Port of build_deck.py's cloze_java: blank up to `maxBlanks` comment-annotated
 *  lines — the comment stays as the hint, the code becomes the blank. */
export function clozeLines(java: string, maxBlanks = 3): ClozeLine[] {
  const out: ClozeLine[] = [];
  let n = 0;
  for (const line of java.split("\n")) {
    const idx = n < maxBlanks ? commentIndex(line) : -1;
    if (idx !== -1) {
      const code = line.slice(0, idx);
      const comment = line.slice(idx + 2);
      if (code.trim()) {
        n++;
        out.push({ text: code.trimEnd(), comment: comment.trim(), blank: true });
        continue;
      }
    }
    out.push({ text: line, comment: "", blank: false });
  }
  if (n === 0) {
    // fallback: blank a substantive line even without comments
    const idx = out.findIndex((l, i) => i > 0 && l.text.trim() !== "");
    const target = idx !== -1 ? idx : out.findIndex((l) => l.text.trim() !== "");
    if (target !== -1) out[target] = { ...out[target], blank: true };
  }
  return out;
}

function buildDeck(patterns: Pattern[]): ReviewCard[] {
  const deck: ReviewCard[] = [];
  for (const p of patterns) {
    const base = {
      patternSlug: p.slug,
      patternName: p.name,
      mnemonic: p.mnemonic,
    };
    p.signals.forEach((sig, i) => {
      deck.push({ ...base, id: `kw:${p.slug}:${i}`, kind: "keyword", front: sig });
    });
    if (p.templates.java.trim()) {
      deck.push({
        ...base,
        id: `cz:${p.slug}`,
        kind: "cloze",
        front: p.name,
        clozeLines: clozeLines(p.templates.java),
      });
    }
    p.problems.forEach((prob, i) => {
      deck.push({
        ...base,
        id: `pb:${p.slug}:${i}`,
        kind: "problem",
        front: prob.name,
        url: prob.url,
        diff: prob.diff,
      });
    });
  }
  return deck;
}

export const DECK: ReviewCard[] = buildDeck(PATTERNS);
export const DECK_BY_ID = new Map(DECK.map((c) => [c.id, c]));
