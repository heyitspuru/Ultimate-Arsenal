import { useRef, useState } from "react";
import { PATTERNS } from "../../lib/content";
import { makeQuestion, type QuizQuestion } from "./quizEngine";
import PatternGuessWidget from "./PatternGuessWidget";

const ROUND = 10;
/** every distinct cue in the vault (signals + problem names) */
const CUE_COUNT = PATTERNS.reduce((n, p) => n + p.signals.length + p.problems.length, 0);

export default function PatternPickerQuiz() {
  // cues used this session — no repeats until the vault is exhausted
  const used = useRef(new Set<string>());
  const [n, setN] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<QuizQuestion>(() =>
    makeQuestion(PATTERNS, 7, used.current),
  );
  const [finished, setFinished] = useState(false);

  function nextQuestion(): QuizQuestion {
    if (used.current.size >= CUE_COUNT) used.current.clear(); // vault exhausted — recycle
    return makeQuestion(PATTERNS, 7, used.current);
  }

  function restart() {
    setN(1);
    setScore(0);
    setFinished(false);
    setQuestion(nextQuestion());
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
          <p className="small faint" style={{ fontFamily: "var(--mono)", marginBottom: 0 }}>
            question {n} / {ROUND} &middot; score {score}
          </p>
          <div className="progress">
            <div style={{ width: `${((n - 1) / ROUND) * 100}%` }} />
          </div>
          <PatternGuessWidget
            question={question}
            onAnswered={(ok) => ok && setScore((s) => s + 1)}
            onNext={() => {
              if (n >= ROUND) setFinished(true);
              else {
                setN(n + 1);
                setQuestion(nextQuestion());
              }
            }}
            nextLabel={n >= ROUND ? "Finish round" : "Next question"}
          />
        </>
      )}
    </>
  );
}
