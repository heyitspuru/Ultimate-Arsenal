# Push to GitHub

I prepared a complete git repo (one commit on `main`, 50 files, remote already
pointed at your GitHub repo) but I can't authenticate to GitHub from here, so the
final `push` has to run on your machine with your credentials.

Repo: **https://github.com/heyitspuru/Ultimate-Arsenal.git**

## Easiest path — push straight from this folder

Open a terminal (PowerShell or Git Bash) in
`Desktop\Ultimate Arsenal\dsa-pattern-vault` and run:

```bash
# 1. remove the partial .git left over from an earlier automated attempt
#    (PowerShell: Remove-Item -Recurse -Force .git)
rm -rf .git

# 2. initialise, commit, and push
git init
git add .
git commit -m "DSA Pattern Vault: 24 patterns, masters, Anki deck, PDF, glossy site"
git branch -M main
git remote add origin https://github.com/heyitspuru/Ultimate-Arsenal.git
git push -u origin main
```

The first push will prompt for your GitHub login (or use your credential manager /
a Personal Access Token).

## Alternative — use the prepared bundle (keeps my exact commit)

`UltimateArsenal.bundle` in this folder contains the full repo + history:

```bash
git clone UltimateArsenal.bundle Ultimate-Arsenal
cd Ultimate-Arsenal
git remote set-url origin https://github.com/heyitspuru/Ultimate-Arsenal.git
git push -u origin main
```

## What's included

All source (24 pattern pages, 3 masters, `_TEMPLATE.md`), `anki/build_deck.py`,
`site/build_pdf.py`, `mkdocs.yml`, the glossy theme, `requirements.txt`, and the
pre-built `dsa-pattern-vault.pdf`. Build output (`_build/`), preview folders, and
generated Anki artifacts (`*.apkg`, `cards.csv`) are git-ignored.
