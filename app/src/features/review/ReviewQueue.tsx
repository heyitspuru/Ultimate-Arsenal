import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DiffTag from "@/components/DiffTag";
import type { ReviewCard } from "../../lib/srs/cards";
import { buildQueue, previewIntervals, rate, Rating, type QueueItem } from "../../lib/srs/engine";

function ClozeFront({ card, revealed }: { card: ReviewCard; revealed: boolean }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-background p-4 text-left font-mono text-[13px] leading-relaxed">
      {card.clozeLines?.map((l, i) => {
        if (!l.blank || revealed) {
          return (
            <div key={i} className={l.blank ? "bg-secondary/60" : undefined}>
              {l.text}
              {l.comment && <span className="text-faint"> {"//"} {l.comment}</span>}
            </div>
          );
        }
        const indent = l.text.match(/^\s*/)?.[0] ?? "";
        return (
          <div key={i}>
            {indent}
            <span className="rounded-sm bg-foreground px-1 font-bold text-foreground select-none">
              ▮▮▮▮▮▮
            </span>
            {l.comment && <span className="text-faint"> {"//"} {l.comment}</span>}
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
        <p className="label-mono">{card.patternName} — recall the blanked lines</p>
        <div className="mt-3">
          <ClozeFront card={card} revealed={revealed} />
        </div>
        {revealed && <p className="mt-2 text-xs italic text-muted-foreground">{card.mnemonic}</p>}
      </>
    );
  }
  return (
    <>
      <p className="label-mono">
        {card.kind === "keyword" ? "the problem says" : "re-solve it, then self-grade"}
      </p>
      <p className="mt-3 font-mono text-lg">
        {card.kind === "keyword" ? (
          <>&ldquo;{card.front}&rdquo;</>
        ) : (
          <>
            <a className="link-draw" href={card.url} target="_blank" rel="noreferrer">
              {card.front} ↗
            </a>{" "}
            {card.diff && <DiffTag diff={card.diff} />}
          </>
        )}
      </p>
      {revealed ? (
        <div className="animate-pop mt-3">
          <Link
            className="text-lg font-bold underline underline-offset-4"
            to={`/patterns/${card.patternSlug}`}
            viewTransition
          >
            {card.patternName}
          </Link>
          <p className="mt-1 text-xs italic text-muted-foreground">{card.mnemonic}</p>
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">Which pattern?</p>
      )}
    </>
  );
}

const RATINGS = [
  { grade: Rating.Again, label: "Again" },
  { grade: Rating.Hard, label: "Hard" },
  { grade: Rating.Good, label: "Good" },
  { grade: Rating.Easy, label: "Easy" },
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
        <h1 className="mt-8 text-3xl font-bold tracking-tight">Review</h1>
        <div className="mt-5 rounded-xl border border-border bg-card p-10 text-center">
          <p className="font-display text-xl font-semibold">
            {done > 0 ? `Session done — ${done} reviews.` : "Nothing due right now."}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            New cards unlock at 10/day. Come back tomorrow, or drill the{" "}
            <Link className="underline underline-offset-2" to="/quiz" viewTransition>
              Pattern Picker
            </Link>{" "}
            meanwhile.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Review</h1>
      <p className="mt-1 font-mono text-xs text-faint">
        {queue.length} left {item.isNew && "· new card"} · {done} done
      </p>
      <div className="mt-4 rounded-xl border border-border bg-card p-7 text-center">
        <CardFace card={item.card} revealed={revealed} />
        {!revealed ? (
          <Button className="mt-6" size="lg" onClick={() => setRevealed(true)}>
            Show answer
          </Button>
        ) : (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {RATINGS.map((r, i) => (
              <Button
                key={r.label}
                variant={i === 0 ? "outline" : i === 2 ? "default" : "secondary"}
                className="min-w-[92px] flex-col gap-0 py-1.5 h-auto"
                onClick={() => grade(r.grade)}
              >
                <span>{r.label}</span>
                {intervals && (
                  <span className="font-mono text-[10px] opacity-60">{intervals[r.grade]}</span>
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
