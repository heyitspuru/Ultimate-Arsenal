import puppeteer from "puppeteer-core";
import fs from "node:fs";
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const patterns = JSON.parse(fs.readFileSync("src/content/generated/patterns.json", "utf-8"));
const browser = await puppeteer.launch({ executablePath: EDGE, headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.split("\n")[0]));
let ok = 0, fail = [];
for (const p of patterns) {
  errors.length = 0;
  await page.goto(`http://localhost:4173/patterns/${p.slug}`, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent.includes("just reveal"))?.click();
  });
  await new Promise((r) => setTimeout(r, 1800));
  const hasSvg = await page.evaluate(() => !!document.querySelector("svg[id^='vault-diagram']"));
  if (hasSvg) ok++;
  else fail.push({ slug: p.slug, errors: [...errors] });
}
console.log(`diagrams rendered: ${ok}/${patterns.length}`);
if (fail.length) console.log("FAILED:", JSON.stringify(fail, null, 2));
await browser.close();
