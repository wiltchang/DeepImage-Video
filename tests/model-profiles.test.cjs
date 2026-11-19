const assert = require("node:assert/strict");
const test = require("node:test");

global.localStorage = {
  getItem() {
    return null;
  },
  setItem() {},
};
global.document = {
  addEventListener() {},
};

const {
  MODEL_CATALOG,
  buildImageRequest,
  buildVideoRequest,
  getModelProfile,
  imageAspectOptionsForModel,
  imageQualityOptionsForModel,
  imageSizeOptionsForModel,
  inferModelProfile,
  isLegacyGeminiImageModel,
  isMuseVideoModel,
  normalizeSeedDanceDuration,
  seedreamSizeFromTier,
  setTestDraftMedia,
  setTestSettings,
  videoDurationOptionsForModel,
  videoResolutionOptionsForModel,
} = require("../app.js");

function buildImage(model, overrides = {}, references = [], isEdit = false) {
  setTestSettings({
    baseUrl: "https://deeprouter.top",
    apiKey: "sk-test",
    imageModel: model,
    imageApiStyle: "auto",
    imageAspectRatio: "1:1",
    imageSize: "1024x1024",
    imageQuality: "auto",
    imageCount: 1,
    ...overrides,
  });
  setTestDraftMedia({});
  return buildImageRequest("测试提示词", references, isEdit);
}

function optionValues(options) {
  return options.map((option) => option.value);
}

test("catalog includes the new image and Seedance models but not gpt-image-1", () => {
  const ids = MODEL_CATALOG.map((model) => model.id);
  [
    "gpt-image-2.6-sunburst",
    "gpt-image-2.6-flare",
    "gpt-image-2.5-sunburst",
    "gpt-image-2.5-flare",
    "gpt-image-1.5",
    "doubao-seedance-2-0-260128",
    "doubao-seedance-2-0-fast-260128",
    "doubao-seedance-2-0-mini-260615",
    "doubao-seedance-2-5-260628",
    "nano-banana-2.1",
  ].forEach((id) => assert.ok(ids.includes(id), `missing catalog entry ${id}`));
  assert.equal(ids.includes("gpt-image-1"), false);
  const banana = getModelProfile("nano-banana-2.1");
  assert.equal(banana.type, "image");
  assert.equal(banana.provider, "gemini");
});

test("GPT Image 2.5/2.6 quality options include xhigh and max", () => {
  ["gpt-image-2.6-sunburst", "gpt-image-2.6-flare", "gpt-image-2.5-sunburst", "gpt-image-2.5-flare"].forEach((model) => {
    setTestSettings({ imageModel: model });
    const values = optionValues(imageQualityOptionsForModel());
    assert.deepEqual(values, ["auto", "low", "medium", "high", "xhigh", "max"], model);
  });
});

test("GPT Image 2.6 payload carries background and output_format", () => {
  const request = buildImage("gpt-image-2.6-sunburst", {
    imageQuality: "xhigh",
    imageBackground: "opaque",
    imageOutputFormat: "webp",
  });
  const body = JSON.parse(request.body);
  assert.equal(request.endpoint, "/v1/images/generations");
  assert.equal(body.background, "opaque");
  assert.equal(body.output_format, "webp");
  assert.equal(body.quality, "xhigh");
});

test("GPT Image transparent background forces png output format", () => {
  const request = buildImage("gpt-image-2.6-flare", {
    imageBackground: "transparent",
    imageOutputFormat: "jpeg",
  });
  const body = JSON.parse(request.body);
  assert.equal(body.background, "transparent");
  assert.equal(body.output_format, "png");
});

test("GPT Image 1.5 quality options omit xhigh and max", () => {
  setTestSettings({ imageModel: "gpt-image-1.5" });
  const values = optionValues(imageQualityOptionsForModel());
  assert.deepEqual(values, ["auto", "low", "medium", "high"]);
});

test("DALL-E 3 payload always generates a single image", () => {
  const request = buildImage("dall-e-3", { imageCount: 4, imageQuality: "hd" });
  const body = JSON.parse(request.body);
  assert.equal(body.n, 1);
  assert.equal(body.quality, "hd");
});

