// Builds a single self-contained HTML file of the app for sharing as a prototype.
// Usage: npm run prototype   →  prototype/dist/index.html
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const out = "prototype/dist";
mkdirSync(out, { recursive: true });

const js = await build({
  entryPoints: ["prototype/App.tsx"],
  bundle: true,
  minify: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  target: "es2019",
  tsconfig: "tsconfig.json",
  alias: { "next/link": "./prototype/shims/next-link.tsx", "next/navigation": "./prototype/shims/next-navigation.ts" },
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.NEXT_PUBLIC_PROTOTYPE": '"1"',
  },
  external: ["next"],
  logLevel: "warning",
});

execFileSync("npx", ["tailwindcss", "-i", "app/globals.css", "-o", `${out}/app.css`, "--minify"], { stdio: "inherit" });
const css = readFileSync(`${out}/app.css`, "utf8");
const icon = readFileSync("public/icons/icon-192.png").toString("base64");
const script = js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

writeFileSync(
  `${out}/index.html`,
  `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Aesthetic Guide NYC &amp; Miami — Prototype</title>
<link rel="icon" href="data:image/png;base64,${icon}">
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${script}</script>
</body>
</html>
`,
);
console.log("Wrote", `${out}/index.html`);
