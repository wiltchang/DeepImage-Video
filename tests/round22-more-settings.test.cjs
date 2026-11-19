const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

function section(id) {
  const start = html.indexOf(`id="${id}"`);
  const end = html.indexOf('<div class="composer-row">', start);
  return html.slice(start, end);
}
function split(block, moreId) {
  const i = block.indexOf(`id="${moreId}"`);
  return { main: block.slice(0, i), more: block.slice(i) };
}

test("r22 image: main = ratio+size; more = quality/background/format/style/count", () => {
  const { main, more } = split(section("imageOutputSettings"), "imageMoreSettings");
  for (const id of ["imageAspectGroup", "imageSizeGroup"]) assert.match(main, new RegExp(id));
  for (const id of ["imageQualityGroup", "imageBackgroundGroup", "imageFormatGroup", "imageCountGroup"]) {
    assert.match(more, new RegExp(id));
    assert.doesNotMatch(main, new RegExp(id));
  }
});

test("r22 video: main = ratio/resolution/duration/audio; more = style/count", () => {
  const { main, more } = split(section("videoOutputSettings"), "videoMoreSettings");
  for (const id of ["videoAspectGroup", "videoResolutionGroup", "videoDurationGroup", "videoAudioGroup"]) {
    assert.match(main, new RegExp(id));
  }
  for (const id of ["videoStyleGroup", "videoCountGroup"]) {
    assert.match(more, new RegExp(id));
    assert.doesNotMatch(main, new RegExp(id));
  }
});

test("r22 more-settings is collapsed by default with a hidden dot", () => {
  assert.match(html, /class="more-settings-body" hidden/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /class="more-settings-dot" hidden/);
  assert.match(app, /let moreSettingsOpen = false/);
  assert.match(app, /updateMoreSettingsIndicator\(\);\n\s+updateSettingsSummary\(\);/);
  assert.match(css, /\.more-settings-dot/);
});

test("r22 cache-bust bumped", () => {
  assert.match(html, /\?v=20261119-r23/);
  assert.doesNotMatch(html, /20261119-r21/);
});
