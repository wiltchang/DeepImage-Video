const assert = require("node:assert/strict");
const test = require("node:test");

global.localStorage = { getItem() { return null; }, setItem() {} };

// DOM double rich enough for the record list (rows, labelled menu, inline rename).
class Node {
  constructor(tag = "div") {
    this.tagName = tag;
    this.children = [];
    this.dataset = {};
    this.listeners = {};
    this.attrs = {};
    this.hidden = false;
    this.textContent = "";
    this.value = "";
    this.title = "";
    const set = new Set();
    this._c = set;
    this.classList = {
      add: (c) => set.add(c),
      remove: (c) => set.delete(c),
      contains: (c) => set.has(c),
      toggle: (c, on) => (on ? set.add(c) : set.delete(c)),
    };
  }
  set className(v) { this._c.clear(); String(v).split(/\s+/).filter(Boolean).forEach((c) => this._c.add(c)); }
  get className() { return [...this._c].join(" "); }
  set innerHTML(v) { this.children = []; }
  get innerHTML() { return ""; }
  appendChild(n) { this.children.push(n); n.parent = this; return n; }
  addEventListener(t, fn) { (this.listeners[t] ||= []).push(fn); }
  fire(t, event = {}) {
    const e = { stopPropagation() {}, preventDefault() {}, target: this, ...event };
    (this.listeners[t] || []).forEach((fn) => fn(e));
  }
  setAttribute(k, v) { this.attrs[k] = v; }
  removeAttribute(k) { delete this.attrs[k]; }
  closest() { return null; }
  focus() { Node.focused = this; }
  select() {}
  all(pred, out = []) {
    this.children.forEach((c) => { if (pred(c)) out.push(c); c.all(pred, out); });
    return out;
  }
  querySelector(sel) {
    const cls = sel.replace(/^\./, "");
    return this.all((n) => n._c.has(cls))[0] || null;
  }
}
global.document = { addEventListener() {}, createElement: (t) => new Node(t) };
global.Node = Node;
global.requestAnimationFrame = (fn) => fn();
global.setTimeout = () => 0;

const app = require("../app.js");

function setup() {
  app.els.sessionSearch = { value: "" };
  app.els.sessionList = new Node();
  app.els.sidebarRecordsCount = new Node();
  app.els.toast = new Node();
  app.setTestMode("image", "c1", "s1");
  app.setTestSettings({ visualMode: "image" });
  app.setTestSessions(
    [{ id: "c1", title: "聊天", messages: [], updatedAt: Date.now() }],
    [{ id: "s1", title: "旧标题", updatedAt: Date.now(), queueBatches: [] }]
  );
  app.setTestVisualState(
    [{ id: "s1", title: "旧标题", updatedAt: Date.now(), queueBatches: [] }],
    [{ id: "t1", sessionId: "s1", type: "image", createdAt: 1, media: ["data:image/png;base64,AA"] }],
    "s1"
  );
  app.renderSessions();
}

const rows = () => app.els.sessionList.all((n) => n._c.has("session-item"));
const menuLabels = () => rows()[0].all((n) => n._c.has("session-menu-label")).map((n) => n.textContent);

test("#7 row shows a thumbnail, a type badge and text-labelled menu items", () => {
  setup();
  const row = rows()[0];
  assert.ok(row.all((n) => n._c.has("row-thumb-img")).length === 1, "first work thumbnail");
  assert.equal(row.all((n) => n._c.has("type-badge"))[0].textContent, "图片");
  assert.deepEqual(menuLabels(), ["置顶", "重命名", "删除"]);
});

test("#3 rename is an inline input: Enter saves, Esc cancels, no window.prompt", () => {
  setup();
  const items = () => rows()[0].all((n) => n._c.has("session-menu-item"));
  items()[1].fire("click"); // 重命名
  let input = app.els.sessionList.querySelector(".session-rename-input");
  assert.ok(input, "title replaced by an input");
  assert.equal(input.value, "旧标题");
  assert.equal(Node.focused, input);
  input.value = "新名字";
  input.fire("keydown", { key: "Escape" });
  assert.equal(app.els.sessionList.querySelector(".session-rename-input"), null);
  assert.equal(rows()[0].all((n) => n._c.has("session-title"))[0].textContent, "旧标题");

  items()[1].fire("click");
  input = app.els.sessionList.querySelector(".session-rename-input");
  input.value = "  新名字 ";
  input.fire("keydown", { key: "Enter" });
  assert.equal(app.els.sessionList.querySelector(".session-rename-input"), null);
  assert.equal(rows()[0].all((n) => n._c.has("session-title"))[0].textContent, "新名字");
});

test("#3 blur saves the rename too", () => {
  setup();
  rows()[0].all((n) => n._c.has("session-menu-item"))[1].fire("click");
  const input = app.els.sessionList.querySelector(".session-rename-input");
  input.value = "失焦保存";
  input.fire("blur");
  assert.equal(rows()[0].all((n) => n._c.has("session-title"))[0].textContent, "失焦保存");
});

test("#3 delete is a two-step in-site confirm (menu item becomes 确认删除？), no window.confirm", () => {
  setup();
  assert.equal(typeof global.window, "undefined", "window.confirm/prompt would throw here");
  rows()[0].all((n) => n._c.has("session-menu-item"))[2].fire("click");
  assert.deepEqual(menuLabels(), ["置顶", "重命名", "确认删除？"], "armed after first click");
  assert.equal(rows().length, 1, "nothing deleted yet");
  // (the confirming second click runs the full render(), which needs the whole app DOM)
});
