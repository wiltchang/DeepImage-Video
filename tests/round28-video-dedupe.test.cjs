const assert = require("node:assert/strict");
const test = require("node:test");

global.localStorage = { getItem() { return null; }, setItem() {} };
function fakeEl(tag) {
  return {
    tag, children: [], style: {}, dataset: {}, className: "", textContent: "", innerHTML: "",
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    appendChild(c) { this.children.push(c); return c; },
    append(...c) { this.children.push(...c); },
    addEventListener() {}, setAttribute() {}, querySelector() { return null; }, querySelectorAll() { return []; },
  };
}
global.document = { addEventListener() {}, createElement: fakeEl };

const { extractVideoUrls, collapseVideoUrls, renderVisualTask } = require("../app.js");
const walk = (el, out = []) => { out.push(el); (el.children || []).forEach((c) => walk(c, out)); return out; };

test("r28 gateway content + upstream content + direct mp4 -> only direct", () => {
  const out = extractVideoUrls({
    video_url: "https://cdn.example.com/out/abc.mp4?sig=1",
    url: "https://gw.example.com/v1/videos/task_1/content",
    upstream: { content_url: "https://up.example.com/v1/videos/up_9/content" },
  });
  assert.deepEqual(out, ["https://cdn.example.com/out/abc.mp4?sig=1"]);
});

test("r28 two content endpoints -> one, upstream preferred", () => {
  const gw = "https://deeprouter.top/v1/videos/task_1/content";
  const up = "https://up.example.com/v1/videos/up_9/content";
  const out = collapseVideoUrls([gw, up]);
  assert.equal(out.length, 1);
  assert.equal(out[0], up);
});

test("r28 same basename mirrors collapse; extract keeps raw different basenames", () => {
  assert.equal(collapseVideoUrls(["https://a.com/x/clip.mp4?s=1", "https://b.com/y/clip.mp4"]).length, 1);
  assert.deepEqual(
    extractVideoUrls({ a_url: "https://a.com/one.mp4", b_url: "https://a.com/two.mp4" }),
    ["https://a.com/one.mp4", "https://a.com/two.mp4"],
  );
});

test("r28 stored task with three routes renders a single video element", () => {
  const task = {
    id: "t1", type: "video", status: "done", model: "muse-video-20s", prompt: "p", createdAt: Date.now(),
    media: [
      "https://gw.example.com/v1/videos/task_1/content",
      "https://up.example.com/v1/videos/up_9/content",
      "https://cdn.example.com/abc.mp4",
    ],
  };
  const card = renderVisualTask(task);
  assert.equal(walk(card).filter((e) => e.tag === "video").length, 1);
});
