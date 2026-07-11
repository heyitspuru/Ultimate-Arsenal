import { useState, type ReactNode } from "react";

/**
 * Session-only recall gate: children stay hidden until the user commits to a
 * reveal. Intentionally NOT persisted — every visit forces one retrieval rep.
 */
export default function RevealGate({
  prompt,
  cta = "Reveal",
  children,
}: {
  prompt: string;
  cta?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  if (open) return <>{children}</>;
  return (
    <div className="gate">
      <p className="hint">{prompt}</p>
      <button className="btn primary" onClick={() => setOpen(true)}>
        {cta}
      </button>
    </div>
  );
}
