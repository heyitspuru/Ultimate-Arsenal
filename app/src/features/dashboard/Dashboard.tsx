import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PATTERNS } from "../../lib/content";
import { countsToday, loadLog, patternSummaries } from "../../lib/srs/engine";

function Tile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="flex-1 basis-36 rounded-xl border border-border bg-card p-4 text-center">
      <div className="font-mono text-2xl font-bold">{value}</div>
      <div className="text-mini uppercase tracking-widest text-faint">{label}</div>
      {hint && <div className="text-2xs text-faint opacity-70">{hint}</div>}
    </div>
  );
}

/** Thin single-ink meter; the % text alongside carries the value (never color alone). */
function Meter({ value }: { value: number }) {
  return (
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full bg-foreground transition-[width] duration-300"
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export default function Dashboard() {
  const { summaries, counts, reviewsToday, streak } = useMemo(() => {
    const log = loadLog();
    const today = dayKey(Date.now());
    const days = new Set(log.map((e) => dayKey(e.ts)));
    // streak: consecutive days ending today (or yesterday, so a morning visit doesn't show 0)
    let streak = 0;
    const cursor = new Date();
    if (!days.has(today)) cursor.setDate(cursor.getDate() - 1);
    while (days.has(cursor.toISOString().slice(0, 10))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return {
      summaries: patternSummaries(),
      counts: countsToday(),
      reviewsToday: log.filter((e) => dayKey(e.ts) === today).length,
      streak,
    };
  }, []);

  const rows = PATTERNS.map((p) => ({ p, s: summaries.get(p.slug) })).filter((r) => r.s);
  const weak = rows
    .filter((r) => r.s!.reviews >= 3 && r.s!.strength !== null && r.s!.strength < 0.7)
    .sort((a, b) => a.s!.strength! - b.s!.strength!)
    .slice(0, 5);
  const anyHistory = rows.some((r) => r.s!.reviews > 0);

  return (
    <>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <Tile label="due now" value={counts.due} />
        <Tile label="new available" value={counts.fresh} hint="10/day cap" />
        <Tile label="reviews today" value={reviewsToday} />
        <Tile label="day streak" value={streak} />
      </div>

      {!anyHistory ? (
        <div className="mt-6 rounded-xl border border-border bg-card p-8 text-center">
          <p className="font-display font-semibold">No review history yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start a{" "}
            <Link className="underline underline-offset-2" to="/review" viewTransition>
              review session
            </Link>{" "}
            — strength per pattern shows up here.
          </p>
        </div>
      ) : (
        <>
          {weak.length > 0 && (
            <>
              <h2 className="label-mono mt-8 mb-2">Weak patterns</h2>
              <ul className="space-y-1.5">
                {weak.map(({ p, s }) => (
                  <li key={p.slug} className="text-sm">
                    <Link
                      className="font-semibold underline underline-offset-4"
                      to={`/patterns/${p.slug}`}
                      viewTransition
                    >
                      {p.name}
                    </Link>{" "}
                    <span className="text-xs text-faint">
                      {Math.round((s!.strength ?? 0) * 100)}% over {s!.reviews} reviews — re-gate
                      the page, then{" "}
                      <Link
                        className="underline underline-offset-2"
                        to={`/drill/template/${p.slug}`}
                        viewTransition
                      >
                        drill the template
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2 className="label-mono mt-8 mb-1">Per-pattern strength</h2>
          <p className="text-xs text-faint">Share of reviews rated Good or Easy.</p>
          <div className="mt-3 grid gap-2">
            {rows.map(({ p, s }) => (
              <div key={p.slug} className="flex items-center gap-3">
                <Link
                  className="w-[clamp(7rem,28vw,12rem)] truncate text-caption text-muted-foreground hover:text-foreground"
                  to={`/patterns/${p.slug}`}
                  viewTransition
                >
                  {p.name}
                </Link>
                <Meter value={s!.strength ?? 0} />
                <span className="w-24 text-right font-mono text-xs">
                  {s!.strength === null ? "—" : `${Math.round(s!.strength * 100)}%`}
                  {s!.dueNow > 0 && <span className="text-faint"> · {s!.dueNow} due</span>}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
