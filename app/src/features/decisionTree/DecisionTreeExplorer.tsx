import { useState } from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { DECISION_ROOT, DECISION_TREE, TIE_QUESTIONS } from "../../content/decision-tree";
import { patternBySlug } from "../../lib/content";

const NODES = new Map(DECISION_TREE.map((n) => [n.id, n]));

export default function DecisionTreeExplorer() {
  const [nodeId, setNodeId] = useState(DECISION_ROOT);
  const [landed, setLanded] = useState<string | null>(null); // pattern slug
  const [trail, setTrail] = useState<string[]>([]);

  const node = NODES.get(nodeId);
  const pattern = landed ? patternBySlug(landed) : null;

  function restart() {
    setNodeId(DECISION_ROOT);
    setLanded(null);
    setTrail([]);
  }

  return (
    <>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Decision Tree</h1>
      <p className="text-sm text-muted-foreground">
        Answer each question; land on a pattern. Use this when the keyword table didn&rsquo;t give
        an instant hit.
      </p>

      {trail.length > 0 && (
        <p className="mt-3 font-mono text-xs text-faint">
          {trail.join(" → ")} ·{" "}
          <button className="cursor-pointer underline underline-offset-2 hover:text-foreground" onClick={restart}>
            restart
          </button>
        </p>
      )}

      {pattern ? (
        <div className="mt-5 animate-pop rounded-xl border border-border bg-card p-8 text-center">
          <p className="label-mono">you landed on</p>
          <h2 className="mt-2 font-display text-3xl font-bold">{pattern.name}</h2>
          <p className="mt-1 text-sm italic text-muted-foreground">{pattern.mnemonic}</p>
          <div className="mx-auto mt-4 max-w-lg rounded-lg border border-border p-4 text-left text-sm [&_strong]:font-semibold">
            <Markdown>{pattern.use}</Markdown>
          </div>
          <div className="mt-5 flex justify-center gap-3">
            <Button asChild>
              <Link to={`/patterns/${pattern.slug}`} viewTransition>
                Open {pattern.name}
              </Link>
            </Button>
            <Button variant="ghost" onClick={restart}>
              Start over
            </Button>
          </div>
        </div>
      ) : node ? (
        <div className="mt-5 rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">{node.question}</h2>
          <div className="mt-4 flex flex-col gap-2">
            {node.options.map((o) => (
              <Button
                key={o.label}
                variant="outline"
                className="h-auto justify-start whitespace-normal py-2.5 text-left"
                onClick={() => {
                  setTrail((t) => [...t, o.label]);
                  if (o.slug) setLanded(o.slug);
                  else if (o.next) setNodeId(o.next);
                }}
              >
                {o.label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      <h2 className="label-mono mt-10 mb-2">Three questions that resolve most ties</h2>
      <ol className="list-decimal space-y-1.5 pl-5">
        {TIE_QUESTIONS.map((t, i) => (
          <li key={i} className="md text-sm [&_strong]:font-semibold">
            <Markdown>{t}</Markdown>
          </li>
        ))}
      </ol>
    </>
  );
}
