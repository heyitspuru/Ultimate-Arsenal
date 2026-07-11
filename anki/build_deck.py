#!/usr/bin/env python3
"""
DSA Pattern Vault - Anki deck builder (Phase 2a).

Single source of truth = content/patterns/*.md. This script parses each page's
YAML frontmatter (plus its Java template) and emits THREE card types:

  1. Keyword -> Pattern   : front = a signal phrase; back = pattern + mnemonic
  2. Template cloze       : Java skeleton with key comment-lines blanked
  3. Problem-as-scheduler : front = LeetCode problem; back = its pattern (re-solve)

Outputs:
  anki/cards.csv                     (flat, inspectable, re-generatable)
  anki/dsa-pattern-vault.apkg        (import into Anki >= 23.10, enable FSRS)

Usage:  python anki/build_deck.py
FSRS setup after import: desired retention 88%, new cards/day 10 (set in Anki).
"""
import csv
import html
import pathlib
import re
import genanki
import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent
PATTERNS = ROOT / "content" / "patterns"
OUT_CSV = ROOT / "anki" / "cards.csv"
OUT_APKG = ROOT / "anki" / "dsa-pattern-vault.apkg"

# Stable, arbitrary-but-fixed IDs (genanki requires deterministic model/deck ids).
DECK_ID = 1987654321
MODEL_BASIC = 1987654322
MODEL_CLOZE = 1987654323

FRONTMATTER = re.compile(r"^<!--.*?-->\s*", re.S)  # strip a leading HTML comment
YAML_BLOCK = re.compile(r"^---\n(.*?)\n---", re.S)
JAVA_BLOCK = re.compile(r'===\s*"Java"\s*\n\s*```java\n(.*?)\n\s*```', re.S)

CODE_STYLE = (
    "font-family:'JetBrains Mono',monospace;font-size:13px;text-align:left;"
    "background:#101214;color:#e6e6e6;border:1px solid #232629;border-radius:6px;"
    "padding:12px;white-space:pre;overflow-x:auto;"
)
GREEN = "#3fb950"


def parse_page(path: pathlib.Path) -> dict:
    raw = path.read_text(encoding="utf-8")
    raw_no_comment = FRONTMATTER.sub("", raw, count=1)
    m = YAML_BLOCK.search(raw_no_comment)
    if not m:
        raise ValueError(f"no frontmatter in {path.name}")
    meta = yaml.safe_load(m.group(1))
    jm = JAVA_BLOCK.search(raw)
    meta["_java"] = jm.group(1) if jm else ""
    return meta


def cloze_java(java: str, max_blanks: int = 3) -> str:
    """Blank up to `max_blanks` comment-annotated lines: the code keeps its
    comment as a hint, the code itself becomes a cloze deletion."""
    out, n = [], 0
    for line in java.split("\n"):
        if n < max_blanks and "//" in line:
            code, _, comment = line.partition("//")
            if code.strip():
                indent = code[: len(code) - len(code.lstrip())]
                n += 1
                line = f"{indent}{{{{c{n}::{html.escape(code.strip())}}}}} //{html.escape(comment)}"
                out.append(line)
                continue
        out.append(html.escape(line))
    # If nothing had a comment, cloze the first substantive line as a fallback.
    if n == 0:
        lines = [l for l in java.split("\n") if l.strip()]
        if len(lines) > 1:
            target = html.escape(lines[1].strip())
            body = html.escape(java).replace(target, f"{{{{c1::{target}}}}}", 1)
            return f'<pre style="{CODE_STYLE}">{body}</pre>'
    return f'<pre style="{CODE_STYLE}">' + "\n".join(out) + "</pre>"


def code_pre(java: str) -> str:
    return f'<pre style="{CODE_STYLE}">{html.escape(java)}</pre>'


