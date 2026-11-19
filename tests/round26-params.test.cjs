const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

global.localStorage = { getItem() { return null; }, setItem() {} };
global.document = { addEventListener() {} };

const app = require("../app.js");
const {
  buildVideoRequest, effectiveVideoDuration, effectiveVideoResolution, inferModelProfile,
  isSeedance2Model, normalizeState, setTestDraftMedia, setTestSettings, setVisualOption,
  videoAspectOptionsForModel, videoDurationOptionsForModel, videoResolutionOptionsForModel, videoStatusEndpointForTask,
} = app;

function use(model, overrides = {}) {
  setTestSettings({
    baseUrl: "https://deeprouter.top", apiKey: "k", videoModel: model,
    videoAspectRatio: "16:9", videoResolution: "1080p", videoDuration: 7,
    videoEndpoint: "/v1/video/generations", videoStatusEndpoint: "/v1/video/generations/{id}", videoStyle: "auto", ...overrides,
  });
}
const body = (model) => JSON.parse(buildVideoRequest("p", inferModelProfile(model)).body);
const vals = (list) => list.map((o) => o.value);
const img = (n) => ({ id: n, name: n, mime: "image/png", size: 1, dataUrl: `data:image/png;base64,${n}` });

test("r26 muse: aspect list, no resolution, duration per model", () => {
  use("muse-video");
  assert.deepEqual(vals(videoAspectOptionsForModel()), ["16:9", "9:16", "1:1", "4:3", "3:4"]);
  assert.deepEqual(vals(videoDurationOptionsForModel()), ["1","2","3","4","5","6","7","8","9","10"]);
  assert.equal(effectiveVideoDuration(), 7);
  for (const n of [20, 30, 40, 50, 60]) {
    use(`muse-video-${n}s`);
    assert.deepEqual(vals(videoDurationOptionsForModel()), [String(n)]);
    assert.equal(effectiveVideoDuration(), n);
    assert.equal(body(`muse-video-${n}s`).seconds, String(n));
  }
});

test("r26 muse request body field set and seconds type", () => {
  use("muse-video", { videoStyle: "cinematic", videoCameraMotion: "orbit" });
  setTestDraftMedia({ firstFrame: img("a"), lastFrame: img("b"), videoImages: [1, 2, 3, 4, 5, 6].map((n) => img(`r${n}`)) });
  const b = body("muse-video");
  assert.deepEqual(Object.keys(b).sort(),
    ["aspect_ratio", "camera_motion", "first_frame", "images", "last_frame", "model", "prompt", "seconds", "style"]);
  assert.equal(typeof b.seconds, "string");
  assert.equal(b.images.length, 4);
  assert.equal(b.camera_motion, "orbit");
  setTestDraftMedia({});
  use("muse-video", { videoStyle: "auto" });
  assert.deepEqual(Object.keys(body("muse-video")).sort(), ["aspect_ratio", "model", "prompt", "seconds"]);
  use("muse-video", { videoCameraMotion: "" });
  assert.equal("camera_motion" in body("muse-video"), false);
});

test("r26 videoCameraMotion default, persistence and settable", () => {
  assert.equal(normalizeState({ settings: {} }).settings.videoCameraMotion, "");
  assert.equal(normalizeState({ settings: { videoCameraMotion: "zoom_in" } }).settings.videoCameraMotion, "zoom_in");
});

test("r26 coke/canopus revert to the Volcengine Seedance 2.0 profile (as in r25)", () => {
  for (const id of ["seedance2.0 coke", "seedance-2.0-canopus"]) {
    assert.equal(isSeedance2Model(id), true);
    assert.equal(inferModelProfile(id).provider, "seedance");
  }
});

test("r26 muse summary hides resolution; panel markup and version", () => {
  const src = fs.readFileSync("app.js", "utf8");
  assert.match(src, /videoResolutionRow\.hidden = usesPixelSize \|\| isMuse/);
  assert.match(src, /videoAudioRow\.hidden = .*\|\| isMuse/);
  const html = fs.readFileSync("index.html", "utf8");
  assert.match(html, /id="videoCameraMotionGroup"/);
  assert.match(html, /app\.js\?v=20261119-r26/);
  assert.match(html, /styles\.css\?v=20261119-r26/);
});

test("r26 muse: default endpoints align to /v1/videos, custom kept", () => {
  use("muse-video", {});
  const profile = inferModelProfile("muse-video");
  assert.equal(profile.provider, "muse");
  assert.equal(buildVideoRequest("p", profile).endpoint, "/v1/videos");
  assert.equal(videoStatusEndpointForTask({ provider: "muse" }), "/v1/videos/{id}");
  setTestSettings({ videoEndpoint: "/custom/create", videoStatusEndpoint: "/custom/{id}" });
  assert.equal(buildVideoRequest("p", profile).endpoint, "/custom/create");
  assert.equal(videoStatusEndpointForTask({ provider: "muse" }), "/custom/{id}");
});
