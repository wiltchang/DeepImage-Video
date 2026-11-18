const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");

global.localStorage = { getItem() { return null; }, setItem() {} };
global.document = { addEventListener() {}, createElement: () => ({}) };

const app = require("../app.js");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

test("r16 #1 left menu: only 视觉创作 / AI对话, pure navigation, no new-actions", () => {
  const modes = html.match(/<nav class="main-menu" aria-label="主菜单">([\s\S]*?)<\/nav>/)[1];
  assert.equal((modes.match(/class="menu-item/g) || []).length, 2);
  for (const t of ["视觉创作", "AI对话"]) assert.match(modes, new RegExp(t));
  assert.doesNotMatch(html, /menuNewCreation|menuNewChat|menuImageMode|menuVideoMode|新建模型对话|新建视觉创作|menu-actions/);
});

test("r16 #2 #3 #4 records ＋ is the only new-session entry; type switch in settings card; no 新建队列", () => {
  assert.match(html, /id="newRecordBtn"[^>]*aria-label=/);
  assert.equal((html.match(/id="newRecordBtn"/g) || []).length, 1);
  assert.doesNotMatch(html, /newSessionBtn|新建队列/);
  const card = html.match(/id="visualSettingsCard"[\s\S]*?id="imageOutputSettings"/)[0];
  assert.ok(card.includes('id="visualTypeImage"') && card.includes('id="visualTypeVideo"'));
  const tasks = [{ id: 1, createdAt: 150 }, { id: 2, createdAt: 250 }];
  assert.deepEqual(app.buildQueueGroups(tasks).map((t) => t.id), [2, 1]);
});

test("r14 #3 chat composer: file/web chips live in the quick-controls row beside stream/thinking", () => {
  const row = html.match(/<div class="quick-controls">([\s\S]*?)<\/div>/)[1];
  for (const id of ["streamToggle", "thinkingToggle", "chatWebToggle", "uploadChatFileButton"]) {
    assert.ok(row.includes(`id="${id}"`), id);
  }
  assert.doesNotMatch(html, /id="chatToolbar"/);
  assert.match(html, /\?v=20261118-r16/);
});
