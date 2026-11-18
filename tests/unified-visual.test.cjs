const assert = require("node:assert/strict");
const test = require("node:test");

global.localStorage = { getItem() { return null; }, setItem() {} };

// Minimal DOM double: just enough for the queue panel / jump list / locate code.
class FakeNode {
  constructor(tag = "div") {
    this.tagName = tag;
    this.children = [];
    this.dataset = {};
    this.listeners = {};
    this.hidden = false;
    this.textContent = "";
    this.scrolled = 0;
    const set = new Set();
    this.classList = {
      add: (c) => set.add(c),
      remove: (c) => set.delete(c),
      contains: (c) => set.has(c),
      toggle: (c, on) => (on ? set.add(c) : set.delete(c)),
    };
    this._classes = set;
  }
  set className(v) { this._classes.clear(); String(v).split(/\s+/).filter(Boolean).forEach((c) => this._classes.add(c)); }
  get className() { return [...this._classes].join(" "); }
  set innerHTML(v) { this.children = []; this._html = v; }
  get innerHTML() { return this._html || ""; }
  appendChild(n) { this.children.push(n); n.parent = this; return n; }
  insertBefore(n, ref) {
    const i = ref ? this.children.indexOf(ref) : -1;
    if (i < 0) this.children.push(n); else this.children.splice(i, 0, n);
    return n;
  }
  addEventListener(t, fn) { this.listeners[t] = fn; }
  click() { this.listeners.click(); }
  setAttribute() {}
  scrollIntoView() { this.scrolled += 1; }
  querySelector(sel) {
    const m = /\[data-message-index="(\d+)"\]/.exec(sel);
    return this.children.find((c) => c.dataset.messageIndex === m[1]) || null;
  }
}
global.document = {
  addEventListener() {},
  createElement: (t) => new FakeNode(t),
};
global.Node = FakeNode;
global.requestAnimationFrame = (fn) => fn();

const app = require("../app.js");

test("legacy per-mode sessions and tasks merge into one unified visual list", () => {
  const state = app.normalizeState({
    imageSessions: [{ id: "i1", title: "图", createdAt: 1, updatedAt: 100 }],
    videoSessions: [{ id: "v1", title: "视频", createdAt: 2, updatedAt: 300 }],
    imageTasks: [{ id: "t1", sessionId: "i1", status: "done", createdAt: 10, media: ["data:image/png;base64,x"] }],
    videoTasks: [{ id: "t2", sessionId: "v1", status: "done", createdAt: 20, media: ["https://x/y.mp4"] }],
    activeImageSessionId: "i1",
    activeVideoSessionId: "v1",
    settings: { visualMode: "image" },
  });
  assert.deepEqual(state.visualSessions.map((s) => s.id), ["v1", "i1"], "sorted by updatedAt desc");
  assert.equal(state.visualTasks.length, 2, "no work is lost");
  assert.equal(state.visualTasks.find((t) => t.id === "t1").type, "image");
  assert.equal(state.visualTasks.find((t) => t.id === "t2").type, "video");
  assert.equal(state.activeVisualSessionId, "i1", "active session preserved");
  assert.equal(state.visualSessions.find((s) => s.id === "v1").lastVisualMode, "video");
  assert.equal(state.imageSessions, undefined);
  assert.equal(state.videoTasks, undefined);
});

test("existing unified data is kept and mixed-type sessions stay intact", () => {
  const input = {
    visualSessions: [{ id: "s", title: "混排", createdAt: 1, updatedAt: 5 }],
    visualTasks: [
      { id: "a", sessionId: "s", type: "image", createdAt: 1 },
      { id: "b", sessionId: "s", type: "video", createdAt: 2 },
    ],
    activeVisualSessionId: "s",
  };
  const once = app.normalizeState(input);
  const twice = app.normalizeState(once);
  assert.equal(twice.visualSessions.length, 1);
  assert.deepEqual(twice.visualTasks.map((t) => t.type).sort(), ["image", "video"]);
});

