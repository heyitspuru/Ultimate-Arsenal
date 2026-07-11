# DSA Pattern Vault

Pattern-first DSA recall & revision (Java-primary). Skimmable one-page cheatsheets → printable PDF → Anki spaced recall. See `BUILD_PLAN.md` for the full plan.

## Quick start

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
mkdocs serve            # live preview at http://127.0.0.1:8000
mkdocs build            # static site → _build/
```

For the one-file revision pack: open the **Print / PDF** link in the top nav and use *Print → Save as PDF* (renders diagrams). An offline PDF is also pre-built at `dsa-pattern-vault.pdf` (`python site/build_pdf.py` to regenerate).

## Layout

```
content/           # single source of truth
  patterns/        # 24 pattern one-pagers (NN-slug.md)
  masters/         # keyword lookup · decision flowchart · complexity
  _TEMPLATE.md     # the fixed 8-section one-pager template (+ live sample)
anki/              # build_deck.py → cards.csv + dsa-pattern-vault.apkg
site/              # theme overrides + build_pdf.py
app/               # optional Next.js quiz app (Phase 2b — deferred)
mkdocs.yml         # site config (docs_dir=content, build→_build/)
dsa-pattern-vault.pdf   # pre-built offline revision pack
```

## Anki deck (Phase 2a)

```bash
pip install genanki pyyaml
python anki/build_deck.py     # regenerates cards.csv + .apkg from content/
```

Import `anki/dsa-pattern-vault.apkg` into Anki ≥ 23.10. Three card types (241 notes / 283 cards):
Keyword→Pattern, Java template cloze, and Problem-as-scheduler. Then enable **FSRS**,
set desired retention **88%**, new cards/day **10**.

## Authoring a new pattern

1. Copy `content/_TEMPLATE.md` → `content/patterns/NN-slug.md`.
2. Fill the YAML frontmatter (source of truth for Anki) + the 8 fixed sections.
3. Add the page under `nav: > Patterns:` in `mkdocs.yml`.
4. Respect the hard constraints (≤1 screen, Java ≤25 lines, 5 problems, mnemonic ≤8 words).

## Status
- [x] Phase 0 — scaffold, MkDocs config, `_TEMPLATE.md`
- [x] Phase 1 — 24 one-pagers + 3 masters
- [x] Phase 2a — Anki deck (241 cards, FSRS-ready)
- [x] PDF v1 — 38-page offline revision pack
- [ ] Phase 2b — interactive app (optional, gated per plan — deferred)

_Validated: `mkdocs build --strict` clean (24 patterns + 3 masters), all per-pattern constraints pass, keyword lookup resolves 'top k' → Heap, Anki .apkg = 241 notes / 283 cards, PDF = 38 pages._
