import { NavLink, Outlet, ScrollRestoration } from "react-router-dom";

const LINKS = [
  { to: "/patterns", label: "Patterns" },
  { to: "/lookup", label: "Keyword Lookup" },
  { to: "/decision-tree", label: "Decision Tree" },
  { to: "/complexity", label: "Complexity" },
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