# ---- Note models -------------------------------------------------------------
basic_model = genanki.Model(
    MODEL_BASIC, "DSA Basic (Q/A)",
    fields=[{"name": "Front"}, {"name": "Back"}, {"name": "Tags"}],
    templates=[{
        "name": "Card 1",
        "qfmt": '<div style="font-family:JetBrains Mono,monospace">{{Front}}</div>',
        "afmt": '{{FrontSide}}<hr id="answer">'
                '<div style="font-family:JetBrains Mono,monospace">{{Back}}</div>',
    }],
    css=f"""
.card {{ background:#0a0a0a; color:#e6e6e6; font-family:'JetBrains Mono',monospace; }}
hr {{ border-color:{GREEN}; }}
b, strong {{ color:{GREEN}; }}
a {{ color:{GREEN}; }}
""",
)

cloze_model = genanki.Model(
    MODEL_CLOZE, "DSA Cloze",
    model_type=genanki.Model.CLOZE,
    fields=[{"name": "Text"}, {"name": "Hint"}],
    templates=[{
        "name": "Cloze",
        "qfmt": "{{cloze:Text}}<br><i style='color:#9aa0a6'>{{Hint}}</i>",
        "afmt": "{{cloze:Text}}<br><i style='color:#9aa0a6'>{{Hint}}</i>",
    }],
    css=f".card {{ background:#0a0a0a; color:#e6e6e6; font-family:'JetBrains Mono',monospace; }}"
        f" .cloze {{ color:{GREEN}; font-weight:bold; }}",
)


def main() -> None:
    pages = sorted(PATTERNS.glob("*.md"))
    deck = genanki.Deck(DECK_ID, "DSA Pattern Vault")
    rows = []
    n_kw = n_cloze = n_prob = 0

    for path in pages:
        p = parse_page(path)
        name = p["pattern"]
        mnem = p.get("mnemonic", "")
        tag = re.sub(r"[^A-Za-z0-9]+", "_", name).strip("_")

        # 1) Keyword -> Pattern (one card per signal phrase)
        for sig in p.get("signals", []):
            front = f"Signal: <b>{html.escape(str(sig))}</b><br>Which pattern?"
            back = f"<b>{html.escape(name)}</b><br>Mnemonic: {html.escape(mnem)}"
            deck.add_note(genanki.Note(basic_model, [front, back, tag]))
            rows.append(["keyword", name, str(sig), name + " | " + mnem])
            n_kw += 1

        # 2) Template cloze (Java skeleton with key lines blanked)
        if p["_java"].strip():
            text = cloze_java(p["_java"])
            hint = f"{name} - fill the blanks"
            deck.add_note(genanki.Note(cloze_model, [text, hint]))
            rows.append(["cloze", name, f"[Java template cloze: {name}]", mnem])
            n_cloze += 1

        # 3) Problem-as-scheduler (one card per canonical problem)
        for prob in p.get("problems", []):
            pname, diff, url = prob["name"], prob.get("diff", ""), prob.get("url", "")
            front = (f'<a href="{html.escape(url)}">{html.escape(pname)}</a> '
                     f'[{diff}]<br>Re-solve it, then self-grade.')
            back = f"Pattern: <b>{html.escape(name)}</b><br>Mnemonic: {html.escape(mnem)}"
            deck.add_note(genanki.Note(basic_model, [front, back, tag]))
            rows.append(["problem", name, f"{pname} [{diff}] {url}", name])
            n_prob += 1

    OUT_CSV.parent.mkdir(exist_ok=True)
    with OUT_CSV.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["type", "pattern", "front", "back"])
        w.writerows(rows)

    genanki.Package(deck).write_to_file(OUT_APKG)

    total = n_kw + n_cloze + n_prob
    print(f"patterns parsed : {len(pages)}")
    print(f"keyword cards   : {n_kw}")
    print(f"cloze cards     : {n_cloze}")
    print(f"problem cards   : {n_prob}")
    print(f"TOTAL cards     : {total}")
    print(f"wrote {OUT_CSV.relative_to(ROOT)} and {OUT_APKG.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
