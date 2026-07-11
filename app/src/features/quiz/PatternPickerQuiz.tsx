import { useState } from "react";
import { PATTERNS } from "../../lib/content";
import { makeQuestion, type QuizQuestion } from "./quizEngine";
import PatternGuessWidget from "./PatternGuessWidget";

const ROUND = 10;

export default function PatternPickerQuiz() {
  const [n, setN] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<QuizQuestion>(() => makeQuestion(PATTERNS));
  const [finished, setFinished] = useState(false);

  function restart() {
    setN(1);
    setScore(0);
    setFinished(false);
    setQuestion(makeQuestion(PATTERNS));
  }

  return (
    <>
      <h1>Pattern Picker</h1>
      <p className="dim small">
        Interleaved across all {PATTERNS.length} patterns — the cue could be anything. That&rsquo;s
        the point.
      </p>

      {finished ? (
        <div className="panel" style={{ textAlign: "center", padding: "2rem" }}>
          <p className="small faint" style={{ margin: 0 }}>
            Round complete
          </p>
          <p style={{ fontSize: "2.2rem", fontFamily: "var(--mono)", margin: "0.4rem 0" }}>
            {score} / {ROUND}
          </p>
          <p className="dim small">
            {score === ROUND
              ? "Clean sweep. Raise the bar: do a round right after waking up."
              : score >= 7
                ? "Solid. The misses are your weak patterns — open their pages and re-gate."
                : "Below 70% — drill the keyword lookup for a few minutes, then retry."}
          </p>
          <button className="btn primary" onClick={restart}>
            New round
          </button>
        </div>
      ) : (
        <>
          <p className="small faint" style={{ fontFamily: "var(--mono)" }}>
            question {n} / {ROUND} &middot; score {score}
          </p>
          <PatternGuessWidget
            question={question}
            onAnswered={(ok) => ok && setScore((s) => s + 1)}
            onNext={() => {
              if (n >= ROUND) setFinished(true);
              else {
                setN(n + 1);
                setQuestion(makeQuestion(PATTERNS));
              }
            }}
            nextLabel={n >= ROUND ? "Finish round" : "Next question"}
          />
        </>
      )}
    </>
  );
}
