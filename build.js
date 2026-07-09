#!/usr/bin/env node
/* =====================================================================
   ventura-report build helper (zero dependencies)

   Produces a single self-contained, shareable HTML file from a filled-in
   report: inlines assets/ventura-report.css into a <style> tag and replaces
   the logo <img src="assets/ventura-logo.png"> references with a base64
   data URI. No webfont is loaded (the live page loads none either), so the
   only remaining cloud reference is the hero photo — by design. The output
   is one paste-ready .html with nothing local: ideal for hostmyclaudehtml.com.

   Usage:
     node build.js <input.html> [output.html]

   <input.html> is normally template.html after you replaced the {{TOKENS}}
   with real content. If output is omitted, writes <input>.bundled.html.
   ===================================================================== */

const fs = require("fs");
const path = require("path");

const SKILL_DIR = __dirname;
const CSS_PATH = path.join(SKILL_DIR, "assets", "ventura-report.css");
const LOGO_PATH = path.join(SKILL_DIR, "assets", "ventura-logo.png");

function main() {
  const input = process.argv[2];
  if (!input) {
    console.error("Usage: node build.js <input.html> [output.html]");
    process.exit(1);
  }
  const output = process.argv[3] || input.replace(/\.html?$/i, "") + ".bundled.html";

  let html = fs.readFileSync(input, "utf8");
  const css = fs.readFileSync(CSS_PATH, "utf8");
  const logoB64 = fs.readFileSync(LOGO_PATH).toString("base64");
  const logoUri = `data:image/png;base64,${logoB64}`;

  // 1. Replace the stylesheet <link> with an inline <style>.
  const linkRe = /<link[^>]*href=["']?(?:\.\/)?assets\/ventura-report\.css["']?[^>]*>/i;
  if (linkRe.test(html)) {
    html = html.replace(linkRe, `<style>\n${css}\n</style>`);
  } else {
    console.warn("warning: ventura-report.css <link> not found — leaving CSS untouched.");
  }

  // 2. Inline the logo wherever it is referenced.
  html = html.replace(/(["'])(?:\.\/)?assets\/ventura-logo\.png\1/g, `$1${logoUri}$1`);

  fs.writeFileSync(output, html);
  const kb = (fs.statSync(output).size / 1024).toFixed(0);
  console.log(`Wrote ${output} (${kb} KB, single self-contained file — only the hero photo is remote).`);
}

main();
