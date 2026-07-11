import { useState } from "react";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
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
      <h1>Decision Tree</h1>
      <p className="dim small">
        Answer each question; land on a pattern. Use this when the keyword table didn&rsquo;t give
        an instant hit.
      </p>

      {trail.length > 0 && (
        <p className="dt-crumbs">
          {trail.join(" → ")}
          {" · "}
          <a onClick={restart} style={{ cursor: "pointer" }}>
            restart
          </a>
        </p>
      )}

      {pattern ? (
        <div className="panel" style={{ textAlign: "center", padding: "1.8rem" }}>
          <p className="small faint" style={{ margin: 0 }}>
            You landed on
          </p>
          <h2 style={{ border: "none", padding: 0, fontSize: "1.5rem", margin: "0.4rem 0" }}>
            {pattern.name}
          </h2>
          <p className="dim" style={{ fontStyle: "italic" }}>
            {pattern.mnemonic}
          </p>
          <div
            className="wbox use"
            style={{ textAlign: "left", margin: "0.8rem auto", maxWidth: 560 }}
          >
            <div className="md">
              <Markdown>{pattern.use}</Markdown>
            </div>
          </div>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link className="btn primary" to={`/patterns/${pattern.slug}`}>
              Open {pattern.name}
            </Link>
            <button className="btn ghost" onClick={restart}>
              Start over
            </button>
          </div>
        </div>
      ) : node ? (
        <div className="panel" style={{ padding: "1.4rem" }}>
          <h2 style={{ border: "none", padding: 0, margin: "0 0 0.4rem" }}>{node.question}</h2>
          <div className="dt-options">
            {node.options.map((o) => (
              <button
                key={o.label}
                className="btn"
                onClick={() => {
                  setTrail((t) => [...t, o.label]);
                  if (o.slug) setLanded(o.slug);
                  else if (o.next) setNodeId(o.next);
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <h2>Three questions that resolve most ties</h2>
      <ol>
        {TIE_QUESTIONS.map((t, i) => (
          <li key={i} className="md">
            <Markdown>{t}</Markdown>
          </li>
        ))}
      </ol>
    </>
  );
}
