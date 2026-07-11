import { useEffect, useRef, useState } from "react";

let mermaidReady: Promise<typeof import("mermaid")["default"]> | null = null;

/** Self-hosted Mermaid (dynamic import — keeps it out of the main bundle),
 *  themed to the vault's charcoal/red palette (replaces content/js/mermaid-init.js). */
function loadMermaid() {
  if (!mermaidReady) {
    mermaidReady = import("mermaid").then((m) => {
      m.default.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          darkMode: true,
          background: "#0e0e11",
          primaryColor: "#131319",
          primaryTextColor: "#e8e8ec",
          primaryBorderColor: "#3a3a44",
          lineColor: "#83858f",
          secondaryColor: "#1a1a20",
          tertiaryColor: "#131319",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "13px",
        },
      });
      return m.default;
    });
  }
  return mermaidReady;
}

let uid = 0;

export default function DiagramPanel({ source }: { source: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadMermaid()
      .then((mermaid) => mermaid.render(`vault-diagram-${uid++}`, source))
      .then(({ svg }) => {
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  if (error) {
    return <pre className="code">{source}</pre>; // legible fallback, mirrors the PDF's boxed source
  }
  return <div className="panel" style={{ overflowX: "auto" }} ref={ref} />;
}
