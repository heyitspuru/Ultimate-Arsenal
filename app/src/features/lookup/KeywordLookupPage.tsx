import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <div className="mt-5 rounded-xl border border-border bg-card p-8 text-center">
      <p className="label-mono">the problem says</p>
      <p className="mt-2 mb-4 font-mono text-lg">&ldquo;{row.phrase}&rdquo;</p>
      {revealed ? (
        <div className="animate-pop">
          <p className="text-sm">
            Reach for{" "}
            <Link
              className="font-bold underline underline-offset-4"
              to={`/patterns/${row.slug}`}
              viewTransition
            >
              {row.pattern}
            </Link>
          </p>
          {pattern && <p className="mt-1 text-xs italic text-muted-foreground">{pattern.mnemonic}</p>}
          <Button
            className="mt-4"
            onClick={() => {
              setRow(randomRow(row));
              setRevealed(false);
            }}
          >
            Next phrase
          </Button>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">Which pattern? Answer out loud, then check.</p>
          <Button className="mt-4" onClick={() => setRevealed(true)}>
            Check answer
          </Button>
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
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Keyword → Pattern</h1>
      <p className="text-sm text-muted-foreground">
        Drill the reflex: phrase in, pattern out, in under 10 seconds.
      </p>

      <FlashCard />

      <h2 className="label-mono mt-10 mb-3">Lookup table</h2>
      <Input
        className="max-w-sm font-mono text-xs"
        placeholder="filter phrases or patterns…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <Table className="mt-3">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="label-mono before:content-none">If the problem says…</TableHead>
            <TableHead className="label-mono before:content-none">Reach for</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((r) => (
            <TableRow key={r.phrase}>
              <TableCell className="whitespace-normal text-caption">{r.phrase}</TableCell>
              <TableCell>
                <Link className="link-draw text-caption" to={`/patterns/${r.slug}`} viewTransition>
                  {r.pattern}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 className="label-mono mt-10 mb-2">Fast tie-breakers</h2>
      <ul className="space-y-1.5">
        {KEYWORD_LOOKUP.tieBreakers.map((t, i) => (
          <li key={i} className="md text-sm [&_strong]:font-semibold">
            <Markdown>{t}</Markdown>
          </li>
        ))}
      </ul>
    </>
  );
}
