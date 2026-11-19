const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const css = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const block = css.slice(css.indexOf("r25: equal-width"));

test("r25 css: both blocks equal flex at all widths, padding 8px 8px", () => {
  assert.match(block, /summary-model-block,\s*\.workspace\.visual-workspace \.summary-settings-block \{\s*flex: 1 1 0;\s*min-width: 0;\s*max-width: none;\s*padding: 8px 8px;/);
  assert.doesNotMatch(block, /flex: 0 0 auto;\s*max-width: 60%/);
});

test("r25 css: 13px model name, 12px summary, 16px icon in label row", () => {
  assert.match(block, /trigger strong \{\s*font-size: 13px;/);
  assert.match(block, /summary-value \{\s*font-size: 12px;/);
  assert.match(block, /summary-label-row \.vendor-icon \{\s*width: 16px;\s*height: 16px;/);
});


test("r25 html: vendor icon sits in the label row, not in the trigger", () => {
  assert.match(html, /summary-label-row">\s*<span class="summary-label">模型<\/span>\s*<span id="quickModelVendor"/);
  const trigger = html.slice(html.indexOf('id="quickModelButton"'), html.indexOf('id="modelPopover"'));
  assert.doesNotMatch(trigger, /vendor-icon/);
  assert.match(html, /\?v=20261119-r27/);
});
