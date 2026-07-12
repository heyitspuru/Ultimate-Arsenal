import { Link } from "react-router-dom";
import { SPRINTS } from "../../lib/content";

export default function PatternGrid() {
  return (
    <>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Patterns</h1>
      <p className="text-sm text-muted-foreground">
        Names and mnemonics only — everything else is behind a recall gate on each page.
      </p>
      {SPRINTS.map(({ sprint, tier, patterns }) => (
        <section key={sprint}>
          <h2 className="label-mono mt-10 mb-3">
            Sprint {sprint} · {tier}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {patterns.map((p) => (
              <Link
                key={p.slug}
                to={`/patterns/${p.slug}`}
                viewTransition
                className="group relative block rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/60"
              >
                <span className="absolute right-3 top-3 font-mono text-[11px] text-faint transition-colors group-hover:text-foreground">
                  {String(p.number).padStart(2, "0")}
                </span>
                <span className="block pr-8 font-medium tracking-tight group-hover:underline group-hover:underline-offset-4">
                  {p.name}
                </span>
                <span className="mt-1 block text-xs italic text-muted-foreground">
                  {p.mnemonic}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
