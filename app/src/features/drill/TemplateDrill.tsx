import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PATTERNS, patternBySlug } from "../../lib/content";
import type { Pattern } from "../../content/types";
import { makeDebugRound, makeFillRound, sameCode } from "./drillEngine";

type Mode = "fill" | "debug";

function randomSlug(exclude?: string): string {
  const candidates = PATTERNS.filter((p) => p.templates.java.trim() && p.slug !== exclude);
  return candidates[Math.floor(Math.random() * candidates.length)].slug;
}

export default function TemplateDrill() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("fill");
  const [nonce, setNonce] = useState(0); // bump = new random round on the same template
  const pattern = slug ? patternBySlug(slug) : undefined;

  if (!slug) return <RedirectToRandom />;
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

  const next = () => navigate(`/drill/template/${randomSlug(pattern.slug)}`);
  const reroll = () => setNonce((n) => n + 1);

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
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">
          {mode === "fill" ? "Fill the blanks" : "Fix the bug"} — {pattern.name}
        </h1>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {(["fill", "debug"] as Mode[]).map((m) => (
            <Button
              key={m}
              size="sm"
              variant={mode === m ? "default" : "ghost"}
              onClick={() => {
                setMode(m);
                setNonce((n) => n + 1);
              }}
            >
              {m === "fill" ? "Fill blanks" : "Fix the bug"}
            </Button>
          ))}
        </div>
      </div>

      {mode === "fill" ? (
        <FillDrill key={`${pattern.slug}:${nonce}`} pattern={pattern} onNext={next} onReroll={reroll} />
      ) : (
        <DebugDrill key={`${pattern.slug}:${nonce}`} pattern={pattern} onNext={next} onReroll={reroll} />
      )}
    </>
  );
}

