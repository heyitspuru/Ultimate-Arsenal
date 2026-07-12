import { useState } from "react";
import { Link } from "react-router-dom";
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
    <div className="panel" style={{ padding: "1.4rem" }}>
      <p className="small faint" style={{ margin: 0 }}>
        {active.promptType === "problem"
          ? "LeetCode problem — click to skim the statement"
          : "The problem says…"}
      </p>
      <p style={{ fontSize: "1.1rem", fontFamily: "var(--mono)", margin: "0.4rem 0 1rem" }}>
        {active.promptType === "problem" && active.url ? (
          <a href={active.url} target="_blank" rel="noreferrer">
            {active.prompt} ↗
          </a>
        ) : active.promptType === "problem" ? (
          active.prompt
        ) : (
          `“${active.prompt}”`
        )}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "0.45rem",
        }}
      >
        {active.options.map((o) => {
          const isCorrect = o.slug === active.correct.slug;
          const isPicked = o.slug === picked;
          let style: React.CSSProperties = {};
          if (answered && isCorrect) {
            style = { borderColor: "var(--green)", color: "var(--green)" };
          } else if (answered && isPicked) {
            style = { borderColor: "var(--accent)", color: "var(--accent-soft)" };
          } else if (answered) {
            style = { opacity: 0.45 };
          }
          return (
            <button key={o.slug} className="btn" style={style} onClick={() => pick(o.slug)}>
              {o.name}
            </button>
          );
        })}
      </div>

      {answered && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ margin: "0.2rem 0" }}>
            {picked === active.correct.slug ? (
              <strong style={{ color: "var(--green)" }}>Correct.</strong>
            ) : (
              <strong style={{ color: "var(--accent-soft)" }}>
                Not quite — it&rsquo;s {active.correct.name}.
              </strong>
            )}
          </p>
          {correctPattern && (
            <p className="dim small" style={{ margin: "0.2rem 0" }}>
              <em>{correctPattern.mnemonic}</em> &middot; signals:{" "}
              {correctPattern.signals.slice(0, 3).join(" · ")} &middot;{" "}
              <Link to={`/patterns/${correctPattern.slug}`}>open page</Link>
            </p>
          )}
          <button className="btn primary" style={{ marginTop: "0.5rem" }} onClick={next}>
            {nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}
