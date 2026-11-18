const assert = require("node:assert/strict");
const test = require("node:test");

global.localStorage = { getItem() { return null; }, setItem() {} };
global.document = { addEventListener() {}, createElement: () => ({}) };
const app = require("../app.js");

test("r21 ratio tiles: glyph + label, active has check badge, disabled tile is greyed with reason", () => {
  const box = { innerHTML: "" };
  app.renderTileGroup(box, "videoAspectRatio", [
    { value: "16:9", label: "16:9" },
    { value: "9:16", label: "9:16", disabledReason: "此模型不支持" },
  ], "16:9");
  assert.equal((box.innerHTML.match(/class="ratio-tile/g) || []).length, 2);
  assert.match(box.innerHTML, /ratio-tile active"[^>]*data-value="16:9"/);
  assert.match(box.innerHTML, /ratio-glyph-box/);
  assert.match(box.innerHTML, /ratio-tile is-disabled"[^>]*data-disabled-reason="此模型不支持"/);
  assert.equal((box.innerHTML.match(/option-check/g) || []).length, 2);
});

test("r21 audio renders as two big blocks; Veo 2 greys them with reason", () => {
  const box = { innerHTML: "" };
  app.renderOptionGroup(box, "videoAudio", [
    { value: "true", label: "含音频" },
    { value: "false", label: "静音" },
  ], "true", { block: true, disabled: true, disabledReason: "Veo 2 仅生成静音视频" });
  assert.equal((box.innerHTML.match(/block-option/g) || []).length, 2);
  assert.match(box.innerHTML, /含音频/);
  assert.match(box.innerHTML, /静音/);
  assert.equal((box.innerHTML.match(/data-disabled-reason="Veo 2 仅生成静音视频"/g) || []).length, 2);
});

test("r21 tiered resolution pills keep tier name + value + pixel sub", () => {
  const box = { innerHTML: "" };
  app.renderOptionGroup(box, "videoResolution", [{ value: "720p", label: "720p", sub: "1280×720" }], "720p", { tiered: true });
  assert.match(box.innerHTML, /pill-tier">高清/);
  assert.match(box.innerHTML, /pill-label">720p/);
  assert.match(box.innerHTML, /pill-sub">1280×720/);
  assert.match(box.innerHTML, /pill-option active/);
});
