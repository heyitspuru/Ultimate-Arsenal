#!/usr/bin/env node
/**
 * One-command production deploy (Build Output API / prebuilt).
 * The build runs LOCALLY (npm run build via predeploy) where ../content
 * exists, then only static output is uploaded — no cloud build, no
 * root-directory configuration needed on Vercel.
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

rmSync(".vercel/output", { recursive: true, force: true });
mkdirSync(".vercel/output/static", { recursive: true });
cpSync("dist", ".vercel/output/static", { recursive: true });
writeFileSync(
  ".vercel/output/config.json",
  JSON.stringify(
    {
      version: 3,
      routes: [{ handle: "filesystem" }, { src: "/(.*)", dest: "/index.html" }],
    },
    null,
    2,
  ),
);
execSync("npx vercel deploy --prebuilt --prod", { stdio: "inherit" });
