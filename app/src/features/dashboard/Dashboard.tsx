import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PATTERNS } from "../../lib/content";
import { countsToday, loadLog, patternSummaries } from "../../lib/srs/engine";

function Tile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="panel" style={{ flex: "1 1 140px", textAlign: "center", padding: "0.9rem" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: "1.7rem", fontWeight: 700 }}>{value}</div>
      <div className="small faint">{label}</div>
      {hint && <div className="small faint" style={{ opacity: 0.7 }}>{hint}</div>}
    </div>
  );
}

/** Thin single-hue meter; the % text alongside carries the value (never color alone). */
function Meter({ value }: { value: number }) {
  return (
    <div
      style={{
        flex: 1,
        height: 6,
        borderRadius: 4,
        background: "rgba(255,255,255,0.07)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.round(value * 100)}%`,
          height: "100%",
          borderRadius: 4,
          background: "var(--accent-soft)",
          opacity: 0.75,
        }}
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
      <h1>Dashboard</h1>

      <div className="row" style={{ alignItems: "stretch" }}>
        <Tile label="due now" value={counts.due} />
        <Tile label="new available" value={counts.fresh} hint="10/day cap" />
        <Tile label="reviews today" value={reviewsToday} />
        <Tile label="day streak" value={streak} />
      </div>

      {!anyHistory ? (
        <div className="panel mt2" style={{ textAlign: "center", padding: "1.6rem" }}>
          <p style={{ margin: 0 }}>No review history yet.</p>
          <p className="dim small">
            Start a <Link to="/review">review session</Link> — strength per pattern shows up here.
          </p>
        </div>
      ) : (
        <>
          {weak.length > 0 && (
            <>
              <h2>Weak patterns</h2>
              <ul>
                {weak.map(({ p, s }) => (
                  <li key={p.slug}>
                    <Link to={`/patterns/${p.slug}`}>{p.name}</Link>{" "}
                    <span className="faint small">
                      {Math.round((s!.strength ?? 0) * 100)}% over {s!.reviews} reviews — re-gate
                      the page, then <Link to={`/drill/template/${p.slug}`}>drill the template</Link>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2>Per-pattern strength</h2>
          <p className="small faint">Share of reviews rated Good or Easy.</p>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {rows.map(({ p, s }) => (
              <div key={p.slug} className="row" style={{ gap: "0.7rem" }}>
                <Link
                  to={`/patterns/${p.slug}`}
                  style={{ width: 200, fontSize: "0.82rem", color: "var(--fg-dim)" }}
                >
                  {p.name}
                </Link>
                <Meter value={s!.strength ?? 0} />
                <span
                  className="small"
                  style={{ width: 88, fontFamily: "var(--mono)", textAlign: "right" }}
                >
                  {s!.strength === null ? "—" : `${Math.round(s!.strength * 100)}%`}
                  {s!.dueNow > 0 && <span className="faint"> · {s!.dueNow} due</span>}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
