# Build Plan — "DSA Pattern Vault"
### A pattern-first DSA recall & revision system (Java-primary) · Cowork-ready

**Goal:** Ship a hybrid system: (1) skimmable one-page pattern cheatsheets + printable PDF for last-minute revision, (2) an Anki deck with FSRS for daily spaced recall, and (3) *optionally* an interactive web app with a "pick the pattern" quiz and template fill-in-the-blank drills.

**Guiding rule for every deliverable:** it must force *retrieval* (keyword → pattern → template), stay one screen per pattern, and pair every concept with a diagram + mnemonic. Never a textbook.

---

## Repo structure (create in Phase 0)
```
dsa-pattern-vault/
├── content/
│   ├── patterns/            # 24 one-pagers (01-two-pointers.md ... 24-bit-manipulation.md)
│   ├── masters/
│   │   ├── keyword-lookup.md      # keyword → pattern table
│   │   ├── decision-flowchart.md  # Mermaid flowchart: how to pick a pattern
│   │   └── complexity-cheatsheet.md
│   └── templates/           # raw Java (primary) + Python + C++ code skeletons
├── anki/
│   ├── cards.csv            # generated from content/ (3 card types)
│   └── build_deck.py        # genanki script → .apkg
├── site/                    # MkDocs Material config (mkdocs.yml, print CSS)
├── app/                     # Phase 2b only: Next.js + ts-fsrs
└── BUILD_PLAN.md            # this file
```

> **Phase 0 note on actual layout:** `mkdocs.yml` lives at the repo root (standard for `mkdocs serve`), with `docs_dir: content` and build output to `_build/`. MkDocs theme overrides + print CSS hooks live under `site/overrides/`. Everything else matches the tree above.

---

## Phase 0 — Scaffold (Day 1, ~2 hrs)
**Tasks**
1. Init repo with the structure above.
2. Set up MkDocs Material: dark theme, search, code tabs (Java/Python/C++), Mermaid support, `mkdocs-print-site-plugin` for one-click PDF export.
3. Create the **pattern one-pager template** (`content/_TEMPLATE.md`) with the fixed 8 sections: 🔑 Signal keywords · When to use / NOT use · 🖼 Diagram (Mermaid/SVG) · 🧠 Mnemonic · ⌨️ Template (Java + tabs) · ⏱ Complexity · ⚠️ Pitfalls · 🎯 5 canonical problems (easy→hard, LeetCode links).

**Done when:** `mkdocs serve` renders the template page with working code tabs and a Mermaid diagram.

---

## Phase 1 — Content: 24 one-pagers + 3 masters (Weeks 1–3)
Author in this order (each sprint ends with a PDF export so revision value ships weekly):

| Sprint | Patterns | Est. |
|---|---|---|
| **1 — Foundational** (Week 1) | Two Pointers · Sliding Window · Fast & Slow Pointers · Prefix Sum · Hashing · Binary Search (+on answer) · Monotonic Stack | ~7 hrs |
| **2 — Intermediate** (Week 2) | LinkedList Reversal · Merge Intervals · Cyclic Sort · Tree BFS · Tree DFS · Heap/Top-K · Two Heaps · K-way Merge · Backtracking | ~9 hrs |
| **3 — Advanced** (Week 3) | Graph BFS/DFS · Topological Sort · Union-Find · Trie · Greedy · Bit Manipulation · **DP mega-page** (6 sub-cards: 0/1 Knapsack, Unbounded, LCS, LIS, 1-D/Fib, Grid/Kadane) | ~10 hrs |
| **3.5 — Masters** | Keyword→pattern lookup table · Decision flowchart (Mermaid) · Complexity cheatsheet (DS ops + per-pattern Big-O) | ~3 hrs |

**Hard constraints per one-pager**
- ≤ 1 screen on desktop; ≤ 60 lines of markdown body.
- Java template ≤ 25 lines, chunked with 3–5 inline comments max.
- Exactly 5 canonical problems with difficulty tags.
- Mnemonic ≤ 8 words.

**Done when:** all 24 pages + 3 masters render; single PDF ≤ ~35 pages exports cleanly; a stranger can find "top k" → Heap in <10 seconds via the lookup table.

