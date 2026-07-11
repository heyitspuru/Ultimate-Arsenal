#!/usr/bin/env python3
"""
DSA Pattern Vault - offline PDF builder.

Assembles the masters + all pattern pages into ONE print-optimized PDF for
last-minute revision. Runs fully offline via WeasyPrint (no browser needed).

Design choices for print:
  * black ink on white, JetBrains Mono, green (#2ea043) accents
  * every pattern starts on a fresh page (page-break-before on H1)
  * language tabs (=== "Java"/"Python"/"C++") are flattened to labelled code
    blocks so all three show, stacked, in the PDF
  * mermaid diagrams are boxed with their source (the live site renders them
    graphically; the PDF keeps the logic legible without a browser)

Usage:  python site/build_pdf.py   ->   dsa-pattern-vault.pdf  (repo root)
"""
import html
import pathlib
import re
import textwrap
import markdown
import weasyprint

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
OUT_PDF = ROOT / "dsa-pattern-vault.pdf"

# Page order mirrors the mkdocs nav.
ORDER = [
    ("Masters", ["masters/keyword-lookup.md",
                 "masters/decision-flowchart.md",
                 "masters/complexity-cheatsheet.md"]),
    ("Patterns", [f"patterns/{p.name}" for p in sorted((CONTENT / "patterns").glob("*.md"))]),
]

TAB_RE = re.compile(r'^===\s*"([^"]+)"\s*$')


def strip_frontmatter(text: str) -> str:
    text = re.sub(r"^<!--.*?-->\s*", "", text, count=1, flags=re.S)
    return re.sub(r"^---\n.*?\n---\n", "", text, count=1, flags=re.S)


def flatten_tabs_and_mermaid(md: str) -> str:
    """Turn `=== "Java"` tab blocks into `**Java**` + dedented code fence, and
    tag mermaid fences so we can box them after HTML conversion."""
    lines = md.split("\n")
    out, i = [], 0
    while i < len(lines):
        line = lines[i]
        m = TAB_RE.match(line.strip())
        if m:
            out.append(f"\n**{m.group(1)}**")
            i += 1
            # consume the indented block that follows (any consistent indent)
            block = []
            while i < len(lines) and (lines[i].strip() == "" or lines[i][:1].isspace()):
                block.append(lines[i])
                i += 1
            out.append(textwrap.dedent("\n".join(block)))
            continue
        out.append(line)
        i += 1
    md = "\n".join(out)
    # mark mermaid fences so post-processing can box them
    md = md.replace("```mermaid", "```text\n[diagram]")
    return md


CSS = """
@page { size: A4; margin: 1.5cm 1.4cm; @bottom-center { content: counter(page);
        font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: #888; } }
* { box-sizing: border-box; }
body { font-family: 'JetBrains Mono', 'DejaVu Sans Mono', monospace;
       font-size: 8.4pt; line-height: 1.42; color: #111; }
h1 { font-size: 15pt; color: #111; border-bottom: 2px solid #2ea043;
     padding-bottom: 3px; margin: 0 0 8px; page-break-before: always; }
h1:first-of-type { page-break-before: avoid; }
h1::before { content: "// "; color: #2ea043; }
h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: .04em;
     margin: 11px 0 3px; page-break-after: avoid; }
h2::before { content: "> "; color: #2ea043; }
h3 { font-size: 9pt; margin: 8px 0 2px; color: #146c2e; page-break-after: avoid; }
p, li { margin: 3px 0; }
strong, b { color: #146c2e; }
a { color: #146c2e; text-decoration: none; }
pre { background: #f4f6f4; border: 1px solid #d5dbd5; border-left: 3px solid #2ea043;
      border-radius: 4px; padding: 7px 9px; white-space: pre-wrap;
      font-size: 7.7pt; page-break-inside: avoid; margin: 4px 0; }
code { font-family: 'JetBrains Mono', 'DejaVu Sans Mono', monospace; }
table { border-collapse: collapse; width: 100%; font-size: 7.4pt; margin: 5px 0;
        page-break-inside: avoid; }
th { background: #eef3ee; color: #146c2e; text-transform: uppercase;
     letter-spacing: .02em; }
th, td { border: 1px solid #ccd3cc; padding: 2px 5px; text-align: left; }
blockquote { border-left: 3px solid #2ea043; margin: 4px 0; padding: 2px 10px;
             background: #f4f6f4; color: #333; }
.diff-e { color: #146c2e; font-weight: bold; }
.diff-m { color: #555; font-weight: bold; }
.diff-h { color: #000; font-weight: bold; text-decoration: underline; }
.chip { display: inline-block; padding: 0 5px; margin: 1px; border: 1px solid #2ea043;
        border-radius: 3px; color: #146c2e; font-size: 7pt; }
.cover { text-align: center; page-break-after: always; padding-top: 34%; }
.cover h1 { border: none; page-break-before: avoid; font-size: 30pt; }
.cover h1::before { content: ""; }
.cover .accent { color: #2ea043; }

.usenot { display: flex; gap: 8px; margin: 5px 0; }
.wbox { flex: 1; border: 1px solid #d5dbd5; border-radius: 6px; padding: 5px 8px; font-size: 8pt; }
.wbox.use { border-left: 3px solid #2ea043; background: #f1f8f2; }
.wbox.avoid { border-left: 3px solid #c62828; background: #fdf2f2; }
.wbox p { margin: 0; }
.wbox.use strong:first-child { color: #146c2e; }
.wbox.avoid strong:first-child { color: #b3261e; }
"""

def _cover(pattern_count: int) -> str:
    return f"""
<div class="cover">
  <h1>DSA Pattern <span class="accent">Vault</span></h1>
  <p>Pattern-first recall &amp; revision &middot; {pattern_count} patterns &middot; Java-primary</p>
  <p style="color:#2ea043">keyword &rarr; pattern &rarr; template</p>
</div>
"""

MD_EXT = ["fenced_code", "tables", "attr_list", "sane_lists", "admonition", "md_in_html"]


def main() -> None:
    pattern_count = len(ORDER[1][1])
    parts = [_cover(pattern_count)]
    for _section, rels in ORDER:
        for rel in rels:
            raw = (CONTENT / rel).read_text(encoding="utf-8")
            md = flatten_tabs_and_mermaid(strip_frontmatter(raw))
            body = markdown.markdown(md, extensions=MD_EXT)
            parts.append(f'<section>{body}</section>')
    doc = f"<html><head><meta charset='utf-8'></head><body>{''.join(parts)}</body></html>"
    weasyprint.HTML(string=doc, base_url=str(ROOT)).write_pdf(
        OUT_PDF, stylesheets=[weasyprint.CSS(string=CSS)])
    kb = OUT_PDF.stat().st_size // 1024
    print(f"wrote {OUT_PDF.relative_to(ROOT)} ({kb} KB)")


if __name__ == "__main__":
    main()
