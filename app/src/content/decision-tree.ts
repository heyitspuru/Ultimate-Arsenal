import type { DecisionNode } from "./types";

/**
 * Hand-transcribed from content/masters/decision-flowchart.md (the Mermaid
 * flowchart), reshaped into one question per screen. Two structural additions
 * over the source flowchart: the "weighted shortest path" branch asks one
 * follow-up to split Dijkstra vs Bellman-Ford (the flowchart lumps them into
 * a single node), and Merge Intervals gets an Array/String branch (the
 * flowchart omits it entirely; the keyword table maps it under intervals).
 */
export const DECISION_TREE: DecisionNode[] = [
  {
    id: "root",
    question: "What is the main structure of the problem?",
    options: [
      { label: "Array / String", next: "arr" },
      { label: "Linked List", next: "ll" },
      { label: "Tree", next: "tree" },
      { label: "Graph / Grid", next: "graph" },
      { label: "Strings + prefixes (dictionary, autocomplete)", slug: "trie" },
      { label: "Find a pattern inside text (string matching)", slug: "string-matching" },
      { label: "Design a cache · O(1) get/put", slug: "lru-lfu-design" },
      { label: "No single structure — optimization / counting", next: "opt" },
    ],
  },
  {
    id: "arr",
    question: "Array / String — what is asked?",
    options: [
      { label: "Best contiguous run (longest/shortest window)", slug: "sliding-window" },
      { label: "Sorted input · pair-sum · palindrome", slug: "two-pointers" },
      { label: "Range sums · count subarrays summing to K", slug: "prefix-sum" },
      { label: "Seen before · duplicates · complement · grouping", slug: "hashing" },
      { label: "Values are exactly 1..n (missing/duplicate)", slug: "cyclic-sort" },
      { label: "Overlapping intervals · meeting rooms", slug: "merge-intervals" },
      { label: "Next greater/smaller · histogram · temperatures", slug: "monotonic-stack" },
      { label: "Sorted, OR minimize-the-max / feasibility flips once", slug: "binary-search" },
    ],
  },
  {
    id: "ll",
    question: "Linked List — which kind of task?",
    options: [
      { label: "Cycle detection · find the middle", slug: "fast-slow-pointers" },
      { label: "Reverse · reorder · swap in groups", slug: "linkedlist-reversal" },
    ],
  },
  {
    id: "tree",
    question: "Tree — how do you need to traverse?",
    options: [
      { label: "Level by level · minimum depth · side view", slug: "tree-bfs" },
      { label: "Root-to-leaf paths · subtree values · LCA", slug: "tree-dfs" },
    ],
  },
  {
    id: "graph",
    question: "Graph / Grid — what is the goal?",
    options: [
      { label: "Shortest path, unweighted (fewest steps)", slug: "graph-bfs" },
      { label: "Connected components · reachability · flood fill", slug: "graph-dfs" },
      { label: "Dependency / build order (DAG)", slug: "topological-sort" },
      { label: "Dynamic connectivity · \"are they connected?\"", slug: "union-find" },
      { label: "Shortest path with weights", next: "weighted" },
      { label: "Connect all nodes at minimum cost", slug: "minimum-spanning-tree" },
      { label: "SCCs · bridges · articulation points", slug: "tarjan-scc" },
    ],
  },
  {
    id: "weighted",
    question: "Weighted shortest path — any negative edges or a stop limit?",
    options: [
      { label: "No — all weights non-negative", slug: "dijkstra" },
      { label: "Yes — negative edges, ≤ K stops, or negative-cycle check", slug: "bellman-ford" },
    ],
  },
  {
    id: "opt",
    question: "Optimization / counting — what shape is the ask?",
    options: [
      { label: "Top-k · kth largest/smallest · k closest", slug: "heap-top-k" },
      { label: "Median of a stream · balance two halves", slug: "two-heaps" },
      { label: "Merge k sorted lists/arrays", slug: "k-way-merge" },
      { label: "Enumerate ALL configurations (subsets, perms)", slug: "backtracking" },
      { label: "A local rule gives the global optimum", slug: "greedy" },
      { label: "Overlapping subproblems (count ways, min cost)", slug: "dynamic-programming" },
      { label: "Answer for range [i,j] built from split points", slug: "interval-dp" },
      { label: "Bit tricks · XOR · masks", slug: "bit-manipulation" },
    ],
  },
];

export const DECISION_ROOT = "root";

/** The "three questions that resolve most ties" from the flowchart page. */
export const TIE_QUESTIONS: string[] = [
  "**Is it contiguous?** Yes → Sliding Window / Prefix Sum. No → DP / Backtracking.",
  "**Do I need every solution, or just the best/count?** Every → Backtracking. Best/count → Greedy or DP (DP if choices overlap).",
  "**Is there a monotonic predicate** (`feasible(x)` flips once)? Yes → Binary Search on the answer, even when the input isn't \"sorted\".",
];