---

## Phase 2a — Anki deck with FSRS (Days 2–5, parallel with Phase 1)
**Card types (generated from `content/` via `build_deck.py` + genanki):**
1. **Keyword → Pattern:** front = signal phrase or 2-line mini problem; back = pattern name + mnemonic + template thumbnail. (~70 cards)
2. **Template cloze:** Java skeleton with 2–3 key lines blanked (e.g., the shrink condition in sliding window, the `hi = mid` vs `lo = mid+1` branch). (~50 cards)
3. **Problem-as-scheduler:** front = LeetCode link + one-line constraint summary; you *re-solve it*, then self-grade. Seed with Blind 75 mapped to the 24 patterns. (~75 cards)

**Setup:** Anki ≥ 23.10 · enable FSRS · desired retention 88% · new cards/day = 10.

**Done when:** `.apkg` imports cleanly, all 3 note types render, and regenerating from CSV is one command (content stays single-sourced in `content/`).

---

## Phase 2b — Interactive web app (OPTIONAL · Weeks 4–8)
**Build only if**, after 2 weeks of Anki use, Person A still wants: interleaved "pick the pattern" quizzes and in-browser template fill-ins. Otherwise skip — Anki covers 80% of the value.

**Stack:** Next.js (App Router) + TypeScript + Tailwind + `ts-fsrs` + SQLite (or localStorage for MVP). Content loaded directly from `content/*.md` frontmatter — no duplicate content database.

**MVP features (in priority order)**
1. **Pattern Picker Quiz** — random problem statement shown, user picks 1 of 24 patterns, instant feedback + why. Mixed across all learned patterns (this is the interleaving engine).
2. **FSRS review queue** — same 3 card types as Anki, scheduled by `ts-fsrs`.
3. **Template fill-in-the-blank** — Monaco editor, blanks diff-checked against the canonical skeleton.
4. **Dashboard** — per-pattern strength, due counts, weak-pattern list.

**Milestones:** W4 content loader + quiz · W5 FSRS queue · W6 fill-ins · W7 dashboard · W8 polish + deploy (Vercel).

**Done when:** Person A can do a 15-min daily session (quiz ×10 + due reviews) entirely in the app.

---

## Cowork session plan (copy-paste prompts)

| Session | Prompt to give Cowork |
|---|---|
| 1 | "Scaffold the dsa-pattern-vault repo per BUILD_PLAN.md Phase 0: MkDocs Material with code tabs, Mermaid, print-site plugin, and the `_TEMPLATE.md` one-pager." |
| 2–4 | "Author Sprint N pattern one-pagers per the template and hard constraints in BUILD_PLAN.md. Java primary, Python/C++ in tabs. Match the Sliding Window / Binary Search samples' style exactly." |
| 5 | "Build the 3 master pages: keyword lookup table, Mermaid decision flowchart, complexity cheatsheet. Then export the print-site PDF." |
| 6 | "Write `anki/build_deck.py` with genanki: parse content/ frontmatter into the 3 card types in BUILD_PLAN.md Phase 2a, output cards.csv + .apkg." |
| 7+ (opt.) | "Start Phase 2b: Next.js app skeleton with content loader reading `content/*.md`, then the Pattern Picker Quiz." |

**Review gate after each session:** open the output, spot-check 3 random pattern pages against the hard constraints, and reject anything that reads like a textbook.

---

## Timeline summary

| Week | Deliverable |
|---|---|
| Day 1 | Repo + MkDocs scaffold |
| Week 1 | 7 foundational one-pagers + first Anki cards → **start daily reviews immediately** |
| Week 2 | 9 intermediate one-pagers + full Anki deck v1 |
| Week 3 | Advanced + DP mega-page + 3 masters + **PDF v1 shipped** |
| Weeks 4–8 | (Optional) interactive app MVP |

**Study cadence runs in parallel from Week 1:** 10 min Anki daily · 1–2 scheduled problems daily with the 20-min stuck rule · one hidden-label interleaved drill of 8–10 mixed problems weekly.
