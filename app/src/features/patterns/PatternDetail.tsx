import { Link, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DiffTag from "@/components/DiffTag";
import { patternBySlug } from "../../lib/content";
import SignalGate from "./SignalGate";
import DiagramPanel from "./DiagramPanel";
import TemplateTabs from "./TemplateTabs";

function Md({ children }: { children: string }) {
  return (
    <div className="md text-sm leading-relaxed [&_strong]:font-semibold">
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
        <h1 className="mt-8 text-3xl font-bold">Pattern not found</h1>
        <p className="mt-2">
          <Link className="link-draw" to="/patterns" viewTransition>
            ← All patterns
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <p className="mt-6 text-xs text-faint">
        <Link className="text-muted-foreground hover:text-foreground" to="/patterns" viewTransition>
          ← Patterns
        </Link>{" "}
        · Sprint {p.sprint} · {p.tier}
      </p>
      <h1 className="mt-2 flex items-baseline gap-3 text-3xl font-bold tracking-tight">
        <span className="font-mono text-lg font-normal text-faint">
          {String(p.number).padStart(2, "0")}
        </span>
        {p.name}
      </h1>

      {/* Everything below is the recall payload — gated so you retrieve first.
          key: full state reset when navigating between patterns — the gate
          must re-arm on every page, never leak "open" across slugs. */}
      <SignalGate key={p.slug} pattern={p}>
        <h2 className="label-mono mt-8 mb-2">Signal keywords</h2>
        <div className="flex flex-wrap gap-1.5">
          {p.signals.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              {s}
            </span>
          ))}
        </div>

        <blockquote className="mt-4 border-l-2 border-foreground pl-4 text-[15px]">
          Mnemonic: <strong>{p.mnemonic}</strong>
        </blockquote>

        <h2 className="label-mono mt-8 mb-2">When to use / NOT use</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4 [&_strong]:underline [&_strong]:underline-offset-4">
            <Md>{p.use}</Md>
          </div>
          <div className="rounded-lg border border-dashed border-border bg-transparent p-4 opacity-80 [&_strong]:line-through">
            <Md>{p.avoid}</Md>
          </div>
        </div>

        <h2 className="label-mono mt-8 mb-2">Diagram</h2>
        <DiagramPanel source={p.diagram} />

        <h2 className="label-mono mt-8 mb-2">{p.templateSectionTitle}</h2>
        {p.templateVariants.map((v, i) => (
          <div key={i}>
            {v.title && <h3 className="mt-4 text-sm font-semibold">{v.title}</h3>}
            <TemplateTabs templates={v.templates} />
            {v.note && <p className="mt-1 text-xs text-faint">{v.note}</p>}
          </div>
        ))}

        <h2 className="label-mono mt-8 mb-2">Complexity</h2>
        <p className="font-mono text-sm">
          <span className="rounded bg-secondary px-2 py-0.5">{p.complexity.time}</span> time ·{" "}
          <span className="rounded bg-secondary px-2 py-0.5">{p.complexity.space}</span> space
        </p>
        {p.complexityNote && (
          <div className="mt-2 text-muted-foreground">
            <Md>{p.complexityNote}</Md>
          </div>
        )}

        <h2 className="label-mono mt-8 mb-2">Pitfalls</h2>
        <ul className="space-y-1.5">
          {p.pitfalls.map((pit, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="mt-0.5 font-mono text-faint">✕</span>
              <Md>{pit}</Md>
            </li>
          ))}
        </ul>
      </SignalGate>

      <h2 className="label-mono mt-8 mb-2">Canonical problems</h2>
      <p className="text-xs text-muted-foreground">Re-solve, don&rsquo;t re-read — open one and drill it.</p>
      <ol className="mt-2 space-y-1.5">
        {p.problems.map((prob, i) => (
          <li key={prob.url} className="flex items-baseline gap-3 text-sm">
            <span className="font-mono text-xs text-faint">{i + 1}</span>
            <a className="link-draw" href={prob.url} target="_blank" rel="noreferrer">
              {prob.name}
            </a>
            <DiffTag diff={prob.diff} />
          </li>
        ))}
      </ol>
    </>
  );
}

