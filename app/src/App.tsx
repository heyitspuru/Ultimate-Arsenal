import { NavLink, Outlet, ScrollRestoration } from "react-router-dom";

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
