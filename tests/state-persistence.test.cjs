const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const app = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const STORAGE_KEY = "yhshu_online_client_state_v1";

function boot(seed) {
  const store = new Map();
  if (seed) store.set(STORAGE_KEY, JSON.stringify(seed));
  const warnings = [];
  const sandbox = {
    console: { log() {}, error() {}, info() {}, warn: (...args) => warnings.push(args) },
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    },
    document: { addEventListener() {} },
    location: { href: "http://localhost/", origin: "http://localhost", search: "", hash: "", hostname: "localhost" },
    setTimeout, clearTimeout, setInterval, clearInterval,
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  // `let state` is script-scoped, so read it from inside the same script context.
  vm.runInContext(app, sandbox, { filename: "app.js" });
  const read = (expr) => vm.runInContext(expr, sandbox);
  return { read, warnings };
}

const SEED = {
  settings: { apiKey: "sk-seeded-key-123", baseUrl: "https://www.deeprouter.top" },
  activeMode: "chat",
  sessions: [
    { id: "chat-1", title: "已有聊天", createdAt: 1, updatedAt: 2, pinned: false, messages: [{ role: "user", content: "hi" }] },
  ],
  activeSessionId: "chat-1",
  visualSessions: [{ id: "vis-1", title: "视觉", createdAt: 1, updatedAt: 2, pinned: false, contextEnabled: true }],
  activeVisualSessionId: "vis-1",
  visualTasks: [
    { id: "task-1", sessionId: "vis-1", type: "image", status: "done", prompt: "a cat", media: ["data:image/png;base64,AAAA"], params: {}, createdAt: 1 },
  ],
};

test("seeded localStorage state survives script evaluation (no TDZ fallback)", () => {
  const { read, warnings } = boot(SEED);
  assert.deepEqual(warnings, [], "loadState must not hit its catch during boot");
  assert.equal(read("state.settings.apiKey"), "sk-seeded-key-123");
  assert.equal(read("state.sessions.length"), 1);
  assert.equal(read("state.sessions[0].id"), "chat-1");
  assert.equal(read("state.visualTasks.length"), 1);
  assert.equal(read("state.visualTasks[0].id"), "task-1");
});

test("empty localStorage still yields initial state without warnings", () => {
  const { read, warnings } = boot(null);
  assert.deepEqual(warnings, []);
  assert.equal(read("state.settings.apiKey"), "");
});
