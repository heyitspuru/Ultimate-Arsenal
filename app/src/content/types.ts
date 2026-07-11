/** Shapes emitted by scripts/generate-content.mjs (single source: content/*.md). */

export interface Problem {
  name: string;
  diff: "Easy" | "Medium" | "Hard" | string;
  url: string;
}

export interface TemplateSet {
  java: string;
  python: string;
  cpp: string;
}

export interface TemplateVariant {
  title: string; // "" for the single-template case
  note: string; // e.g. "Problems: Climbing Stairs (E), ..."
  templates: TemplateSet;
}

export interface Pattern {
  id: string; // file stem, e.g. "13-heap-top-k"
  number: number;
  name: string;
  slug: string;
  sprint: number;
  tier: string;
  mnemonic: string;
  signals: string[];
  complexity: { time: string; space: string };
  complexityNote: string; // markdown prose from the ## Complexity section
  use: string; // markdown
  avoid: string; // markdown
  diagram: string; // mermaid source
  templates: TemplateSet; // canonical (first) template
  templateSectionTitle: string; // "Template" or e.g. "The six recurrences"
  templateVariants: TemplateVariant[];
  pitfalls: string[];
  problems: Problem[];
}

export interface KeywordRow {
  phrase: string;
  pattern: string;
  slug: string;
}

export interface KeywordLookup {
  rows: KeywordRow[];
  tieBreakers: string[];
}

export interface DsOpRow {
  structure: string;
  access: string;
  search: string;
  insert: string;
  delete: string;
  notes: string;
}

export interface PatternComplexityRow {
  pattern: string;
  time: string;
  space: string;
}

export interface GrowthRow {
  bigO: string;
  ops: string;
  feels: string;
}

export interface ComplexityData {
  dsOps: DsOpRow[];
  perPattern: PatternComplexityRow[];
  growth: GrowthRow[];
}

/** Interactive decision tree (hand-authored in decision-tree.ts). */
export interface DecisionOption {
  label: string;
  /** id of the next question node… */
  next?: string;
  /** …or the slug of the pattern this branch lands on. */
  slug?: string;
}

export interface DecisionNode {
  id: string;
  question: string;
  options: DecisionOption[];
}
