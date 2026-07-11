import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./features/home/Home";
import PatternGrid from "./features/patterns/PatternGrid";
import PatternDetail from "./features/patterns/PatternDetail";
import KeywordLookupPage from "./features/lookup/KeywordLookupPage";
import DecisionTreeExplorer from "./features/decisionTree/DecisionTreeExplorer";
import ComplexityPage from "./features/complexity/ComplexityPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "patterns", element: <PatternGrid /> },
      { path: "patterns/:slug", element: <PatternDetail /> },
      { path: "lookup", element: <KeywordLookupPage /> },
      { path: "decision-tree", element: <DecisionTreeExplorer /> },
      { path: "complexity", element: <ComplexityPage /> },
    ],
  },
]);
