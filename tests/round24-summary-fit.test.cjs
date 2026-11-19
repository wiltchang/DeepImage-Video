const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const css = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
const block = css.slice(css.indexOf("r24: composer model"), css.indexOf("r25: equal-width"));

test("r24 css: desktop content-sized / 60% rebalance removed (superseded by r25 equal halves)", () => {
  assert.doesNotMatch(block, /flex: 0 0 auto/);
  assert.doesNotMatch(block, /max-width: 60%/);
  assert.match(block, /model-picker-trigger strong \{\s*min-width: 0;/);
});

test("r24 html: version bumped and chat chip untouched by visual-workspace rules", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  assert.match(html, /\?v=20261119-r25/);
  assert.doesNotMatch(block.replace(/\.workspace\.visual-workspace/g, ""), /not\(\.visual-workspace\)/);
  assert.ok(!/^\s*\.model-picker-trigger/m.test(block));
});
