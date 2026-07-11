import { Link, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { diffClass, patternBySlug } from "../../lib/content";
import RevealGate from "./RevealGate";
import DiagramPanel from "./DiagramPanel";
import TemplateTabs from "./TemplateTabs";

function Md({ children }: { children: string }) {
  return (
    <div className="md">
      <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
    </div>
  );
}

export default function PatternDetail() {
  const { slug } = useParams();
  const p = slug ? patternBySlug(slug) : undefined;

  if (!p) {
    return (
      <>
        <h1>Pattern not found</h1>
        <p>
          <Link to="/patterns">&larr; All patterns</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <p className="small faint" style={{ marginTop: "1rem" }}>
        <Link to="/patterns">&larr; Patterns</Link> &middot; Sprint {p.sprint} &middot; {p.tier}
      </p>
      <h1>
        <span className="faint" style={{ fontFamily: "var(--mono)", fontSize: "0.8em" }}>
          {String(p.number).padStart(2, "0")}
        </span>{" "}
        {p.name}
      </h1>

      <h2>Signal keywords</h2>
      <div>
        {p.signals.map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </div>

      {/* Everything below is the recall payload — gated so you retrieve first. */}
      <RevealGate
        prompt={`Before revealing: say the mnemonic out loud, then sketch the ${p.name} template in your head. What's the core loop? The complexity?`}
        cta="I recalled it — reveal"
      >
        <div className="mnemonic">
          Mnemonic: <strong>{p.mnemonic}</strong>
        </div>

        <h2>When to use / NOT use</h2>
        <div className="usenot">
          <div className="wbox use">
            <Md>{p.use}</Md>
          </div>
          <div className="wbox avoid">
            <Md>{p.avoid}</Md>
          </div>
        </div>

        <h2>Diagram</h2>
        <DiagramPanel source={p.diagram} />

        <h2>{p.templateSectionTitle}</h2>
        {p.templateVariants.map((v, i) => (
          <div key={i}>
            {v.title && <h3>{v.title}</h3>}
            <TemplateTabs templates={v.templates} />
            {v.note && <p className="small faint">{v.note}</p>}
          </div>
        ))}

        <h2>Complexity</h2>
        <p>
          <code>{p.complexity.time}</code> time &middot; <code>{p.complexity.space}</code> space
        </p>
        {p.complexityNote && <Md>{p.complexityNote}</Md>}

        <h2>Pitfalls</h2>
        <ul>
          {p.pitfalls.map((pit, i) => (
            <li key={i}>
              <Md>{pit}</Md>
            </li>
          ))}
        </ul>
      </RevealGate>

      <h2>Canonical problems</h2>
      <p className="small dim">Re-solve, don't re-read — open one and drill it.</p>
      <ol>
        {p.problems.map((prob) => (
          <li key={prob.url}>
            <a href={prob.url} target="_blank" rel="noreferrer">
              {prob.name}
            </a>{" "}
            <span className={diffClass(prob.diff)}>{prob.diff}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
