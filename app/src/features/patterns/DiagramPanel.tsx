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
          background: "#050505",
          primaryColor: "#111111",
          primaryTextColor: "#fafafa",
          primaryBorderColor: "#555555",
          lineColor: "#8a8a8a",
          secondaryColor: "#161616",
          tertiaryColor: "#111111",
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

/** Content sources carry a red `hot` classDef from the old theme — rewrite it
 *  to inverted white-on-black emphasis before rendering (mermaid's generated
 *  per-diagram stylesheet outspecifies anything we could inject via themeCSS). */
function monochromize(source: string): string {
  return source.replace(
    /classDef\s+hot\s+[^\n;]*/g,
    "classDef hot fill:#fafafa,stroke:#fafafa,color:#050505,stroke-width:2px",
  );
}

export default function DiagramPanel({ source }: { source: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadMermaid()
      .then((mermaid) => mermaid.render(`vault-diagram-${uid++}`, monochromize(source)))
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
    // legible fallback, mirrors the PDF's boxed source
    return (
      <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-xs">
        {source}
      </pre>
    );
  }
  return (
    <div
      className="overflow-x-auto rounded-xl border border-border bg-card p-4 [&_svg]:mx-auto"
      ref={ref}
    />
  );
}
