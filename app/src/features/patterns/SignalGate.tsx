import { useMemo, useState, type ReactNode } from "react";
import type { Pattern } from "../../content/types";
import { PATTERNS } from "../../lib/content";
import { makeSignalQuestion } from "../quiz/quizEngine";

/**
 * Recall gate for a pattern page. You know which pattern you're on, so the
 * retrieval flips direction: pick the signal that truly belongs to it from
 * signals stolen off other patterns. One rep per visit — never persisted.
 */
export default function SignalGate({ pattern, children }: { pattern: Pattern; children: ReactNode }) {
  const q = useMemo(() => makeSignalQuestion(pattern, PATTERNS), [pattern]);
  const [picked, setPicked] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  if (open) return <>{children}</>;

  const answered = picked !== null;
  return (
    <div className="gate">
      <p className="hint">
        Which of these is a signal for <strong>{pattern.name}</strong>? (The rest belong to other
        patterns.)
      </p>
      <div className="dt-options" style={{ maxWidth: 560, margin: "0 auto" }}>
        {q.options.map((s) => {
          const isCorrect = s === q.correct;
          const isPicked = s === picked;
          let style: React.CSSProperties = {};
          if (answered && isCorrect) style = { borderColor: "var(--green)", color: "var(--green)" };
          else if (answered && isPicked)
            style = { borderColor: "var(--accent)", color: "var(--accent-soft)" };
          else if (answered) style = { opacity: 0.45 };
          return (
            <button
              key={s}
              className="btn"
              style={style}
              onClick={() => !answered && setPicked(s)}
            >
              &ldquo;{s}&rdquo;
            </button>
          );
        })}
      </div>
      {answered ? (
        <div
          className={picked === q.correct ? "feedback-right" : "feedback-wrong"}
          style={{ marginTop: "1rem" }}
        >
          <p style={{ margin: "0.3rem 0" }}>
            {picked === q.correct ? (
              <strong style={{ color: "var(--green)" }}>Correct.</strong>
            ) : (
              <strong style={{ color: "var(--accent-soft)" }}>
                Not that one — now recall the mnemonic before opening.
              </strong>
            )}
          </p>
          <button className="btn primary" onClick={() => setOpen(true)}>
            Reveal the page
          </button>
        </div>
      ) : (
        <p style={{ marginTop: "0.9rem" }}>
          <button className="btn ghost" onClick={() => setOpen(true)}>
            skip — just reveal
          </button>
        </p>
      )}
    </div>
  );
}
