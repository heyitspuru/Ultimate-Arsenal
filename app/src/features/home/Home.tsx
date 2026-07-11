import { Link } from "react-router-dom";
import { PATTERNS } from "../../lib/content";

export default function Home() {
  const problemCount = PATTERNS.reduce((n, p) => n + p.problems.length, 0);
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
      </div>
      <div className="hero-actions">
        <Link className="btn primary" to="/lookup">
          Drill keyword &rarr; pattern
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
