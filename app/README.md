# app/ — Interactive quiz app (Phase 2b, OPTIONAL)

Per `BUILD_PLAN.md`, this phase is **deferred by design**: build it only if, after
~2 weeks of daily Anki use, you still want interleaved "pick the pattern" quizzes
and in-browser template fill-ins. Anki (see `../anki/`) covers ~80% of the value.

Planned stack: Next.js (App Router) + TypeScript + Tailwind + `ts-fsrs`, loading
content directly from `../content/*.md` frontmatter (no duplicate content DB).

MVP feature order: Pattern Picker Quiz → FSRS review queue → template fill-in-the-blank → dashboard.
