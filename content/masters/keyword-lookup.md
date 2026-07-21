# Keyword → Pattern

> **Master lookup.** Scan the left column for a phrase in your problem, jump to the pattern. Target: match in under 10 seconds.

| If the problem says…                                        | Reach for | Page |
|---|---|---|
| sorted array, pair/triplet with target sum, palindrome     | Two Pointers | [→](../patterns/01-two-pointers.md) |
| longest/shortest **contiguous** subarray/substring, ≤ K distinct | Sliding Window | [→](../patterns/02-sliding-window.md) |
| linked-list cycle, find middle, happy number               | Fast & Slow Pointers | [→](../patterns/03-fast-slow-pointers.md) |
| range-sum queries, subarray sum = K, count subarrays       | Prefix Sum | [→](../patterns/04-prefix-sum.md) |
| "seen before", duplicates, complement, group/anagram, frequency | Hashing | [→](../patterns/05-hashing.md) |
| sorted/rotated, "minimize the maximum", smallest x s.t. feasible | Binary Search | [→](../patterns/06-binary-search.md) |
| next greater/smaller, nearest larger, histogram, temperatures | Monotonic Stack | [→](../patterns/07-monotonic-stack.md) |
| reverse a list / sublist / in k-groups, swap pairs         | LinkedList Reversal | [→](../patterns/08-linkedlist-reversal.md) |
| overlapping intervals, merge/insert interval, meeting rooms | Merge Intervals | [→](../patterns/09-merge-intervals.md) |
| array holds 1..n, missing/duplicate, first missing positive | Cyclic Sort | [→](../patterns/10-cyclic-sort.md) |
| level order, "by level", minimum depth, right-side view    | Tree BFS | [→](../patterns/11-tree-bfs.md) |
| root-to-leaf path, path sum, height, diameter, LCA          | Tree DFS | [→](../patterns/12-tree-dfs.md) |
| **top k**, kth largest/smallest, k closest, k most frequent | Heap / Top-K | [→](../patterns/13-heap-top-k.md) |
| median of a stream, balance two halves                     | Two Heaps | [→](../patterns/14-two-heaps.md) |
| merge k sorted lists, kth smallest in sorted matrix        | K-way Merge | [→](../patterns/15-k-way-merge.md) |
| all subsets/permutations/combinations, N-Queens, generate all | Backtracking | [→](../patterns/16-backtracking.md) |
| shortest/fewest steps (unweighted), grid min moves, spread by layer | Graph BFS | [→](../patterns/17-graph-bfs.md) |
| connected components, count islands, flood fill, reachability | Graph DFS | [→](../patterns/18-graph-dfs.md) |
| dependencies, prerequisites, build/course order (DAG)      | Topological Sort | [→](../patterns/19-topological-sort.md) |
| dynamic connectivity, "are they connected", number of groups | Union-Find | [→](../patterns/20-union-find.md) |
| prefix search, autocomplete, dictionary, word search II    | Trie | [→](../patterns/21-trie.md) |
| local rule gives global optimum, interval scheduling, jump/reach | Greedy | [→](../patterns/22-greedy.md) |
| single number, count bits, power of two, bitmask subsets   | Bit Manipulation | [→](../patterns/23-bit-manipulation.md) |
| count the ways, min/max cost, "can you make", longest X, **subsequence** (order kept, not contiguous) | Dynamic Programming | [→](../patterns/24-dynamic-programming.md) |
| weighted graph, non-negative, min cost / time path | Dijkstra | [→](../patterns/25-dijkstra.md) |
| negative edges, at most K stops, negative cycle | Bellman-Ford | [→](../patterns/26-bellman-ford.md) |
| connect all nodes at min cost, spanning tree | Minimum Spanning Tree | [→](../patterns/27-minimum-spanning-tree.md) |
| SCC, bridges, critical connections, articulation points | Tarjan (SCC & Bridges) | [→](../patterns/28-tarjan-scc.md) |
| find a pattern in text, KMP, repeated substring | String Matching | [→](../patterns/29-string-matching.md) |
| answer for range [i,j] from splits, burst balloons | Interval DP | [→](../patterns/30-interval-dp.md) |
| design a cache, LRU/LFU, O(1) get/put | LRU / LFU Design | [→](../patterns/31-lru-lfu-design.md) |
| shortest path between EVERY pair, small n, transitive closure | Floyd-Warshall | [→](../patterns/32-floyd-warshall.md) |
| range sum/min WITH updates, count smaller so far, inversions | Range Queries (Segment Tree / BIT) | [→](../patterns/33-range-queries.md) |
| n ≤ 20, assign/visit ALL, TSP-style tours | Bitmask DP | [→](../patterns/34-bitmask-dp.md) |
| max/min of every size-k window, windowed DP max | Monotonic Deque | [→](../patterns/35-monotonic-deque.md) |

## Fast tie-breakers

When two patterns feel close:

- **Contiguous** best run → Sliding Window; **subsequence** (skip elements, order kept) → DP for the optimum, Backtracking to enumerate all of them.
- Shortest path **unweighted** → Graph BFS; components / all-reachable → Graph DFS.
- Need the **median** continuously → Two Heaps; need the **k best** → Heap / Top-K.
- Grouping that only ever **merges** → Union-Find; grouping with **ordering** constraints → Topological Sort.
- "Minimize the maximum / maximize the minimum" almost always → **Binary Search on the answer**.
