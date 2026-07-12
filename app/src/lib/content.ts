import patternsJson from "../content/generated/patterns.json";
import lookupJson from "../content/generated/keyword-lookup.json";
import complexityJson from "../content/generated/complexity.json";
import type { ComplexityData, KeywordLookup, Pattern } from "../content/types";

export const PATTERNS = patternsJson as Pattern[];
export const KEYWORD_LOOKUP = lookupJson as KeywordLookup;
export const COMPLEXITY = complexityJson as ComplexityData;

const bySlug = new Map(PATTERNS.map((p) => [p.slug, p]));

export function patternBySlug(slug: string): Pattern | undefined {
  return bySlug.get(slug);
}

export const SPRINTS: { sprint: number; tier: string; patterns: Pattern[] }[] = (() => {
  const groups = new Map<number, Pattern[]>();
  for (const p of PATTERNS) {
    const list = groups.get(p.sprint) ?? [];
    list.push(p);
    groups.set(p.sprint, list);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a - b)
    .map(([sprint, patterns]) => ({ sprint, tier: patterns[0]?.tier ?? "", patterns }));
})();
