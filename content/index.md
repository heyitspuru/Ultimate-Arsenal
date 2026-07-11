---
hide:
  - toc
---

<div class="vault-hero" markdown>

# DSA Pattern Vault

Keyword &rarr; Pattern &rarr; Template. Built for recall, not re-reading.

<div class="hero-actions" markdown>
[Start with Two Pointers](patterns/01-two-pointers.md){ .hero-btn .hero-btn--primary }
[Keyword lookup](masters/keyword-lookup.md){ .hero-btn }
[Decision flowchart](masters/decision-flowchart.md){ .hero-btn }
</div>

<div class="hero-stats">
<span><b>31</b> patterns</span>
<span><b>150+</b> problems</span>
<span><b>3</b> languages</span>
<span><b>Anki</b> deck</span>
</div>

</div>

## Sprint 1 · Foundational

<div class="pattern-grid" markdown>

- [<span class="pc-n">01</span><span class="pc-t">Two Pointers</span><span class="pc-m">Two ends squeeze toward the middle.</span>](patterns/01-two-pointers.md)
- [<span class="pc-n">02</span><span class="pc-t">Sliding Window</span><span class="pc-m">Grow right, shrink left, track best.</span>](patterns/02-sliding-window.md)
- [<span class="pc-n">03</span><span class="pc-t">Fast & Slow Pointers</span><span class="pc-m">Tortoise and hare meet in cycles.</span>](patterns/03-fast-slow-pointers.md)
- [<span class="pc-n">04</span><span class="pc-t">Prefix Sum</span><span class="pc-m">Precompute totals; subtract two prefixes.</span>](patterns/04-prefix-sum.md)
- [<span class="pc-n">05</span><span class="pc-t">Hashing</span><span class="pc-m">Trade memory for O(1) lookups.</span>](patterns/05-hashing.md)
- [<span class="pc-n">06</span><span class="pc-t">Binary Search</span><span class="pc-m">Halve the space; keep feasible side.</span>](patterns/06-binary-search.md)
- [<span class="pc-n">07</span><span class="pc-t">Monotonic Stack</span><span class="pc-m">Pop losers; stack stays sorted.</span>](patterns/07-monotonic-stack.md)

</div>

## Sprint 2 · Intermediate

<div class="pattern-grid" markdown>

- [<span class="pc-n">08</span><span class="pc-t">LinkedList Reversal</span><span class="pc-m">Rewire next backward, one hop each.</span>](patterns/08-linkedlist-reversal.md)
- [<span class="pc-n">09</span><span class="pc-t">Merge Intervals</span><span class="pc-m">Sort by start; extend or append.</span>](patterns/09-merge-intervals.md)
- [<span class="pc-n">10</span><span class="pc-t">Cyclic Sort</span><span class="pc-m">Send each number to its index.</span>](patterns/10-cyclic-sort.md)
- [<span class="pc-n">11</span><span class="pc-t">Tree BFS</span><span class="pc-m">Queue a level; drain it fully.</span>](patterns/11-tree-bfs.md)
- [<span class="pc-n">12</span><span class="pc-t">Tree DFS</span><span class="pc-m">Recurse down; combine coming back up.</span>](patterns/12-tree-dfs.md)
- [<span class="pc-n">13</span><span class="pc-t">Heap / Top-K</span><span class="pc-m">Keep K inside a size-K heap.</span>](patterns/13-heap-top-k.md)
- [<span class="pc-n">14</span><span class="pc-t">Two Heaps</span><span class="pc-m">Max-heap low half, min-heap high.</span>](patterns/14-two-heaps.md)
- [<span class="pc-n">15</span><span class="pc-t">K-way Merge</span><span class="pc-m">Heap the k heads; pop smallest.</span>](patterns/15-k-way-merge.md)
- [<span class="pc-n">16</span><span class="pc-t">Backtracking</span><span class="pc-m">Choose, explore, un-choose.</span>](patterns/16-backtracking.md)

