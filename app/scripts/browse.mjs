#!/usr/bin/env node
/**
 * Headless-Edge smoke driver: opens a route on the preview server, captures
 * console errors, optionally clicks through the recall gate, and screenshots.
 * Usage: node scripts/browse.mjs <path-without-leading-slash> <shot.png> [--reveal]
 * (no leading slash: Git Bash rewrites /x args into Windows paths)
 */
import puppeteer from "puppeteer-core";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
let [route = "", shot = "shot.png", ...flags] = process.argv.slice(2);
route = "/" + route.replace(/^\/+/, "");
const reveal = flags.includes("--reveal");

const mobile = flags.includes("--mobile");
const wide = flags.includes("--wide"); // exercises the scaled region of the root clamp (19-22px)

const browser = await puppeteer.launch({ executablePath: EDGE, headless: true });
const page = await browser.newPage();
await page.setViewport(
  mobile
    ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : wide
      ? { width: 2560, height: 1100 }
      : { width: 1280, height: 900 },
);

const logs = [];
page.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
page.on("requestfailed", (r) => logs.push(`[reqfail] ${r.url()} ${r.failure()?.errorText}`));

await page.goto(`http://localhost:4173${route}`, { waitUntil: "networkidle0", timeout: 30000 });

if (reveal) {
  // click the gate's skip button if present
  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      b.textContent.includes("just reveal"),
    );
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  logs.push(`[driver] gate skip clicked: ${clicked}`);
  await new Promise((r) => setTimeout(r, 2500)); // let mermaid render
}

const svgInfo = await page.evaluate(() => {
  const svgs = [...document.querySelectorAll("svg")].map((s) => ({
    id: s.id,
    w: s.clientWidth,
    h: s.clientHeight,
  }));
  return { count: svgs.length, svgs: svgs.slice(0, 5) };
});

await page.screenshot({ path: shot, fullPage: false });
console.log("route:", route);
console.log("svg:", JSON.stringify(svgInfo));
console.log("console output:");
for (const l of logs) console.log(" ", l);
await browser.close();
