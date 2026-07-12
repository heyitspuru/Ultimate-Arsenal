# DSA Pattern Vault

Pattern-first DSA **recall & revision** (Java-primary). Not a textbook: every surface
forces retrieval — keyword → pattern → template. Three artifacts, one content source:

1. **Web app** (`app/`) — TypeScript/React recall app: interleaved pattern quiz, FSRS
   review queue, template fill-in-the-blank drills, recall-gated pattern pages, dashboard.
2. **Anki deck** (`anki/`) — 3 card types, FSRS-ready `.apkg` for daily spaced recall.
3. **Offline PDF** (`dsa-pattern-vault.pdf`, built by `site/build_pdf.py`) — one
   print-optimized revision pack for last-minute review.

All three parse the same `content/*.md` files — content is written once.

## Web app

```bash
cd app
npm install
npm run dev        # http://localhost:5173 (regenerates content JSON first)
npm run build      # production build -> app/dist
```

Deploy: Vercel, Root Directory `app`, Vite preset. See `app/README.md`.

## Anki deck

```bash
pip install -r requirements.txt
python anki/build_deck.py     # -> anki/cards.csv + anki/dsa-pattern-vault.apkg
```

Import into Anki ≥ 23.10, enable **FSRS**, desired retention **88%**, new cards/day **10**.

## Offline PDF

```bash
python site/build_pdf.py      # -> dsa-pattern-vault.pdf (repo root)
```

## Layout

```
content/           # single source of truth
  patterns/        # 35 pattern one-pagers (NN-slug.md)
  masters/         # keyword lookup · decision flowchart · complexity · pattern map
  _TEMPLATE.md     # the fixed 8-section one-pager template (+ live sample)
anki/build_deck.py # -> cards.csv + .apkg (3 card types)
site/build_pdf.py  # -> offline PDF revision pack
app/               # TypeScript + React recall app (see app/README.md)
```

## Authoring a new pattern

1. Copy `content/_TEMPLATE.md` → `content/patterns/NN-slug.md`.
2. Fill the YAML frontmatter (source of truth for Anki + the app) + the 8 fixed sections.
3. Respect the hard constraints (≤1 screen, Java ≤25 lines, 5 problems, mnemonic ≤8 words).
4. Rebuild: the app picks it up on next `npm run dev`/`build`; rerun the Anki/PDF
   scripts for the offline artifacts. Add a decision-tree branch in
   `app/src/content/decision-tree.ts` if the new pattern needs one.

## Status

- [x] Phase 0–1 — 35 one-pagers (Sprints 1–5) + 4 masters
- [x] Phase 2a — Anki deck (FSRS-ready)
- [x] PDF v1 — offline revision pack
- [x] Phase 2b — interactive recall app (quiz · FSRS review · drills · dashboard)
- [x] MkDocs site retired in favor of the app
