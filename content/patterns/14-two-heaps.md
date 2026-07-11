---
pattern: Two Heaps
slug: two-heaps
sprint: 2
tier: Intermediate
mnemonic: "Max-heap low half, min-heap high."
signals:
  - "median of a stream"
  - "balance two halves"
  - "sliding window median"
  - "schedule by two criteria"
complexity:
  time: "O(log n) per add"
  space: "O(n)"
problems:
  - { name: "Total Cost to Hire K Workers", diff: M, url: "https://leetcode.com/problems/total-cost-to-hire-k-workers/" }
  - { name: "Find Median from Data Stream", diff: H, url: "https://leetcode.com/problems/find-median-from-data-stream/" }
  - { name: "IPO", diff: H, url: "https://leetcode.com/problems/ipo/" }
  - { name: "Sliding Window Median", diff: H, url: "https://leetcode.com/problems/sliding-window-median/" }
  - { name: "Minimize Deviation in Array", diff: H, url: "https://leetcode.com/problems/minimize-deviation-in-array/" }
---

# Two Heaps

## Signal keywords
<span class="chip">median of a stream</span> <span class="chip">balance two halves</span> <span class="chip">sliding window median</span> <span class="chip">two criteria</span> <span class="chip">running middle</span>

## When to use / NOT use

<div class="usenot" markdown>
<div class="wbox use" markdown>

**Use** when you must repeatedly read the middle (or a balance point) of a growing set — a max-heap of the low half and a min-heap of the high half give O(1) median, O(log n) inserts.

</div>
<div class="wbox avoid" markdown>

**Not** when a single heap suffices (→ Heap / Top-K).

</div>
</div>

## Diagram
```mermaid
flowchart LR
  L["max-heap · low half"]:::hot --- H["min-heap · high half"]
  ADD["add x → push low, shift max to high, rebalance"] --> L
  MED(["median = top of the larger heap"]):::hot
  L --- MED
  H --- MED
  classDef hot fill:#3a1418,stroke:#ff5c5c,color:#ffffff,stroke-width:2px;
```

## Mnemonic
!!! tip "Mnemonic"
    **Max-heap low half, min-heap high.**

## Template
=== "Java"
    ```java
    PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder()); // max
    PriorityQueue<Integer> hi = new PriorityQueue<>();                           // min
    void add(int x) {
        lo.offer(x);                       // 1. always add to low half
        hi.offer(lo.poll());               // 2. move its max up to high half
        if (hi.size() > lo.size())         // 3. keep lo >= hi in size
            lo.offer(hi.poll());
    }
    double median() {
        return lo.size() > hi.size()
            ? lo.peek() : (lo.peek() + hi.peek()) / 2.0;
    }
    ```
=== "Python"
    ```python
    import heapq
    lo, hi = [], []                        # lo: max-heap (negated), hi: min-heap
    def add(x):
        heapq.heappush(lo, -heapq.heappushpop(hi, x))  # x -> hi, hi.min -> lo
        if len(lo) > len(hi):              # rebalance
            heapq.heappush(hi, -heapq.heappop(lo))
    def median():
        return -lo[0] if len(lo) < len(hi) else (hi[0] - lo[0]) / 2
    ```
=== "C++"
    ```cpp
    priority_queue<int> lo;                                   // max-heap
    priority_queue<int, vector<int>, greater<int>> hi;        // min-heap
    void add(int x) {
        lo.push(x);
        hi.push(lo.top()); lo.pop();       // shift max up
        if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }
    }
    double median() {
        return lo.size() > hi.size() ? lo.top() : (lo.top() + hi.top()) / 2.0;
    }
    ```

## Complexity
**Time O(log n)** per insertion, **O(1)** per median read. **Space O(n)** across both heaps.

## Pitfalls

- Letting the two sizes drift (enforce `lo.size == hi.size` or `lo + 1`).
- Integer division on an even-count median.
- Skipping the "push-then-shift" step that keeps every low element ≤ every high element.

## Canonical problems
1. [Total Cost to Hire K Workers](https://leetcode.com/problems/total-cost-to-hire-k-workers/) <span class="diff-m">Medium</span>
2. [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) <span class="diff-h">Hard</span>
3. [IPO](https://leetcode.com/problems/ipo/) <span class="diff-h">Hard</span>
4. [Sliding Window Median](https://leetcode.com/problems/sliding-window-median/) <span class="diff-h">Hard</span>
5. [Minimize Deviation in Array](https://leetcode.com/problems/minimize-deviation-in-array/) <span class="diff-h">Hard</span>
