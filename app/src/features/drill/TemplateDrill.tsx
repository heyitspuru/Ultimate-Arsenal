import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
        <h1>Nothing to drill here</h1>
        <p>
          <Link to="/drill/template">Try a random template</Link>
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
      <p className="small faint" style={{ marginTop: "1rem" }}>
        <Link to="/drill/template">Template drill</Link> &middot;{" "}
        <Link to={`/patterns/${pattern.slug}`}>{pattern.name}</Link>
      </p>
      <h1>Fill the blanks — {pattern.name}</h1>
      <p className="dim small">
        Type each missing line (whitespace doesn&rsquo;t matter). The comment is your hint.
      </p>

      <pre className="code">
        {lines.map((l, i) => {
          if (!l.blank) {
            return (
              <div key={i}>
                {l.text || " "}
                {l.comment && <span style={{ color: "var(--fg-faint)" }}> {"//"} {l.comment}</span>}
              </div>
            );
          }
          blankIdx++;
          const bi = blankIdx;
          const indent = l.text.match(/^\s*/)?.[0] ?? "";
          const ok = results[bi];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>{indent}</span>
              {shown ? (
                <span style={{ color: "var(--green)" }}>{l.text.trim()}</span>
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
                  style={{
                    flex: 1,
                    maxWidth: 460,
                    fontFamily: "var(--mono)",
                    fontSize: "0.8rem",
                    color: "var(--fg)",
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${
                      checked ? (ok ? "var(--green)" : "var(--accent)") : "rgba(255,255,255,0.18)"
                    }`,
                    borderRadius: 5,
                    padding: "0.15rem 0.5rem",
                    outline: "none",
                  }}
                />
              )}
              {l.comment && <span style={{ color: "var(--fg-faint)" }}>{"//"} {l.comment}</span>}
            </div>
          );
        })}
      </pre>

      <div className="row">
        {!shown && (
          <button className="btn primary" onClick={() => setChecked(true)}>
            Check
          </button>
        )}
        {!shown && (
          <button className="btn ghost" onClick={() => setShown(true)}>
            Show answer
          </button>
        )}
        <button className="btn" onClick={onNext}>
          Next random template
        </button>
      </div>

      {checked && !shown && (
        <p style={{ marginTop: "0.8rem" }}>
          {allCorrect ? (
            <strong style={{ color: "var(--green)" }}>
              All {blanks.length} correct — {pattern.mnemonic}
            </strong>
          ) : (
            <strong style={{ color: "var(--accent-soft)" }}>
              {results.filter(Boolean).length} / {blanks.length} correct — fix the red lines or
              reveal.
            </strong>
          )}
        </p>
      )}
    </>
  );
}
