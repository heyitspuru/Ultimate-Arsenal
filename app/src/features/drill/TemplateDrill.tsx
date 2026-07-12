import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PATTERNS, patternBySlug } from "../../lib/content";
import { clozeLines } from "../../lib/srs/cards";

/** Whitespace-insensitive line comparison — retrieval check, not a typing test. */
function normalize(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function randomSlug(exclude?: string): string {
  const candidates = PATTERNS.filter((p) => p.templates.java.trim() && p.slug !== exclude);
  return candidates[Math.floor(Math.random() * candidates.length)].slug;
}

export default function TemplateDrill() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const pattern = slug ? patternBySlug(slug) : undefined;

  // no slug → land on a random drill
  if (!slug) {
    return <RedirectToRandom />;
  }
  if (!pattern || !pattern.templates.java.trim()) {
    return (
      <>
        <h1 className="mt-8 text-3xl font-bold">Nothing to drill here</h1>
        <p className="mt-2">
          <Link className="link-draw" to="/drill/template" viewTransition>
            Try a random template
          </Link>
        </p>
      </>
    );
  }
  return (
    <Drill
      key={pattern.slug} // full reset when the pattern changes
      slug={pattern.slug}
      onNext={() => navigate(`/drill/template/${randomSlug(pattern.slug)}`)}
    />
  );
}

function RedirectToRandom() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/drill/template/${randomSlug()}`, { replace: true });
  }, [navigate]);
  return null;
}

function Drill({ slug, onNext }: { slug: string; onNext: () => void }) {
  const pattern = patternBySlug(slug)!;
  const lines = useMemo(() => clozeLines(pattern.templates.java), [pattern]);
  const blanks = lines.filter((l) => l.blank);
  const [answers, setAnswers] = useState<string[]>(() => blanks.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [shown, setShown] = useState(false);

  const results = blanks.map((b, i) => normalize(answers[i]) === normalize(b.text));
  const allCorrect = checked && results.every(Boolean);

  let blankIdx = -1;
  return (
    <>
      <p className="mt-6 text-xs text-faint">
        <Link className="text-muted-foreground hover:text-foreground" to="/drill/template" viewTransition>
          Template drill
        </Link>{" "}
        ·{" "}
        <Link className="text-muted-foreground hover:text-foreground" to={`/patterns/${pattern.slug}`} viewTransition>
          {pattern.name}
        </Link>
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Fill the blanks — {pattern.name}</h1>
      <p className="text-sm text-muted-foreground">
        Type each missing line (whitespace doesn&rsquo;t matter). The comment is your hint.
      </p>

      <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-card p-5 font-mono text-[13px] leading-loose">
        {lines.map((l, i) => {
          if (!l.blank) {
            return (
              <div key={i}>
                {l.text || " "}
                {l.comment && <span className="text-faint"> {"//"} {l.comment}</span>}
              </div>
            );
          }
          blankIdx++;
          const bi = blankIdx;
          const indent = l.text.match(/^\s*/)?.[0] ?? "";
          const ok = results[bi];
          return (
            <div key={i} className="flex items-center gap-1.5">
              <span>{indent}</span>
              {shown ? (
                <span className="bg-secondary px-1 font-semibold">{l.text.trim()}</span>
              ) : (
                <input
                  value={answers[bi]}
                  onChange={(e) => {
                    const next = [...answers];
                    next[bi] = e.target.value;
                    setAnswers(next);
                    setChecked(false);
                  }}
                  spellCheck={false}
                  placeholder="…"
                  className={`w-full max-w-md rounded border bg-background px-2 py-0.5 font-mono text-[13px] outline-none transition-colors ${
                    checked
                      ? ok
                        ? "border-foreground"
                        : "border-foreground border-dashed line-through"
                      : "border-input focus:border-foreground/60"
                  }`}
                />
              )}
              {checked && !shown && (ok ? <Check className="size-3.5 shrink-0" /> : <X className="size-3.5 shrink-0 opacity-60" />)}
              {l.comment && <span className="text-faint"> {"//"} {l.comment}</span>}
            </div>
          );
        })}
      </pre>

      <div className="mt-4 flex flex-wrap gap-2">
        {!shown && <Button onClick={() => setChecked(true)}>Check</Button>}
        {!shown && (
          <Button variant="ghost" onClick={() => setShown(true)}>
            Show answer
          </Button>
        )}
        <Button variant="outline" onClick={onNext}>
          Next random template
        </Button>
      </div>

      {checked && !shown && (
        <p className={`mt-4 text-sm font-semibold ${allCorrect ? "animate-pop" : "animate-shake"}`}>
          {allCorrect ? (
            <>
              All {blanks.length} correct — {pattern.mnemonic}
            </>
          ) : (
            <>
              {results.filter(Boolean).length} / {blanks.length} correct — fix the dashed lines or
              reveal.
            </>
          )}
        </p>
      )}
    </>
  );
}
