/** Monochrome difficulty scale: intensity, not hue. E outlined · M half · H inverted. */
export default function DiffTag({ diff }: { diff: string }) {
  const base = "rounded px-1.5 py-px font-mono text-2xs font-bold uppercase tracking-wider";
  if (diff === "Easy")
    return <span className={`${base} border border-border text-muted-foreground`}>E</span>;
  if (diff === "Hard") return <span className={`${base} bg-foreground text-background`}>H</span>;
  return <span className={`${base} bg-secondary text-foreground`}>M</span>;
}
