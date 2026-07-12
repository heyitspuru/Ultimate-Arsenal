import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Pattern Picker</h1>
      <p className="text-sm text-muted-foreground">
        Interleaved across all {PATTERNS.length} patterns — the cue could be anything. That&rsquo;s
        the point.
      </p>

      {finished ? (
        <div className="mt-6 rounded-xl border border-border bg-card p-10 text-center">
          <p className="label-mono">round complete</p>
          <p className="my-3 font-mono text-5xl font-bold">
            {score}<span className="text-muted-foreground">/{ROUND}</span>
          </p>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {score === ROUND
              ? "Clean sweep. Raise the bar: do a round right after waking up."
              : score >= 7
                ? "Solid. The misses are your weak patterns — open their pages and re-gate."
                : "Below 70% — drill the keyword lookup for a few minutes, then retry."}
          </p>
          <Button className="mt-5" onClick={restart}>
            New round
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-4 mb-4 flex items-center gap-4">
            <span className="whitespace-nowrap font-mono text-xs text-faint">
              {n} / {ROUND} · score {score}
            </span>
            <Progress value={((n - 1) / ROUND) * 100} className="h-1" />
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