test("Seedream converts size tiers and sends watermark and sequential fields", () => {
  assert.equal(seedreamSizeFromTier("1K", "16:9"), "1360x768");
  assert.equal(seedreamSizeFromTier("2K", "1:1"), "2048x2048");

  const grouped = buildImage("seedream-4.0", {
    imageSize: "1K",
    imageAspectRatio: "16:9",
    imageCount: 3,
    imageWatermark: true,
    imageSequential: true,
  });
  const groupedBody = JSON.parse(grouped.body);
  assert.equal(groupedBody.size, "1360x768");
  assert.equal(groupedBody.n, 3);
  assert.equal(groupedBody.watermark, true);
  assert.equal(groupedBody.sequential_image_generation, "auto");
  assert.deepEqual(groupedBody.sequential_image_generation_options, { max_images: 3 });

  const single = buildImage("seedream-4.0", { imageSize: "2K", imageWatermark: false, imageSequential: false });
  const singleBody = JSON.parse(single.body);
  assert.equal(singleBody.watermark, false);
  assert.equal(singleBody.sequential_image_generation, "disabled");
  assert.equal("sequential_image_generation_options" in singleBody, false);
});

test("Nano Banana 2.1 uses the native Gemini imageConfig with the full aspect set", () => {
  const aspects = optionValues(imageAspectOptionsForModel("nano-banana-2.1"));
  assert.equal(aspects.length, 14);
  assert.ok(aspects.includes("21:9"));

  const request = buildImage("nano-banana-2.1", {
    imageApiStyle: "gemini",
    imageAspectRatio: "21:9",
    imageSize: "2K",
  });
  assert.ok(request.endpoint.includes("/v1beta/models/nano-banana-2.1:generateContent"));
  const body = JSON.parse(request.body);
  assert.deepEqual(body.generationConfig.imageConfig, { aspectRatio: "21:9", imageSize: "2K" });
});

test("legacy Gemini 2.5 Flash image has no resolution tier and sends no imageSize", () => {
  assert.equal(isLegacyGeminiImageModel("gemini-2.5-flash-image"), true);
  setTestSettings({ imageModel: "gemini-2.5-flash-image" });
  assert.deepEqual(optionValues(imageSizeOptionsForModel()), ["auto"]);

  const request = buildImage("gemini-2.5-flash-image", {
    imageApiStyle: "gemini",
    imageAspectRatio: "16:9",
    imageSize: "2K",
  });
  const body = JSON.parse(request.body);
  assert.deepEqual(body.generationConfig.imageConfig, { aspectRatio: "16:9" });
});

test("Seedance 2.0 Mini excludes 1080p and floors duration at 4 seconds", () => {
  setTestSettings({ videoModel: "doubao-seedance-2-0-mini-260615" });
  const resolutions = optionValues(videoResolutionOptionsForModel());
  assert.deepEqual(resolutions, ["480p", "720p"]);
  const durations = optionValues(videoDurationOptionsForModel())
    .map(Number)
    .filter((value) => value > 0);
  assert.equal(Math.min(...durations), 4);
  assert.equal(normalizeSeedDanceDuration(2), 4);
});

test("Muse models infer as video and post to the generic video generations endpoint", () => {
  assert.equal(isMuseVideoModel("muse-video-1"), true);
  assert.equal(isMuseVideoModel("gpt-image-2"), false);
  const profile = inferModelProfile("muse-video-1");
  assert.equal(profile.type, "video");
  assert.equal(profile.provider, "muse");

  setTestSettings({
    baseUrl: "https://deeprouter.top",
    apiKey: "sk-test",
    videoModel: "muse-video-1",
    videoAspectRatio: "9:16",
    videoResolution: "1080p",
    videoDuration: 7,
    videoEndpoint: "/v1/video/generations",
  });
  setTestDraftMedia({});
  const request = buildVideoRequest("测试视频提示词", { provider: "muse", vendor: "Muse" });
  assert.equal(request.endpoint, "/v1/videos");
  const body = JSON.parse(request.body);
  assert.equal(body.model, "muse-video-1");
  assert.equal(body.aspect_ratio, "9:16");
  assert.equal(body.seconds, "7");
  assert.equal(body.duration, undefined);
});
