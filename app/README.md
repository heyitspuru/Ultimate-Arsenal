# DSA Pattern Vault — recall app

TypeScript + React (Vite) app whose job is **retrieval practice**, not reading:
pattern pages open behind a recall gate, the keyword table drills phrase → pattern,
and the decision flowchart is an interactive question-by-question tree.

Content is single-sourced from `../content/*.md` — `scripts/generate-content.mjs`
parses the same frontmatter/sections that `../anki/build_deck.py` and
`../site/build_pdf.py` read, and emits typed JSON into `src/content/generated/`
(gitignored, regenerated on every dev/build).

## Commands

```bash
npm install
npm run dev        # regenerates content JSON, serves on http://localhost:5173
npm run build      # regenerate + typecheck + production build -> dist/
npm run preview    # serve the production build
```

## Deploy (Vercel)

Project settings: Root Directory = `app`, framework preset Vite, build command
`npm run build`, output `dist`. `vercel.json` rewrites all routes to `index.html`
(SPA). The build reads `../content` from the repo checkout.

## Structure

```
scripts/generate-content.mjs   content/*.md -> src/content/generated/*.json
src/content/                   types + hand-authored decision tree
src/features/                  patterns · lookup · decisionTree · complexity · home
src/lib/content.ts             typed accessors over the generated JSON
src/styles/theme.css           glossy charcoal/red theme (ported from MkDocs era)
```

## Roadmap (per BUILD_PLAN.md Phase 2b)

- [x] M1 — content pipeline, reveal-gated pattern pages, lookup, decision tree, complexity
- [ ] M2 — Pattern Picker Quiz (interleaving engine)
- [ ] M3 — FSRS review queue (`ts-fsrs` + localStorage)
- [ ] M4 — template fill-in-the-blank drill
- [ ] M5 — dashboard (per-pattern strength, due counts)
- [ ] M6 — retire the MkDocs site
