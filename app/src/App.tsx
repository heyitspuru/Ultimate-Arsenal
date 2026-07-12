import { useMemo } from "react";
import { NavLink, Outlet, ScrollRestoration, useLocation } from "react-router-dom";
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
  // refresh the due badge whenever the route changes (cheap: one localStorage read)
  const due = useMemo(() => {
    const c = countsToday();
    return c.due + c.fresh;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <header className="topbar">
        <NavLink to="/" className="brand">
          DSA Pattern <span className="accent">Vault</span>
        </NavLink>
        <nav>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>
              {l.label}
              {l.to === "/review" && due > 0 && <span className="nav-badge">{due}</span>}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="shell">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  );
}
