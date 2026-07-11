import type { Pattern } from "../../content/types";

export interface QuizOption {
  slug: string;
  name: string;
}

export interface QuizQuestion {
  /** what's shown: a signal phrase or a real problem name */
  prompt: string;
  promptType: "signal" | "problem";
  correct: QuizOption;
  options: QuizOption[]; // shuffled, includes correct
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

/**
 * The interleaving engine: random pattern, random cue (signal phrase or one of
 * its canonical problems), correct answer + distractors. Distractor count 7 →
 * an 8-way choice, hard enough to force real discrimination without scanning
 * a 31-item wall every question.
 */
export function makeQuestion(patterns: Pattern[], distractors = 7): QuizQuestion {
  const p = patterns[Math.floor(Math.random() * patterns.length)];
  const useProblem = Math.random() < 0.4 && p.problems.length > 0;
  const prompt = useProblem
    ? p.problems[Math.floor(Math.random() * p.problems.length)].name
    : p.signals[Math.floor(Math.random() * p.signals.length)];
  const correct = { slug: p.slug, name: p.name };
  const others = sample(
    patterns.filter((x) => x.slug !== p.slug),
    distractors,
  ).map((x) => ({ slug: x.slug, name: x.name }));
  return {
    prompt,
    promptType: useProblem ? "problem" : "signal",
    correct,
    options: shuffle([correct, ...others]),
  };
}

export interface SignalQuestion {
  /** the one signal that truly belongs to the pattern */
  correct: string;
  options: string[]; // shuffled, includes correct
}

/**
 * Detail-page gate quiz: the pattern is known (you're on its page), so the
 * retrieval direction flips — pick the signal that belongs to THIS pattern
 * out of signals stolen from other patterns.
 */
export function makeSignalQuestion(p: Pattern, all: Pattern[], distractors = 3): SignalQuestion {
  const correct = p.signals[Math.floor(Math.random() * p.signals.length)];
  const foreign = sample(
    all.filter((x) => x.slug !== p.slug),
    distractors,
  ).map((x) => x.signals[Math.floor(Math.random() * x.signals.length)]);
  return { correct, options: shuffle([correct, ...foreign]) };
}
