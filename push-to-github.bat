@echo off
REM ============================================================
REM  DSA Pattern Vault -> push to GitHub
REM  Double-click this file (needs Git for Windows installed).
REM  On first push, Git opens a browser / prompt to sign in.
REM ============================================================
cd /d "%~dp0"

echo Initializing git repository...
if not exist ".git" git init

echo Staging files...
git add -A

echo Committing...
git commit -m "DSA Pattern Vault: 31 patterns, masters, Anki deck, PDF, glossy site" || echo (nothing new to commit)

git branch -M main

echo Setting remote...
git remote remove origin 1>nul 2>nul
git remote add origin https://github.com/heyitspuru/Ultimate-Arsenal.git

echo Pushing to GitHub...
git push -u origin main

echo.
echo Done. If it asks you to authenticate, sign in with your GitHub account.
pause
