const assert = require("node:assert/strict");
const test = require("node:test");

global.localStorage = { getItem() { return null; }, setItem() {} };
global.document = { addEventListener() {} };

const app = require("../app.js");
const {
  buildImageRequest, buildVideoRequest, effectiveVideoAspectRatio, imageAspectOptionsForModel, imageCountLimit,
  imageQualityOptionsForModel, inferModelProfile, normalizeVeoDuration, setTestDraftMedia, setTestSettings,
  setVisualOption, videoAspectOptionsForModel, videoDurationOptionsForModel, videoResolutionOptionsForModel,
} = app;

const vals = (list) => list.map((o) => o.value);
const img = (n) => ({ id: n, name: n, mime: "image/png", size: 1, dataUrl: `data:image/png;base64,${n}` });
const imgs = (n, tag = "i") => Array.from({ length: n }, (_, i) => img(`${tag}${i}`));
function use(model, overrides = {}, draft = {}) {
  setTestSettings({
    baseUrl: "https://deeprouter.top", apiKey: "k", videoModel: model,
    videoAspectRatio: "16:9", videoResolution: "720p", videoDuration: 8, videoAudio: true, videoStyle: "auto",
    videoEndpoint: "/v1/video/generations", videoStatusEndpoint: "/v1/video/generations/{id}", ...overrides,
  });
  setTestDraftMedia(draft);
}
const req = (model) => buildVideoRequest("p", inferModelProfile(model));
const body = (model) => JSON.parse(req(model).body);

test("r27 sora: durations, per-model sizes, no duration form field", () => {
  for (const [model, sizes] of [
    ["sora-2", ["720x1280", "1280x720"]],
    ["sora-2-pro", ["720x1280", "1280x720", "1024x1792", "1792x1024", "1080x1920", "1920x1080"]],
  ]) {
    use(model, { videoAspectRatio: sizes[sizes.length - 1], videoDuration: 16 });
    assert.deepEqual(vals(videoDurationOptionsForModel()), ["4", "8", "12", "16", "20"]);
    assert.deepEqual(vals(videoAspectOptionsForModel()), sizes);
    const form = req(model).body;
    assert.equal(form.get("size"), sizes[sizes.length - 1]);
    assert.equal(form.get("seconds"), "16");
    assert.equal(form.get("duration"), null);
  }
  use("sora-2", { videoAspectRatio: "1792x1024", videoDuration: 20 });
  assert.equal(effectiveVideoAspectRatio("sora-2"), "1280x720");
  assert.equal(req("sora-2").body.get("seconds"), "20");
});

test("r27 veo 2 durations include 7", () => {
  use("veo-2", { baseUrl: "https://generativelanguage.googleapis.com" });
  assert.deepEqual(vals(videoDurationOptionsForModel()), ["5", "6", "7", "8"]);
  assert.equal(normalizeVeoDuration(7, "veo-2"), 7);
  use("veo-3.1-generate-preview", { baseUrl: "https://generativelanguage.googleapis.com" });
  assert.deepEqual(vals(videoDurationOptionsForModel()), ["4", "6", "8"]);
});

test("r27 seedance 2.5: 4k, frames force adaptive-only options", () => {
  const model = "doubao-seedance-2-5-260628";
  use(model);
  assert.deepEqual(vals(videoResolutionOptionsForModel()), ["480p", "720p", "1080p", "4k"]);
  assert.equal(vals(videoAspectOptionsForModel()).length, 7);
  use(model, {}, { firstFrame: img("a") });
  assert.deepEqual(vals(videoAspectOptionsForModel()), ["adaptive"]);
  use(model, {}, { lastFrame: img("b") });
  assert.deepEqual(vals(videoAspectOptionsForModel()), ["adaptive"]);
  use(model, {}, { videoImages: imgs(2) });
  assert.equal(vals(videoAspectOptionsForModel()).length, 7);
  use("doubao-seedance-2-0-260128", {}, { firstFrame: img("a") });
  assert.equal(vals(videoAspectOptionsForModel()).length, 7);
});

test("r27 seedance material limits throw at build time", () => {
  const m20 = "doubao-seedance-2-0";
  const m25 = "doubao-seedance-2-5-260628";
  const vids = (n) => Array.from({ length: n }, (_, i) => ({ id: `v${i}`, name: `v${i}.mp4`, mime: "video/mp4", size: 1, dataUrl: `data:video/mp4;base64,v${i}` }));
  use(m20, {}, { videoImages: imgs(9), videoReferences: vids(3) });
  assert.doesNotThrow(() => req(m20));
  use(m20, {}, { videoImages: imgs(10) });
  assert.throws(() => req(m20), /参考图最多 9/);
  use(m20, {}, { videoReferences: vids(4) });
  assert.throws(() => req(m20), /参考视频最多 3/);
  use(m25, {}, { videoReferences: vids(10) });
  assert.doesNotThrow(() => req(m25));
  use(m25, {}, { videoReferences: vids(11) });
  assert.throws(() => req(m25), /参考视频最多 10/);
  use(m25, {}, { videoImages: imgs(12) });
  assert.doesNotThrow(() => req(m25));
});

