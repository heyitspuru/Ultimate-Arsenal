import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PATTERNS } from "../../lib/content";
import { countsToday } from "../../lib/srs/engine";

export default function Home() {
  const problemCount = PATTERNS.reduce((n, p) => n + p.problems.length, 0);
  const counts = useMemo(() => countsToday(), []);
  const dueTotal = counts.due + counts.fresh;

  return (
    <div className="hero">
      <h1>
        DSA Pattern <span className="accent">Vault</span>
      </h1>
      <p className="tag">keyword &rarr; pattern &rarr; template &middot; built for recall, not re-reading</p>
      <div className="hero-stats">
        <span>
          <b>{PATTERNS.length}</b> patterns
        </span>
        <span>
          <b>{problemCount}</b> problems
        </span>
        <span>
          <b>3</b> languages
        </span>
        <span>
          <b>{dueTotal}</b> cards due
        </span>
      </div>
      <div className="hero-actions">
        {dueTotal > 0 && (
          <Link className="btn primary" to="/review">
            Review {dueTotal} due card{dueTotal === 1 ? "" : "s"}
          </Link>
        )}
        <Link className={`btn ${dueTotal > 0 ? "" : "primary"}`} to="/quiz">
          Start a quiz round
        </Link>
        <Link className="btn" to="/drill/template">
          Drill a template
        </Link>
        <Link className="btn" to="/decision-tree">
          Walk the decision tree
        </Link>
        <Link className="btn ghost" to="/patterns">
          Browse patterns
        </Link>
      </div>
    </div>
  );
}
