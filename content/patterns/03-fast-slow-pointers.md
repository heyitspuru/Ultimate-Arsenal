---
pattern: Fast & Slow Pointers
slug: fast-slow-pointers
sprint: 1
tier: Foundational
mnemonic: "Tortoise and hare meet in cycles."
signals:
  - "linked list cycle"
  - "find the middle node"
  - "nth node from end"
  - "happy number / functional graph"
complexity:
  time: "O(n)"
  space: "O(1)"
problems:
  - { name: "Middle of the Linked List", diff: E, url: "https://leetcode.com/problems/middle-of-the-linked-list/" }
  - { name: "Linked List Cycle", diff: E, url: "https://leetcode.com/problems/linked-list-cycle/" }
  - { name: "Happy Number", diff: E, url: "https://leetcode.com/problems/happy-number/" }
  - { name: "Linked List Cycle II", diff: M, url: "https://leetcode.com/problems/linked-list-cycle-ii/" }
  - { name: "Find the Duplicate Number", diff: M, url: "https://leetcode.com/problems/find-the-duplicate-number/" }
---

# Fast & Slow Pointers

## Signal keywords
<span class="chip">linked list cycle</span> <span class="chip">find middle</span> <span class="chip">nth from end</span> <span class="chip">cycle entry</span> <span class="chip">happy number</span>

## When to use / NOT use

<div class="usenot" markdown>
<div class="wbox use" markdown>

**Use** on a linked list or implicit functional graph (each node has one "next") to detect a cycle, find its entry, or locate the middle — all in O(1) space.

</div>
<div class="wbox avoid" markdown>

**Not** when you need random access or index arithmetic (→ Two Pointers on arrays).

</div>
</div>

## Diagram
```mermaid
flowchart LR
  n1((1)) --> n2((2)) --> n3((3)) --> n4((4)) --> n5((5))
  n5 --> n3
  n3:::hot
  cap["slow +1 and fast +2 collide inside the cycle"]:::hot
  classDef hot fill:#3a1418,stroke:#ff5c5c,color:#ffffff,stroke-width:2px;
```

## Mnemonic
!!! tip "Mnemonic"
    **Tortoise and hare meet in cycles.**

## Template
=== "Java"
    ```java
    boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;          // 1 step
            fast = fast.next.next;     // 2 steps
            if (slow == fast) return true;  // met → cycle exists
        }
        return false;                  // fast fell off → no cycle
    }
    ```
=== "Python"
    ```python
    def has_cycle(head):
        slow = fast = head
        while fast and fast.next:
            slow = slow.next          # 1 step
            fast = fast.next.next     # 2 steps
            if slow is fast: return True
        return False
    ```
=== "C++"
    ```cpp
    bool hasCycle(ListNode* head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;         // 1 step
            fast = fast->next->next;   // 2 steps
            if (slow == fast) return true;
        }
        return false;
    }
    ```

## Complexity
**Time O(n)** — fast laps slow within one cycle length. **Space O(1)** — two pointers, no hash set.

## Pitfalls

- Null-checking `fast.next` before `fast.next.next`.
- To find the cycle *start*, reset one pointer to head and advance both by 1.
- Middle definition (upper vs lower) depends on the `fast` start.

## Canonical problems
1. [Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/) <span class="diff-e">Easy</span>
2. [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) <span class="diff-e">Easy</span>
3. [Happy Number](https://leetcode.com/problems/happy-number/) <span class="diff-e">Easy</span>
4. [Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/) <span class="diff-m">Medium</span>
5. [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) <span class="diff-m">Medium</span>