test("r27 kling 4k and 1:1", () => {
  use("kling-3.0");
  assert.deepEqual(vals(videoResolutionOptionsForModel()), ["720p", "1080p", "4k"]);
  assert.deepEqual(vals(videoAspectOptionsForModel()), ["16:9", "9:16", "1:1"]);
  use("kling-3.0-omni", { videoAspectRatio: "1:1", videoResolution: "4k" });
  assert.equal(effectiveVideoAspectRatio("kling-3.0-omni"), "1:1");
  assert.deepEqual(vals(videoResolutionOptionsForModel()), ["720p", "1080p", "4k"]);
});

test("r27 grok video: unified ratios, 1.5 1080p, reference_images caps", () => {
  const ratios = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "21:9", "5:2"];
  for (const model of ["grok-imagine-video", "grok-imagine-video-1.5", "grok-video-3"]) {
    use(model, { baseUrl: "https://ai.linkmesh.org" });
    assert.deepEqual(vals(videoAspectOptionsForModel()), ratios);
  }
  use("grok-imagine-video", { baseUrl: "https://ai.linkmesh.org" });
  assert.deepEqual(vals(videoResolutionOptionsForModel()), ["480p", "720p"]);
  use("grok-imagine-video-1.5", { baseUrl: "https://ai.linkmesh.org" });
  assert.deepEqual(vals(videoResolutionOptionsForModel()), ["480p", "720p", "1080p"]);
  use("grok-imagine-video", { baseUrl: "https://ai.linkmesh.org" }, { videoImages: imgs(10) });
  assert.equal(body("grok-imagine-video").reference_images.length, 7);
  use("grok-imagine-video-1.5", { baseUrl: "https://ai.linkmesh.org" }, { videoImages: imgs(16) });
  assert.equal(body("grok-imagine-video-1.5").reference_images.length, 14);
});

test("r27 grok image: 16 ratios, edit sources <=5, n up to 10", () => {
  setTestSettings({ baseUrl: "https://ai.linkmesh.org", apiKey: "k", imageModel: "grok-imagine-image", imageAspectRatio: "19.5:9", imageCount: 10, imageEndpoint: "/v1/images/generations" });
  assert.equal(vals(imageAspectOptionsForModel()).length, 16);
  assert.equal(vals(imageAspectOptionsForModel())[0], "auto");
  const gen = JSON.parse(buildImageRequest("p", [], false).body);
  assert.equal(gen.n, 10);
  assert.equal(gen.aspect_ratio, "19.5:9");
  const edit = JSON.parse(buildImageRequest("p", imgs(8), true).body);
  assert.equal(edit.images.length, 5);
});

test("r27 image count limits per model", () => {
  assert.equal(imageCountLimit("gpt-image-1"), 10);
  assert.equal(imageCountLimit("gpt-image-2"), 10);
  assert.equal(imageCountLimit("grok-imagine-image"), 10);
  assert.equal(imageCountLimit("dall-e-3"), 1);
  assert.equal(imageCountLimit("seedream-4.0"), 4);
  assert.equal(imageCountLimit("gemini-2.5-flash-image"), 4);

  setTestSettings({ imageModel: "gpt-image-2" });
  const setCount = (model, value) => {
    setTestSettings({ imageModel: model });
    try { setVisualOption("imageCount", value); } catch { /* DOM render is absent under node */ }
    return app.getTestSettings().imageCount;
  };
  assert.equal(setCount("gpt-image-2", "10"), 10);
  assert.equal(setCount("gpt-image-2", "99"), 10);
  assert.equal(setCount("grok-imagine-image", "7"), 7);
  assert.equal(setCount("dall-e-3", "3"), 1);
  assert.equal(setCount("seedream-4.0", "9"), 4);
  assert.equal(setCount("gemini-2.5-flash-image", "9"), 4);
  setTestSettings({ baseUrl: "https://deeprouter.top", apiKey: "k", imageModel: "gpt-image-2", imageCount: 10, imageEndpoint: "/v1/images/generations" });
  assert.equal(JSON.parse(buildImageRequest("p", [], false).body).n, 10);
  setTestSettings({ imageModel: "gpt-image-2", imageCount: 99 });
  assert.equal(JSON.parse(buildImageRequest("p", [], false).body).n, 10);
  setTestSettings({ imageModel: "dall-e-3", imageCount: 5 });
  assert.equal(JSON.parse(buildImageRequest("p", [], false).body).n, 1);
  setTestSettings({ imageModel: "seedream-4.0", imageCount: 8, imageSequential: true });
  const seedream = JSON.parse(buildImageRequest("p", [], false).body);
  assert.ok(JSON.stringify(seedream).length > 0);
  assert.ok((seedream.sequential_image_generation_options?.max_images ?? 4) <= 4);
});

test("r27 seedream has no quality options", () => {
  setTestSettings({ imageModel: "seedream-4.0" });
  assert.deepEqual(imageQualityOptionsForModel(), []);
});

test("r27 audio row hidden for sora and all veo, kept for others", () => {
  for (const m of ["sora-2", "sora-2-pro", "veo-2.0-generate-001", "veo-3.0-generate-preview", "veo-3.1-generate-preview", "veo3.1-fast"]) {
    assert.equal(app.videoAudioRowHidden(m), true, m);
  }
  assert.equal(app.videoAudioRowHidden("doubao-seedance-1-0-pro"), false);
});
