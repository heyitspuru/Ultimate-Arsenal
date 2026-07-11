import { Link } from "react-router-dom";
import { SPRINTS } from "../../lib/content";

export default function PatternGrid() {
  return (
    <>
      <h1>Patterns</h1>
      <p className="dim small">
        Names and mnemonics only — everything else is behind a recall gate on each page.
      </p>
      {SPRINTS.map(({ sprint, tier, patterns }) => (
        <section key={sprint}>
          <h2>
            Sprint {sprint} &middot; {tier}
          </h2>
          <div className="pattern-grid">
            {patterns.map((p) => (
              <Link key={p.slug} to={`/patterns/${p.slug}`} className="pattern-card">
                <span className="pc-n">{String(p.number).padStart(2, "0")}</span>
                <span className="pc-t">{p.name}</span>
                <span className="pc-m">{p.mnemonic}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
