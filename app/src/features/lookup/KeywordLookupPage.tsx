import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import { KEYWORD_LOOKUP, patternBySlug } from "../../lib/content";
import type { KeywordRow } from "../../content/types";

function randomRow(exclude?: KeywordRow): KeywordRow {
  const { rows } = KEYWORD_LOOKUP;
  let row = rows[Math.floor(Math.random() * rows.length)];
  while (rows.length > 1 && row === exclude) {
    row = rows[Math.floor(Math.random() * rows.length)];
  }
  return row;
}

function FlashCard() {
  const [row, setRow] = useState<KeywordRow>(() => randomRow());
  const [revealed, setRevealed] = useState(false);
  const pattern = patternBySlug(row.slug);

  return (
    <div className="panel" style={{ textAlign: "center", padding: "1.6rem" }}>
      <p className="small faint" style={{ margin: 0 }}>
        The problem says&hellip;
      </p>
      <p style={{ fontSize: "1.15rem", fontFamily: "var(--mono)", margin: "0.6rem 0 1rem" }}>
        &ldquo;{row.phrase}&rdquo;
      </p>
      {revealed ? (
        <>
          <p style={{ margin: "0.4rem 0" }}>
            Reach for{" "}
            <Link to={`/patterns/${row.slug}`} style={{ fontWeight: 700 }}>
              {row.pattern}
            </Link>
          </p>
          {pattern && (
            <p className="dim small" style={{ fontStyle: "italic" }}>
              {pattern.mnemonic}
            </p>
          )}
          <button
            className="btn primary"
            onClick={() => {
              setRow(randomRow(row));
              setRevealed(false);
            }}
          >
            Next phrase
          </button>
        </>
      ) : (
        <>
          <p className="dim small">Which pattern? Answer out loud, then check.</p>
          <button className="btn primary" onClick={() => setRevealed(true)}>
            Check answer
          </button>
        </>
      )}
    </div>
  );
}

export default function KeywordLookupPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return KEYWORD_LOOKUP.rows;
    return KEYWORD_LOOKUP.rows.filter(
      (r) => r.phrase.toLowerCase().includes(needle) || r.pattern.toLowerCase().includes(needle),
    );
  }, [q]);

  return (
    <>
      <h1>Keyword &rarr; Pattern</h1>
      <p className="dim small">
        Drill the reflex: phrase in, pattern out, in under 10 seconds.
      </p>

      <FlashCard />

      <h2>Lookup table</h2>
      <input
        className="search"
        placeholder="filter phrases or patterns…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="tablewrap">
        <table className="vault">
          <thead>
            <tr>
              <th>If the problem says&hellip;</th>
              <th>Reach for</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.phrase}>
                <td>{r.phrase}</td>
                <td>
                  <Link to={`/patterns/${r.slug}`}>{r.pattern}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Fast tie-breakers</h2>
      <ul>
        {KEYWORD_LOOKUP.tieBreakers.map((t, i) => (
          <li key={i} className="md">
            <Markdown>{t}</Markdown>
          </li>
        ))}
      </ul>
    </>
  );
}
