const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");

global.localStorage = { getItem() { return null; }, setItem() {} };
global.document = { addEventListener() {}, createElement: () => ({}) };

const app = require("../app.js");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("r16 #1 left menu: only 视觉创作 / AI对话, pure navigation, no new-actions", () => {
  const modes = html.match(/<nav class="main-menu" aria-label="主菜单">([\s\S]*?)<\/nav>/)[1];
  assert.equal((modes.match(/class="menu-item/g) || []).length, 2);
  for (const t of ["视觉创作", "AI对话"]) assert.match(modes, new RegExp(t));
  assert.doesNotMatch(html, /menuNewCreation|menuNewChat|menuImageMode|menuVideoMode|新建模型对话|新建视觉创作|menu-actions/);
});

test("r16 #2 #3 #4 records ＋ is the only new-session entry; type switch lives in the model popover; no 新建队列", () => {
  assert.match(html, /id="newRecordBtn"[^>]*aria-label=/);
  assert.equal((html.match(/id="newRecordBtn"/g) || []).length, 1);
  assert.doesNotMatch(html, /newSessionBtn|新建队列/);
  const card = html.match(/id="visualSettingsCard"[\s\S]*?id="imageOutputSettings"/)[0];
  assert.ok(!card.includes("visualTypeImage") && !card.includes("visualTypeVideo"));
  const popover = html.match(/id="modelPopover"[\s\S]*?id="modelPopoverList"/)[0];
  assert.ok(popover.includes('id="visualTypeSwitch"') && popover.includes('id="visualTypeImage"') && popover.includes('id="visualTypeVideo"'));
  const footer = html.match(/<div class="composer-footer">([\s\S]*)<\/form>/)[1];
  assert.equal((footer.match(/id="visualTypeSwitch"/g) || []).length, 1);
  assert.ok(footer.indexOf('id="visualTypeSwitch"') > footer.indexOf('id="modelPopover"'));
  assert.match(css, /padding-bottom: calc\(160px \+ env\(safe-area-inset-bottom\)\)/);
  assert.doesNotMatch(css, /calc\(196px/);
  const tasks = [{ id: 1, createdAt: 150 }, { id: 2, createdAt: 250 }];
  assert.deepEqual(app.buildQueueGroups(tasks).map((t) => t.id), [2, 1]);
});

test("r14 #3 chat composer: file/web chips live in the quick-controls row beside stream/thinking", () => {
  const row = html.match(/<div class="quick-controls">([\s\S]*?)<\/div>/)[1];
  for (const id of ["streamToggle", "thinkingToggle", "chatWebToggle", "uploadChatFileButton"]) {
    assert.ok(row.includes(`id="${id}"`), id);
  }
  assert.doesNotMatch(html, /id="chatToolbar"/);
  assert.match(html, /\?v=20261119-r24/);
});

test("r18 mobile chat composer toolbar stays on one nowrap row", () => {
  const css = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const i = css.indexOf("r18: mobile chat composer toolbar");
  assert.ok(i > 0);
  const block = css.slice(i);
  assert.match(block, /@media \(max-width: 900px\)/);
  assert.match(block, /\.workspace:not\(\.visual-workspace\) \.composer-row \{[^}]*flex-direction: row;[^}]*flex-wrap: nowrap;/);
  assert.match(block, /\.workspace:not\(\.visual-workspace\) \.model-picker-trigger \{[^}]*max-width: 96px;[^}]*text-align: left;/);
  assert.match(block, /\.send-wrap \{[^}]*margin-left: auto;/);
  // legacy rule that stretched/centred the model chip is gone
  assert.doesNotMatch(css, /\n  \.model-picker-trigger \{\s*width: 100%;/);
  assert.match(html, /\?v=20261119-r24/);
});

test("r20 type switch is shown only for the visual model popover and re-opens it after switching", () => {
  const js = fs.readFileSync(path.join(root, "app.js"), "utf8");
  assert.match(js, /els\.visualTypeSwitch\.hidden = activeMode !== "image";/);
  assert.doesNotMatch(js, /els\.visualTypeSwitch\.hidden = !isVisual/);
  const fn = js.match(/function pickVisualTypeFromPopover\(mode\) \{[\s\S]*?\n\}/)[0];
  assert.match(fn, /setVisualMode\(mode\)/);
  assert.match(fn, /openModelPopover\(\)/);
  assert.match(js, /visualTypeImage\.addEventListener\("click", \(\) => \{\s*pickVisualTypeFromPopover\("image"\)/);
  assert.match(js, /visualTypeVideo\.addEventListener\("click", \(\) => \{\s*pickVisualTypeFromPopover\("video"\)/);
});
