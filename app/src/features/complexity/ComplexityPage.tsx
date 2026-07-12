import { useMemo, useState } from "react";
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
import { COMPLEXITY } from "../../lib/content";

/** One per-pattern cell; in quiz mode Time/Space hide behind a click-to-reveal. */
function QuizCell({ value, quiz }: { value: string; quiz: boolean }) {
  const [shown, setShown] = useState(false);
  if (!quiz || shown) return <TableCell className="font-mono text-xs">{value}</TableCell>;
  return (
    <TableCell>
      <Button variant="outline" size="xs" className="font-mono" onClick={() => setShown(true)}>
        ?
      </Button>
    </TableCell>
  );
}

export default function ComplexityPage() {
  const [q, setQ] = useState("");
  const [quiz, setQuiz] = useState(false);
  // key bump forces QuizCell remount (re-hide) when toggling quiz mode
  const [round, setRound] = useState(0);

  const perPattern = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return COMPLEXITY.perPattern;
    return COMPLEXITY.perPattern.filter((r) => r.pattern.toLowerCase().includes(needle));
  }, [q]);

  const th = "label-mono before:content-none";

  return (
    <>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Complexity Cheatsheet</h1>
      <p className="text-sm text-muted-foreground">Memorize the shapes, not the rows.</p>

      <h2 className="label-mono mt-8 mb-3">Per-pattern Big-O</h2>
      <div className="flex flex-wrap items-center gap-3">
        <Input
          className="max-w-xs font-mono text-xs"
          placeholder="filter patterns…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button
          variant={quiz ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setQuiz(!quiz);
            setRound((r) => r + 1);
          }}
        >
          {quiz ? "Quiz mode: on" : "Quiz mode"}
        </Button>
      </div>
      <Table className="mt-3">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={th}>Pattern</TableHead>
            <TableHead className={th}>Time</TableHead>
            <TableHead className={th}>Space</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {perPattern.map((r) => (
            <TableRow key={`${r.pattern}-${round}`}>
              <TableCell className="text-[13px]">{r.pattern}</TableCell>
              <QuizCell value={r.time} quiz={quiz} />
              <QuizCell value={r.space} quiz={quiz} />
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 className="label-mono mt-10 mb-3">Data-structure operations</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {["Structure", "Access", "Search", "Insert", "Delete", "Notes"].map((h) => (
                <TableHead key={h} className={th}>
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {COMPLEXITY.dsOps.map((r) => (
              <TableRow key={r.structure}>
                <TableCell className="text-[13px]">{r.structure}</TableCell>
                <TableCell className="font-mono text-xs">{r.access}</TableCell>
                <TableCell className="font-mono text-xs">{r.search}</TableCell>
                <TableCell className="font-mono text-xs">{r.insert}</TableCell>
                <TableCell className="font-mono text-xs">{r.delete}</TableCell>
                <TableCell className="text-xs text-faint">{r.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h2 className="label-mono mt-10 mb-3">Growth reference</h2>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={th}>Big-O</TableHead>
            <TableHead className={th}>~ops at n = 10⁵</TableHead>
            <TableHead className={th}>Feels like</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {COMPLEXITY.growth.map((r) => (
            <TableRow key={r.bigO}>
              <TableCell className="font-mono text-xs">{r.bigO}</TableCell>
              <TableCell className="font-mono text-xs">{r.ops}</TableCell>
              <TableCell className="text-[13px]">{r.feels}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
