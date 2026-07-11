import { useMemo, useState } from "react";
import { COMPLEXITY } from "../../lib/content";

/** One per-pattern row; in quiz mode Time/Space hide behind a click-to-reveal. */
function QuizCell({ value, quiz }: { value: string; quiz: boolean }) {
  const [shown, setShown] = useState(false);
  if (!quiz || shown) return <td>{value}</td>;
  return (
    <td>
      <button className="btn ghost" style={{ padding: "0.1rem 0.7rem" }} onClick={() => setShown(true)}>
        ?
      </button>
    </td>
  );
}

export default function ComplexityPage() {
  const [q, setQ] = useState("");
  const [quiz, setQuiz] = useState(false);
  // key bump forces QuizCell remount (re-hide) when toggling quiz mode
  const [round, setRound] = useState(0);

  const perPattern = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return COMPLEXITY.perPattern;
    return COMPLEXITY.perPattern.filter((r) => r.pattern.toLowerCase().includes(needle));
  }, [q]);

  return (
    <>
      <h1>Complexity Cheatsheet</h1>
      <p className="dim small">Memorize the shapes, not the rows.</p>

      <h2>Per-pattern Big-O</h2>
      <div className="row">
        <input
          className="search"
          placeholder="filter patterns…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className={`btn ${quiz ? "primary" : ""}`}
          onClick={() => {
            setQuiz(!quiz);
            setRound((r) => r + 1);
          }}
        >
          {quiz ? "Quiz mode: on" : "Quiz mode"}
        </button>
      </div>
      <div className="tablewrap">
        <table className="vault">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Time</th>
              <th>Space</th>
            </tr>
          </thead>
          <tbody>
            {perPattern.map((r) => (
              <tr key={`${r.pattern}-${round}`}>
                <td>{r.pattern}</td>
                <QuizCell value={r.time} quiz={quiz} />
                <QuizCell value={r.space} quiz={quiz} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Data-structure operations</h2>
      <div className="tablewrap">
        <table className="vault">
          <thead>
            <tr>
              <th>Structure</th>
              <th>Access</th>
              <th>Search</th>
              <th>Insert</th>
              <th>Delete</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {COMPLEXITY.dsOps.map((r) => (
              <tr key={r.structure}>
                <td>{r.structure}</td>
                <td>{r.access}</td>
                <td>{r.search}</td>
                <td>{r.insert}</td>
                <td>{r.delete}</td>
                <td className="faint">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Growth reference</h2>
      <div className="tablewrap">
        <table className="vault">
          <thead>
            <tr>
              <th>Big-O</th>
              <th>~ops at n = 10&#8309;</th>
              <th>Feels like</th>
            </tr>
          </thead>
          <tbody>
            {COMPLEXITY.growth.map((r) => (
              <tr key={r.bigO}>
                <td>
                  <code>{r.bigO}</code>
                </td>
                <td>{r.ops}</td>
                <td>{r.feels}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
