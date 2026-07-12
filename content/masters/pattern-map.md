# Pattern Reference & Coverage

> Cross-check of this vault's **35 patterns** against the community **Swati Ahuja DSA Patterns sheet** (94 sub-patterns across 15 categories). Sprint 4 (Expert) closed the advanced-graph, string-matching, interval-DP, and design gaps; Sprint 5 (Specialist) adds all-pairs shortest path, range-query structures, bitmask DP, and the monotonic deque.

| Sheet category | Vault pattern(s) |
|---|---|
| I. Two Pointers | [Two Pointers](../patterns/01-two-pointers.md) |
| II. Sliding Window | [Sliding Window](../patterns/02-sliding-window.md) · [Monotonic Deque](../patterns/35-monotonic-deque.md) |
| III. Tree Traversal (DFS & BFS) | [Tree BFS](../patterns/11-tree-bfs.md) · [Tree DFS](../patterns/12-tree-dfs.md) |
| IV. Graph Traversal (DFS & BFS) | [Graph BFS](../patterns/17-graph-bfs.md) · [Graph DFS](../patterns/18-graph-dfs.md) · [Topological Sort](../patterns/19-topological-sort.md) · [Union-Find](../patterns/20-union-find.md) · [Dijkstra](../patterns/25-dijkstra.md) · [Bellman-Ford](../patterns/26-bellman-ford.md) · [Minimum Spanning Tree](../patterns/27-minimum-spanning-tree.md) · [Tarjan (SCC & Bridges)](../patterns/28-tarjan-scc.md) · [Floyd-Warshall](../patterns/32-floyd-warshall.md) |
| V. Dynamic Programming | [Dynamic Programming](../patterns/24-dynamic-programming.md) (6 sub-recurrences) · [Interval DP](../patterns/30-interval-dp.md) · [Bitmask DP](../patterns/34-bitmask-dp.md) |
| VI. Heap / Priority Queue | [Heap / Top-K](../patterns/13-heap-top-k.md) · [Two Heaps](../patterns/14-two-heaps.md) · [K-way Merge](../patterns/15-k-way-merge.md) |
| VII. Backtracking | [Backtracking](../patterns/16-backtracking.md) |
| VIII. Greedy | [Greedy](../patterns/22-greedy.md) · [Merge Intervals](../patterns/09-merge-intervals.md) |
| IX. Binary Search | [Binary Search](../patterns/06-binary-search.md) (+ on answer) |
| X. Stack | [Monotonic Stack](../patterns/07-monotonic-stack.md) |
| XI. Bit Manipulation | [Bit Manipulation](../patterns/23-bit-manipulation.md) |
| XII. Linked List Manipulation | [LinkedList Reversal](../patterns/08-linkedlist-reversal.md) · [Fast & Slow Pointers](../patterns/03-fast-slow-pointers.md) |
| XIII. Array / Matrix Manipulation | [Prefix Sum](../patterns/04-prefix-sum.md) · [Cyclic Sort](../patterns/10-cyclic-sort.md) · [Range Queries (Segment Tree / BIT)](../patterns/33-range-queries.md) |
| XIV. String Manipulation | [Hashing](../patterns/05-hashing.md) · [String Matching (KMP)](../patterns/29-string-matching.md) · Two Pointers · Sliding Window |
| XV. Design | [LRU / LFU Cache Design](../patterns/31-lru-lfu-design.md) · [Trie](../patterns/21-trie.md) |

## Still out of scope (deeper specializations)

Covered now via Sprint 5: all-pairs shortest path (Floyd-Warshall), range queries with updates (Segment Tree / Fenwick BIT), Bitmask DP, and the Monotonic Deque.

Deliberately out: **A\*** (heuristic search — interview-rare), **Aho-Corasick** multi-pattern matching and **suffix arrays/automata** (their templates cannot fit the vault's ≤25-line one-screen constraint; reach for a reference, not a recall card). Say the word if one of them earns a page anyway.

<small>Reference: Swati Ahuja, "DSA Patterns" sheet.</small>
