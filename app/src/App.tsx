import { useMemo } from "react";
import { NavLink, Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import SideRays from "@/components/SideRays";
import { countsToday } from "./lib/srs/engine";

const LINKS = [
  { to: "/review", label: "Review" },
  { to: "/quiz", label: "Quiz" },
  { to: "/drill/template", label: "Drill" },
  { to: "/patterns", label: "Patterns" },
  { to: "/lookup", label: "Lookup" },
  { to: "/decision-tree", label: "Decision Tree" },
  { to: "/complexity", label: "Complexity" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  // refresh the due badge whenever the route changes (cheap: one localStorage read)
  const due = useMemo(() => {
    const c = countsToday();
    return c.due + c.fresh;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      {/* quiet monochrome rays behind inner pages; the home hero has its own */}
      {!isHome && (
        <div className="pointer-events-none fixed inset-0 z-0 opacity-45">
          <SideRays
            rayColor1="#ffffff"
            rayColor2="#b0b0b0"
            saturation={0}
            intensity={1.8}
            speed={1.2}
            spread={2.8}
            origin="top-right"
            className="h-full w-full"
          />
        </div>
      )}

      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="wrap flex items-center gap-4 py-2.5 sm:gap-6">
          <NavLink
            to="/"
            viewTransition
            className="group flex shrink-0 items-center gap-2.5 font-mono text-sm font-bold tracking-tight whitespace-nowrap sm:text-[0.9375rem]"
          >
            <img
              src="/logo.png"
              alt="DSA Pattern Vault"
              className="size-8 transition-transform duration-300 group-hover:rotate-[30deg] sm:size-9"
            />
            <span className="hidden xs:inline">
              DSA<span className="text-muted-foreground">//</span>VAULT
            </span>
          </NavLink>
          {/* single-row nav: scrolls horizontally on narrow screens instead of wrapping */}
          <nav className="no-scrollbar -my-1 flex min-w-0 flex-nowrap items-center gap-x-5 overflow-x-auto py-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                viewTransition
                className={({ isActive }) =>
                  `relative shrink-0 py-0.5 text-sm transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:bg-foreground after:transition-all after:duration-200 ${
                    isActive
                      ? "text-foreground after:right-0"
                      : "text-muted-foreground after:right-full hover:text-foreground"
                  }`
                }
              >
                {l.label}
                {l.to === "/review" && due > 0 && (
                  <span className="ml-1.5 inline-block min-w-[1.2rem] rounded-full bg-primary px-1 text-center font-mono text-2xs font-bold leading-[1.5] text-primary-foreground">
                    {due}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="wrap relative z-10 pb-16">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  );
}
