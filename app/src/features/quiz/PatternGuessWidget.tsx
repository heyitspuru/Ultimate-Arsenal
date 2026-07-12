import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PATTERNS, patternBySlug } from "../../lib/content";
import { makeQuestion, type QuizQuestion } from "./quizEngine";

/**
 * One quiz interaction: cue shown, pick the pattern, instant feedback + why.
 * Shared by /quiz (rounds) and anywhere a single rep is wanted.
 */
export default function PatternGuessWidget({
  question,
  onAnswered,
  onNext,
  nextLabel = "Next question",
}: {
  question?: QuizQuestion;
  onAnswered?: (correct: boolean) => void;
  onNext?: () => void;
  nextLabel?: string;
}) {
  const [q, setQ] = useState<QuizQuestion>(() => question ?? makeQuestion(PATTERNS));
  const [picked, setPicked] = useState<string | null>(null);
  const active = question ?? q;
  const answered = picked !== null;
  const wasRight = picked === active.correct.slug;
  const correctPattern = patternBySlug(active.correct.slug);

  function pick(slug: string) {
    if (answered) return;
    setPicked(slug);
    onAnswered?.(slug === active.correct.slug);
  }

  function next() {
    setPicked(null);
    if (onNext) onNext();
    else setQ(makeQuestion(PATTERNS));
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="label-mono">
        {active.promptType === "problem" ? "LeetCode problem — click to skim" : "the problem says"}
      </p>
      <p className="mt-2 mb-5 font-mono text-lg">
        {active.promptType === "problem" && active.url ? (
          <a className="link-draw" href={active.url} target="_blank" rel="noreferrer">
            {active.prompt} ↗
          </a>
        ) : active.promptType === "problem" ? (
          active.prompt
        ) : (
          <>&ldquo;{active.prompt}&rdquo;</>
        )}
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {active.options.map((o) => {
          const isCorrect = o.slug === active.correct.slug;
          const isPicked = o.slug === picked;
          return (
            <Button
              key={o.slug}
              variant={answered && isCorrect ? "default" : "outline"}
              className={
                answered && !isCorrect
                  ? isPicked
                    ? "line-through opacity-70"
                    : "opacity-30 hover:border-border hover:bg-transparent hover:text-current"
                  : ""
              }
              onClick={() => pick(o.slug)}
            >
              {answered && isCorrect && <Check className="size-3.5" />}
              {answered && isPicked && !isCorrect && <X className="size-3.5" />}
              {o.name}
            </Button>
          );
        })}
      </div>

      {answered && (
        <div className={`mt-5 ${wasRight ? "animate-pop" : "animate-shake"}`}>
          <p className="text-sm font-semibold">
            {wasRight ? "Correct." : <>Not quite — it&rsquo;s {active.correct.name}.</>}
          </p>
          {correctPattern && (
            <p className="mt-1 text-xs text-muted-foreground">
              <em>{correctPattern.mnemonic}</em> · signals:{" "}
              {correctPattern.signals.slice(0, 3).join(" · ")} ·{" "}
              <Link className="underline underline-offset-2" to={`/patterns/${correctPattern.slug}`} viewTransition>
                open page
              </Link>
            </p>
          )}
          <Button className="mt-3" onClick={next}>
            {nextLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
