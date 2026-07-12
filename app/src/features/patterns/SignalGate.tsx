import { useMemo, useState, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const wasRight = picked === q.correct;

  return (
    <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
      <p className="mx-auto max-w-md text-sm text-muted-foreground">
        Which of these is a signal for <strong className="text-foreground">{pattern.name}</strong>?
        The rest belong to other patterns.
      </p>
      <div className="mx-auto mt-5 flex max-w-md flex-col gap-2">
        {q.options.map((s) => {
          const isCorrect = s === q.correct;
          const isPicked = s === picked;
          return (
            <Button
              key={s}
              variant={answered && isCorrect ? "default" : "outline"}
              className={`h-auto justify-start whitespace-normal py-2 text-left font-mono text-xs ${
                answered && !isCorrect ? (isPicked ? "line-through opacity-70" : "opacity-30 hover:bg-transparent hover:text-current hover:border-border") : ""
              }`}
              onClick={() => !answered && setPicked(s)}
            >
              {answered && isCorrect && <Check className="size-3.5" />}
              {answered && isPicked && !isCorrect && <X className="size-3.5" />}
              &ldquo;{s}&rdquo;
            </Button>
          );
        })}
      </div>
      {answered ? (
        <div className={`mt-5 ${wasRight ? "animate-pop" : "animate-shake"}`}>
          <p className="text-sm font-semibold">
            {wasRight ? "Correct." : "Not that one — now recall the mnemonic before opening."}
          </p>
          <Button className="mt-3" onClick={() => setOpen(true)}>
            Reveal the page
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="sm" className="mt-5" onClick={() => setOpen(true)}>
          skip — just reveal
        </Button>
      )}
    </div>
  );
}
