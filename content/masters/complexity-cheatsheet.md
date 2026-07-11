# Complexity Cheatsheet

> **Two tables.** (1) Data-structure operation costs, (2) per-pattern Big-O. Memorize the shapes, not the rows.

## Data-structure operations

| Structure | Access | Search | Insert | Delete | Notes |
|---|---|---|---|---|---|
| Array / ArrayList | O(1) | O(n) | O(n) | O(n) | append amortized O(1) |
| Sorted array | O(1) | O(log n) | O(n) | O(n) | binary-searchable |
| HashMap / HashSet | — | O(1)* | O(1)* | O(1)* | *avg; O(n) worst |
| Balanced BST / TreeMap | O(log n) | O(log n) | O(log n) | O(log n) | ordered iteration |
| Heap / PriorityQueue | O(1) peek | O(n) | O(log n) | O(log n) | pop-min/max O(log n) |
| Stack / Queue / Deque | O(1) ends | O(n) | O(1) | O(1) | ends only |
| Linked List | O(n) | O(n) | O(1)† | O(1)† | †with node ref |
| Trie | — | O(L) | O(L) | O(L) | L = key length |
| Union-Find | — | O(α(n)) | O(α(n)) | — | inverse Ackermann |

<small>* amortized / average case. α = inverse Ackermann (≈ constant).</small>

## Per-pattern Big-O

| Pattern | Time | Space |
|---|---|---|
| Two Pointers | O(n) (+O(n log n) if sorting) | O(1) |
| Sliding Window | O(n) | O(k) |
| Fast & Slow Pointers | O(n) | O(1) |
| Prefix Sum | O(n) | O(n) |
| Hashing | O(n) | O(n) |
| Binary Search | O(log n) × feasible | O(1) |
| Monotonic Stack | O(n) | O(n) |
| LinkedList Reversal | O(n) | O(1) |
| Merge Intervals | O(n log n) | O(n) |
| Cyclic Sort | O(n) | O(1) |
| Tree BFS | O(n) | O(w) width |
| Tree DFS | O(n) | O(h) height |
| Heap / Top-K | O(n log k) | O(k) |
| Two Heaps | O(log n) / add | O(n) |
| K-way Merge | O(N log k) | O(k) |
| Backtracking | O(branch^depth) | O(depth) |
| Graph BFS | O(V + E) | O(V) |
| Graph DFS | O(V + E) | O(V) |
| Topological Sort | O(V + E) | O(V + E) |
| Union-Find | O(α(n)) / op | O(n) |
| Trie | O(L) / op | O(alphabet × chars) |
| Greedy | O(n log n) | O(1) |
| Bit Manipulation | O(1) / op, O(n) scan | O(1) |
| Dynamic Programming | O(states × transitions) | O(states) |

| Dijkstra | O(E log V) | O(V + E) |
| Bellman-Ford | O(V · E) | O(V) |
| Minimum Spanning Tree | O(E log E) | O(V) |
| Tarjan (SCC / Bridges) | O(V + E) | O(V + E) |
| String Matching (KMP) | O(n + m) | O(m) |
| Interval DP | O(n³) | O(n²) |
| LRU / LFU Design | O(1) / op | O(capacity) |

## Growth reference

| Big-O | ~ops at n = 10⁵ | Feels like |
|---|---|---|
| O(log n) | 17 | instant |
| O(n) | 10⁵ | instant |
| O(n log n) | 1.7 × 10⁶ | fine |
| O(n²) | 10¹⁰ | too slow past ~10⁴ |
| O(2ⁿ) | astronomical | only for n ≲ 20 (bitmask/backtracking) |
