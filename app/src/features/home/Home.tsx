import { useMemo } from "react";
import { Link } from "react-router-dom";
import LightRays from "@/components/LightRays";
import { Button } from "@/components/ui/button";
import { PATTERNS } from "../../lib/content";
import { countsToday } from "../../lib/srs/engine";

export default function Home() {
  const problemCount = PATTERNS.reduce((n, p) => n + p.problems.length, 0);
  const counts = useMemo(() => countsToday(), []);
  const dueTotal = counts.due + counts.fresh;

  return (
    <div className="relative -mx-5 overflow-hidden">
      {/* white volumetric rays — the single statement piece */}
      <div className="pointer-events-none absolute inset-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          saturation={0}
          raysSpeed={0.9}
          lightSpread={1.1}
          rayLength={1.6}
          followMouse
          mouseInfluence={0.08}
          noiseAmount={0.04}
          className="h-full w-full"
        />
      </div>

      <div className="relative px-5 pb-14 pt-28 text-center">
        <p className="label-mono mb-4">pattern-first recall</p>
        <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Keyword. Pattern.
          <br />
          <span className="text-muted-foreground">Template.</span>
        </h1>
        <p className="cursor-blink mx-auto mt-5 font-mono text-sm text-muted-foreground">
          built for recall, not re-reading
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {dueTotal > 0 && (
            <Button asChild size="lg">
              <Link to="/review" viewTransition>
                Review {dueTotal} due card{dueTotal === 1 ? "" : "s"}
              </Link>
            </Button>
          )}
          <Button asChild size="lg" variant={dueTotal > 0 ? "outline" : "default"}>
            <Link to="/quiz" viewTransition>
              Start a quiz round
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/drill/template" viewTransition>
              Drill a template
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link to="/patterns" viewTransition>
              Browse patterns →
            </Link>
          </Button>
        </div>

        <div className="mx-auto mt-14 flex max-w-md items-stretch justify-center divide-x divide-border border-y border-border py-4">
          {[
            [PATTERNS.length, "patterns"],
            [problemCount, "problems"],
            [3, "languages"],
            [dueTotal, "due now"],
          ].map(([v, label]) => (
            <div key={label} className="flex-1 px-3">
              <div className="font-mono text-xl font-bold">{v}</div>
              <div className="text-[11px] uppercase tracking-widest text-faint">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
