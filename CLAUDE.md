# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A pattern-first DSA recall system. The hard product rule (from BUILD_PLAN.md): every surface must force **retrieval** — keyword → pattern → template — never read like a textbook. Judge UI changes against that bar, not just "does it render."

## Commands

All app work happens in `app/`:

```bash
cd app
npm run dev        # content codegen + Vite dev server (localhost:5173)
npm run build      # codegen + tsc -b + production build → app/dist
npm run generate   # content codegen only (content/*.md → src/content/generated/*.json)
npm run deploy     # local build + prebuilt upload to Vercel production
npm run lint       # oxlint
```

Offline artifacts (Python is `python`, not `python3`, on this machine):

```bash
python anki/build_deck.py    # → anki/cards.csv + .apkg (351 cards, must mirror the app deck 1:1)
python site/build_pdf.py     # → dsa-pattern-vault.pdf (currently blocked on Windows: WeasyPrint needs the GTK runtime)
```

Browser verification (no test framework — this is the verify loop):

```bash
node scripts/browse.mjs <route-without-leading-slash> shot.png [--reveal] [--mobile|--wide]
# leading slash omitted on purpose: Git Bash rewrites /x args into Windows paths
# --reveal clicks through the recall gate; --mobile = 390×844, --wide = 2560×1100 (exercises the fluid-root scaled region)
node scripts/sweep-diagrams.mjs   # asserts all 35 mermaid diagrams render (serve dist on :4173 first: npx vite preview --port 4173)
```

Headless-Edge caveat: it uses overlay scrollbars, so classic-scrollbar bugs (100vw overshoot) are invisible to these scripts — reason from spec for that class.

## Architecture: one content source, three consumers

`content/patterns/*.md` (35 one-pagers) is the single source of truth. **Three independent tools parse these files with the same structural contract** — changing the markdown structure breaks all three:

- `app/scripts/generate-content.mjs` → typed JSON in `app/src/content/generated/` (gitignored, rebuilt every dev/build)
- `anki/build_deck.py` → Anki deck (regex-based: frontmatter + first `=== "Java"` fence)
- `site/build_pdf.py` → printable PDF (flattens the language tabs)

The contract per pattern file: YAML frontmatter (`pattern`, `slug`, `sprint`, `tier`, `mnemonic`, `signals[]`, `complexity{time,space}`, `problems[]` — exactly 5) + 8 fixed `##` sections in order. Pitfalls must be a bullet list. Templates are `=== "Java"/"Python"/"C++"` tab blocks; the DP mega-page (24) and range-queries (33) instead use a `##` section with `###`-titled variants, which the generator handles via `templateVariants`. Hard constraints (enforced by generator sanity checks + convention): Java ≤25 lines, mnemonic ≤8 words, ≤1 screen.

**Adding a pattern touches five places** (generator throws if lookup rows < patterns):
1. `content/patterns/NN-slug.md` (copy `content/_TEMPLATE.md`)
2. `content/masters/keyword-lookup.md` — add a table row
3. `content/masters/complexity-cheatsheet.md` — add a Big-O row
4. `content/masters/decision-flowchart.md` — mermaid branch (feeds the PDF)
5. `app/src/content/decision-tree.ts` — hand-authored interactive tree (NOT generated from the mermaid; keep both in sync)

## App structure (Vite + React 19 + TS, static SPA, no backend)

- All state is localStorage (`app/src/lib/storage.ts`, namespace `dsa-vault:v1:`). There is deliberately no server; do not add one for feature work.
- SRS: `app/src/lib/srs/` — `cards.ts` builds the 351-card deck (keyword/cloze/problem — mirrors `build_deck.py`'s three types; keep counts identical), `engine.ts` wraps ts-fsrs (88% retention, 10 new/day, new cards drawn round-robin across patterns with a day-seeded shuffle — never a block from one pattern).
- Drills: `app/src/features/drill/drillEngine.ts` — fill-mode blanks rotate randomly; debug-mode mutations are **space-delimited operator matches only** (` < `, ` == `), which is what keeps Java generics (`Map<Integer>`) and compound ops (`>>=`) from being corrupted. Review clozes (`cards.ts clozeLines`) stay deterministic — FSRS cards need stable identity.
- Recall gates (`SignalGate`) are session-only and keyed by slug so every page visit forces one rep; don't persist them.
- Design system: pure monochrome (user's explicit choice — no hue anywhere). Feedback = inversion + ✓/✕ icons, difficulty = outlined/half/inverted intensity. Fluid scaling via one mechanism: `html { font-size: clamp(0.9375rem, 0.47vw + 0.625rem, 1.375rem) }` — everything is rem-based so it all scales together. Keep clamp endpoints in rem (px endpoints break the user's browser font-size accessibility setting). Type sizes between Tailwind steps use the `@theme` tokens `text-caption`/`text-mini`/`text-2xs` (2xs carries a `max(…, 10px)` legibility floor) — don't reintroduce arbitrary `text-[…rem]` literals.
- Mermaid: self-hosted, dynamic-imported in `DiagramPanel.tsx`; font size derives from the computed root per render; the content's red `hot` classDef is rewritten to mono at render time (`monochromize`) — content files keep the red for the PDF.

## Deploys (Vercel project `ultimate-arsenal` → ultimate-arsenal.vercel.app)

Two working paths; keep both intact:
- **git push to main** → cloud build, configured by the **root** `vercel.json` (`cd app && npm ci/build`, output `app/dist`, framework detection disabled — without this the build runs at repo root, pip-installs `requirements.txt`, and dies on `vite: command not found`)
- **`npm run deploy`** in `app/` → prebuilt Build Output API upload (builds locally where `../content` exists)