function RedirectToRandom() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/drill/template/${randomSlug()}`, { replace: true });
  }, [navigate]);
  return null;
}

/* ---------------------------------------------------------------- fill mode */

function FillDrill({ pattern, onNext, onReroll }: { pattern: Pattern; onNext: () => void; onReroll: () => void }) {
  // blanks ROTATE: a fresh random subset of lines every round
  const lines = useMemo(() => makeFillRound(pattern.templates.java), [pattern]);
  const blanks = lines.filter((l) => l.blank);
  const [answers, setAnswers] = useState<string[]>(() => blanks.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [shown, setShown] = useState(false);

  const results = blanks.map((b, i) => sameCode(answers[i], b.text));
  const allCorrect = checked && results.every(Boolean);

  let blankIdx = -1;
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Type each missing line (whitespace doesn&rsquo;t matter). Different lines every round.
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
                        : "border-dashed border-foreground line-through"
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
        <Button variant="outline" onClick={onReroll}>
          New blanks, same template
        </Button>
        <Button variant="outline" onClick={onNext}>
          Next random template
        </Button>
      </div>

      {checked && !shown && (
        <p className={`mt-4 text-sm font-semibold ${allCorrect ? "animate-pop" : "animate-shake"}`}>
          {allCorrect ? (
            <>All {blanks.length} correct — {pattern.mnemonic}</>
          ) : (
            <>{results.filter(Boolean).length} / {blanks.length} correct — fix the dashed lines or reveal.</>
          )}
        </p>
      )}
    </>
  );
}

/* --------------------------------------------------------------- debug mode */

function DebugDrill({ pattern, onNext, onReroll }: { pattern: Pattern; onNext: () => void; onReroll: () => void }) {
  const round = useMemo(() => makeDebugRound(pattern.templates.java), [pattern]);
  const [wrongPicks, setWrongPicks] = useState<Set<number>>(new Set());
  const [found, setFound] = useState(false);
  const [fix, setFix] = useState("");
  const [checked, setChecked] = useState(false);
  const [shown, setShown] = useState(false);

  if (!round) {
    // no mutation site (shouldn't happen on these templates) — fill covers it
    return (
      <p className="mt-4 text-sm text-muted-foreground">
        This template has no sabotage sites — use Fill blanks instead.
      </p>
    );
  }

  const fixOk = sameCode(fix, round.originalCode);

  function pickLine(i: number) {
    if (found || shown) return;
    if (i === round!.bugIndex) {
      setFound(true);
      setFix(round!.lines[i].code.trim()); // start from the buggy line, edit it
    } else {
      setWrongPicks((s) => new Set(s).add(i));
    }
  }

  return (
    <>
      <p className="text-sm text-muted-foreground">
        One line was sabotaged — bug type:{" "}
        <strong className="text-foreground">{round.category}</strong>. The comments still describe
        the <em>intended</em> behavior. Click the line that&rsquo;s wrong
        {found && <>, then restore it</>}.
      </p>

      <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-card p-5 font-mono text-[13px] leading-loose">
        {round.lines.map((l, i) => {
          const indent = l.code.match(/^\s*/)?.[0] ?? "";
          if ((found || shown) && i === round.bugIndex) {
            return (
              <div key={i} className="flex items-center gap-1.5">
                <span>{indent}</span>
                {shown ? (
                  <span className="bg-secondary px-1 font-semibold">{round.originalCode.trim()}</span>
                ) : (
                  <input
                    value={fix}
                    onChange={(e) => {
                      setFix(e.target.value);
                      setChecked(false);
                    }}
                    spellCheck={false}
                    autoFocus
                    className={`w-full max-w-md rounded border bg-background px-2 py-0.5 font-mono text-[13px] outline-none transition-colors ${
                      checked
                        ? fixOk
                          ? "border-foreground"
                          : "border-dashed border-foreground"
                        : "border-input focus:border-foreground/60"
                    }`}
                  />
                )}
                {checked && !shown && (fixOk ? <Check className="size-3.5 shrink-0" /> : <X className="size-3.5 shrink-0 opacity-60" />)}
                {l.comment && <span className="text-faint"> {"//"} {l.comment}</span>}
              </div>
            );
          }
          const struck = wrongPicks.has(i);
          return (
            <div
              key={i}
              onClick={() => pickLine(i)}
              className={`-mx-2 rounded px-2 transition-colors ${
                found || shown
                  ? ""
                  : struck
                    ? "cursor-not-allowed line-through opacity-40"
                    : "cursor-pointer hover:bg-secondary/60"
              }`}
            >
              {l.code || " "}
              {l.comment && <span className="text-faint"> {"//"} {l.comment}</span>}
            </div>
          );
        })}
      </pre>

      {!found && !shown && wrongPicks.size > 0 && (
        <p className="animate-shake mt-3 text-sm font-semibold">
          Not that line — {wrongPicks.size} miss{wrongPicks.size > 1 ? "es" : ""}.
          {wrongPicks.size >= 3 && " Read the comments: one line contradicts its own."}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {found && !shown && <Button onClick={() => setChecked(true)}>Check fix</Button>}
        {!shown && (
          <Button variant="ghost" onClick={() => setShown(true)}>
            Reveal
          </Button>
        )}
        <Button variant="outline" onClick={onReroll}>
          New bug, same template
        </Button>
        <Button variant="outline" onClick={onNext}>
          Next random template
        </Button>
      </div>

      {checked && found && !shown && (
        <p className={`mt-4 text-sm font-semibold ${fixOk ? "animate-pop" : "animate-shake"}`}>
          {fixOk ? (
            <>Fixed — {pattern.mnemonic}</>
          ) : (
            <>Not quite the canonical line — keep editing or reveal.</>
          )}
        </p>
      )}
      {shown && (
        <p className="mt-4 text-sm text-muted-foreground">
          The bug: <code className="text-foreground">{round.lines[round.bugIndex].code.trim()}</code>{" "}
          should be <code className="text-foreground">{round.originalCode.trim()}</code> ({round.category}).
        </p>
      )}
    </>
  );
}
