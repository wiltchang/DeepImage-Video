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
const { videoResultUrlsForTask, renderVisualTask } = require("../app.js");
const walk = (el, out = []) => { out.push(el); (el.children || []).forEach((c) => walk(c, out)); return out; };

test("r29 two differently named mp4 + content endpoint -> one direct URL", () => {
  const out = videoResultUrlsForTask({
    video_url: "https://a.example.com/one.mp4",
    alt_url: "https://b.example.com/two.mp4",
    url: "https://gw.example.com/v1/videos/task_1/content",
  }, { provider: "muse" });
  assert.deepEqual(out, ["https://a.example.com/one.mp4"]);
});

test("r29 stored task with two differently named mp4 renders one video", () => {
  const card = renderVisualTask({
    id: "t2", type: "video", status: "done", model: "muse-video-20s", prompt: "p", createdAt: Date.now(),
    media: ["https://a.example.com/one.mp4", "https://b.example.com/two.mp4"],
  });
  assert.equal(walk(card).filter((e) => e.tag === "video").length, 1);
});
