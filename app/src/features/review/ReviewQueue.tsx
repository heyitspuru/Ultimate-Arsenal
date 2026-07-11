import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { diffClass } from "../../lib/content";
import type { ReviewCard } from "../../lib/srs/cards";
import { buildQueue, previewIntervals, rate, Rating, type QueueItem } from "../../lib/srs/engine";

function ClozeFront({ card, revealed }: { card: ReviewCard; revealed: boolean }) {
  return (
    <pre className="code" style={{ textAlign: "left" }}>
      {card.clozeLines?.map((l, i) => {
        if (!l.blank || revealed) {
          return (
            <div key={i}>
              {l.text}
              {l.comment && <span style={{ color: "var(--fg-faint)" }}> {"//"} {l.comment}</span>}
            </div>
          );
        }
        const indent = l.text.match(/^\s*/)?.[0] ?? "";
        return (
          <div key={i}>
            {indent}
            <span style={{ color: "var(--accent-soft)", fontWeight: 700 }}>▮▮▮▮▮▮▮▮</span>
            {l.comment && <span style={{ color: "var(--fg-faint)" }}> {"//"} {l.comment}</span>}
          </div>
        );
      })}
    </pre>
  );
}

function CardFace({ card, revealed }: { card: ReviewCard; revealed: boolean }) {
  if (card.kind === "cloze") {
    return (
      <>
        <p className="small faint" style={{ margin: 0 }}>
          {card.patternName} — recall the blanked lines
        </p>
        <ClozeFront card={card} revealed={revealed} />
        {revealed && (
          <p className="dim small" style={{ fontStyle: "italic" }}>
            {card.mnemonic}
          </p>
        )}
      </>
    );
  }
  return (
    <>
      <p className="small faint" style={{ margin: 0 }}>
        {card.kind === "keyword" ? "The problem says…" : "Re-solve it, then self-grade"}
      </p>
      <p style={{ fontSize: "1.1rem", fontFamily: "var(--mono)", margin: "0.5rem 0" }}>
        {card.kind === "keyword" ? (
          <>&ldquo;{card.front}&rdquo;</>
        ) : (
          <>
            <a href={card.url} target="_blank" rel="noreferrer">
              {card.front}
            </a>{" "}
            {card.diff && <span className={diffClass(card.diff)}>{card.diff}</span>}
          </>
        )}
      </p>
      {revealed ? (
        <>
          <p style={{ margin: "0.4rem 0" }}>
            <Link to={`/patterns/${card.patternSlug}`} style={{ fontWeight: 700 }}>
              {card.patternName}
            </Link>
          </p>
          <p className="dim small" style={{ fontStyle: "italic", margin: 0 }}>
            {card.mnemonic}
          </p>
        </>
      ) : (
        <p className="dim small">Which pattern?</p>
      )}
    </>
  );
}

const RATINGS = [
  { grade: Rating.Again, label: "Again", color: "var(--accent-soft)" },
  { grade: Rating.Hard, label: "Hard", color: "var(--amber)" },
  { grade: Rating.Good, label: "Good", color: "var(--green)" },
  { grade: Rating.Easy, label: "Easy", color: "var(--fg-dim)" },
] as const;

export default function ReviewQueue() {
  const [queue, setQueue] = useState<QueueItem[]>(() => buildQueue());
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);

  const item = queue[0];
  const intervals = useMemo(() => (item ? previewIntervals(item) : null), [item]);

  function grade(g: (typeof RATINGS)[number]["grade"]) {
    if (!item) return;
    const next = rate(item, g);
    setQueue((old) => {
      const rest = old.slice(1);
      // short intervals ("Again"/learning steps) come back within this session
      if (next.due.getTime() <= Date.now() + 10 * 60 * 1000) {
        return [...rest, { card: item.card, state: next, isNew: false }];
      }
      return rest;
    });
    setRevealed(false);
    setDone((d) => d + 1);
  }

  if (!item) {
    return (
      <>
        <h1>Review</h1>
        <div className="panel" style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "1.2rem", margin: "0 0 0.4rem" }}>
            {done > 0 ? `Session done — ${done} reviews.` : "Nothing due right now."}
          </p>
          <p className="dim small">
            New cards unlock at 10/day. Come back tomorrow, or drill the{" "}
            <Link to="/quiz">Pattern Picker</Link> meanwhile.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Review</h1>
      <p className="small faint" style={{ fontFamily: "var(--mono)" }}>
        {queue.length} left {item.isNew && "· new card"} · {done} done
      </p>
      <div className="panel" style={{ padding: "1.5rem", textAlign: "center" }}>
        <CardFace card={item.card} revealed={revealed} />
        {!revealed ? (
          <button className="btn primary" style={{ marginTop: "1rem" }} onClick={() => setRevealed(true)}>
            Show answer
          </button>
        ) : (
          <div className="row" style={{ justifyContent: "center", marginTop: "1rem" }}>
            {RATINGS.map((r) => (
              <button
                key={r.label}
                className="btn"
                style={{ borderColor: r.color, color: r.color, minWidth: 86 }}
                onClick={() => grade(r.grade)}
              >
                {r.label}
                {intervals && (
                  <span className="small faint" style={{ display: "block" }}>
                    {intervals[r.grade]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
