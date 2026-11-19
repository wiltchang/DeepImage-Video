const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const css = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
const block = css.slice(css.indexOf("r24: composer model"));

test("r24 css: desktop model block sized by content, settings block shrinks", () => {
  assert.match(block, /summary-model-block \{\s*flex: 0 0 auto;/);
  assert.match(block, /summary-settings-block \{\s*flex: 1 1 0;\s*min-width: 0;/);
});

test("r24 css: mobile halves equal, 12px summary, 13px model name", () => {
  const mobile = block.slice(block.indexOf("@media (max-width: 900px)"));
  assert.match(mobile, /flex: 1 1 0;/);
  assert.match(mobile, /strong \{\s*font-size: 13px;/);
  assert.match(mobile, /summary-value \{\s*font-size: 12px;/);
});

test("r24 html: version bumped and chat chip untouched by visual-workspace rules", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  assert.match(html, /\?v=20261119-r24/);
  assert.doesNotMatch(block.replace(/\.workspace\.visual-workspace/g, ""), /not\(\.visual-workspace\)/);
  assert.ok(!/^\s*\.model-picker-trigger/m.test(block));
});