test("task type is inferred from source hint, media and params", () => {
  assert.equal(app.inferVisualTaskType({ media: ["a.webm"] }), "video");
  assert.equal(app.inferVisualTaskType({ params: { duration: "5" } }), "video");
  assert.equal(app.inferVisualTaskType({}, "video"), "video");
  assert.equal(app.inferVisualTaskType({ type: "image", media: ["a.mp4"] }), "image");
  assert.equal(app.inferVisualTaskType({}), "image");
});

test("r16 queue is flat in time order; legacy queueBatches boundaries are ignored", () => {
  const tasks = [
    { id: 1, createdAt: 10 }, { id: 2, createdAt: 20 },
    { id: 3, createdAt: 110 }, { id: 4, createdAt: 120 },
  ];
  assert.deepEqual(app.buildQueueGroups(tasks).map((t) => t.id), [4, 3, 2, 1]);
  assert.deepEqual(app.buildQueueGroups([]), []);
});

test("clicking a queue entry scrolls to and highlights the work; missing work is restored", () => {
  const timers = [];
  global.setTimeout = (fn, ms) => { timers.push([fn, ms]); return 0; };
  const grid = new FakeNode();
  app.els.imageGrid = grid;
  app.els.imageEmpty = new FakeNode();
  app.els.imageHistory = new FakeNode();
  app.els.visualCanvas = new FakeNode();
  const tasks = [
    { id: "a", sessionId: "s", type: "image", status: "done", prompt: "A", media: [], createdAt: 1 },
    { id: "b", sessionId: "s", type: "video", status: "done", prompt: "B", media: [], createdAt: 2 },
  ];
  app.setTestVisualState([{ id: "s", queueBatches: [] }], tasks, "s");
  app.renderQueuePanel(tasks, []);
  assert.equal(app.els.imageHistory.children.length, 2);
  // canvas holds only "a" (b was cleared)
  const nodeA = new FakeNode("article");
  nodeA.dataset.taskId = "a";
  grid.appendChild(nodeA);

  app.els.imageHistory.children.find((n) => n.dataset.taskId === "a").click();
  assert.equal(nodeA.scrolled, 1);
  assert.ok(nodeA.classList.contains("jump-highlight"));
  const [fn, ms] = timers.at(-1);
  assert.equal(ms, 1200);
  fn();
  assert.ok(!nodeA.classList.contains("jump-highlight"));

  app.els.imageHistory.children.find((n) => n.dataset.taskId === "b").click();
  const restored = grid.children.find((n) => n.dataset.taskId === "b");
  assert.ok(restored, "work restored into the canvas from session data");
  assert.equal(restored.scrolled, 1);
  assert.ok(restored.classList.contains("jump-highlight"));
});

test("chat quick-jump lists one entry per user turn and jumps to that message", () => {
  const messages = [
    { role: "user", content: "第一问" },
    { role: "assistant", content: "答" },
    { role: "user", content: "x".repeat(80) },
  ];
  const items = app.buildChatJumpItems(messages);
  assert.deepEqual(items.map((i) => i.index), [0, 2]);
  assert.equal(items[0].title, "第一问");
  assert.ok(items[1].title.length <= 41);

  const list = new FakeNode();
  const empty = new FakeNode();
  const count = new FakeNode();
  const box = new FakeNode();
  app.els.chatJumpList = list;
  app.els.chatJumpEmpty = empty;
  app.els.chatJumpCount = count;
  app.els.messages = box;
  messages.forEach((_, i) => { const m = new FakeNode(); m.dataset.messageIndex = String(i); box.appendChild(m); });
  app.renderChatJumpList(messages);
  assert.equal(list.children.length, 2);
  assert.equal(empty.hidden, true);
  assert.equal(count.textContent, "2 轮");
  list.children[1].click();
  assert.ok(box.children[2].classList.contains("jump-highlight"));
  assert.equal(box.children[2].scrolled, 1);

  app.renderChatJumpList([]);
  assert.equal(empty.hidden, false);
});