</div>

## Sprint 3 · Advanced

<div class="pattern-grid" markdown>

- [<span class="pc-n">17</span><span class="pc-t">Graph BFS</span><span class="pc-m">Queue neighbors; nearest layers first.</span>](patterns/17-graph-bfs.md)
- [<span class="pc-n">18</span><span class="pc-t">Graph DFS</span><span class="pc-m">Dive deep; mark, recurse, backtrack.</span>](patterns/18-graph-dfs.md)
- [<span class="pc-n">19</span><span class="pc-t">Topological Sort</span><span class="pc-m">Zero in-degree first; peel forward.</span>](patterns/19-topological-sort.md)
- [<span class="pc-n">20</span><span class="pc-t">Union-Find</span><span class="pc-m">Union by rank; compress the path.</span>](patterns/20-union-find.md)
- [<span class="pc-n">21</span><span class="pc-t">Trie</span><span class="pc-m">Branch per character; flag word ends.</span>](patterns/21-trie.md)
- [<span class="pc-n">22</span><span class="pc-t">Greedy</span><span class="pc-m">Take the best local move now.</span>](patterns/22-greedy.md)
- [<span class="pc-n">23</span><span class="pc-t">Bit Manipulation</span><span class="pc-m">Mask, shift, XOR to toggle.</span>](patterns/23-bit-manipulation.md)
- [<span class="pc-n">24</span><span class="pc-t">Dynamic Programming</span><span class="pc-m">Define state, recur, memoize, build up.</span>](patterns/24-dynamic-programming.md)

</div>

## Sprint 4 · Expert

<div class="pattern-grid" markdown>

- [<span class="pc-n">25</span><span class="pc-t">Dijkstra</span><span class="pc-m">Greedily settle the nearest unvisited node.</span>](patterns/25-dijkstra.md)
- [<span class="pc-n">26</span><span class="pc-t">Bellman-Ford</span><span class="pc-m">Relax every edge V minus once.</span>](patterns/26-bellman-ford.md)
- [<span class="pc-n">27</span><span class="pc-t">Minimum Spanning Tree</span><span class="pc-m">Cheapest edges that avoid a cycle.</span>](patterns/27-minimum-spanning-tree.md)
- [<span class="pc-n">28</span><span class="pc-t">Tarjan (SCC & Bridges)</span><span class="pc-m">Track discovery and low-link times.</span>](patterns/28-tarjan-scc.md)
- [<span class="pc-n">29</span><span class="pc-t">String Matching</span><span class="pc-m">Precompute prefix jumps; never backtrack.</span>](patterns/29-string-matching.md)
- [<span class="pc-n">30</span><span class="pc-t">Interval DP</span><span class="pc-m">Solve inner intervals; merge outward.</span>](patterns/30-interval-dp.md)
- [<span class="pc-n">31</span><span class="pc-t">LRU / LFU Cache Design</span><span class="pc-m">Hashmap plus linked list equals O(1).</span>](patterns/31-lru-lfu-design.md)

</div>

## Master references

<div class="pattern-grid" markdown>

- [<span class="pc-n">MAP</span><span class="pc-t">Keyword &rarr; Pattern</span><span class="pc-m">Match a phrase to a pattern in under 10 seconds.</span>](masters/keyword-lookup.md)
- [<span class="pc-n">FLOW</span><span class="pc-t">Decision Flowchart</span><span class="pc-m">Walk the branches when the keyword table misses.</span>](masters/decision-flowchart.md)
- [<span class="pc-n">O(n)</span><span class="pc-t">Complexity Cheatsheet</span><span class="pc-m">DS operations and per-pattern time and space.</span>](masters/complexity-cheatsheet.md)
- [<span class="pc-n">94</span><span class="pc-t">Pattern Reference</span><span class="pc-m">Coverage map vs the 94-pattern sheet.</span>](masters/pattern-map.md)

</div>
