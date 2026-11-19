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
  buildChatRequest,
  buildImageRequest,
  imageAspectOptionsForModel,
  imageQualityOptionsForModel,
  imageSizeOptionsForModel,
  imageStyleOptionsForModel,
  isRetryableImageError,
  normalizeModelRecords,
  normalizeState,
  resolveChatProtocol,
  resolveGeminiImageRoute,
  setTestSettings,
} = require("../app.js");

const bananaSettings = {
  baseUrl: "https://api.bananarouter.com",
  apiKey: "test-key",
  temperature: 0.7,
  stream: true,
  systemPrompt: "回答使用中文。",
};

test("BananaRouter generic model records retain inferred image types", () => {
  const records = normalizeModelRecords([
    { id: "gpt-image-2", type: "model" },
    { id: "gpt-image-1.5", type: "model" },
    { id: "gemini-3.1-flash-image-preview", type: "model" },
    { id: "gemini-3-pro-preview", type: "model" },
    { id: "claude-sonnet-4-5", type: "model" },
  ]);
  assert.deepEqual(records.map(({ id, type }) => [id, type]), [
    ["gpt-image-2", "image"],
    ["gpt-image-1.5", "image"],
    ["gemini-3.1-flash-image-preview", "image"],
    ["gemini-3-pro-preview", "chat"],
    ["claude-sonnet-4-5", "chat"],
  ]);
});

test("xAI Grok Imagine image models retain image classification", () => {
  const records = normalizeModelRecords([
    { id: "grok-imagine-image", type: "model" },
    { id: "grok-imagine-image-quality", type: "model" },
  ]);
  assert.deepEqual(records.map(({ id, type, provider }) => [id, type, provider]), [
    ["grok-imagine-image", "image", "xai"],
    ["grok-imagine-image-quality", "image", "xai"],
  ]);
});

test("persisted BananaRouter selections are repaired after reclassification", () => {
  const normalized = normalizeState({
    settings: {
      ...bananaSettings,
      chatModel: "gpt-image-2",
      imageModel: "gemini-3-flash-preview",
    },
    modelRecords: [
      { id: "gpt-image-2", type: "model" },
      { id: "gemini-3-flash-preview", type: "model" },
    ],
  });
  assert.equal(normalized.settings.chatModel, "gemini-3-flash-preview");
  assert.equal(normalized.settings.imageModel, "gpt-image-2");
});

test("new and imported clients default to visual creation without a stale edit mode", () => {
  const normalized = normalizeState({ settings: { imageMode: "image-to-image" } });
  assert.equal(normalized.activeMode, "image");
  assert.equal(normalized.settings.imageMode, "text-to-image");
});

test("BananaRouter Claude chat uses Anthropic Messages API", () => {
  const request = buildChatRequest("claude-sonnet-4-5", [
    { role: "system", content: "回答使用中文。" },
    { role: "user", content: "你好" },
  ], bananaSettings);
  assert.equal(resolveChatProtocol("claude-sonnet-4-5", bananaSettings.baseUrl), "anthropic");
  assert.equal(request.endpoint, "/v1/messages");
  assert.equal(request.payload.system, "回答使用中文。");
  assert.deepEqual(request.payload.messages, [{ role: "user", content: "你好" }]);
  assert.equal(request.payload.max_tokens, 4096);
});

test("BananaRouter Gemini chat uses native generateContent", () => {
  const request = buildChatRequest("gemini-3-flash-preview", [
    { role: "system", content: "回答使用中文。" },
    { role: "user", content: "你好" },
    { role: "assistant", content: "你好，有什么可以帮助你？" },
  ], { ...bananaSettings, stream: false });
  assert.equal(resolveChatProtocol("gemini-3-flash-preview", bananaSettings.baseUrl), "gemini");
  assert.equal(request.endpoint, "/v1beta/models/gemini-3-flash-preview:generateContent");
  assert.deepEqual(request.payload.systemInstruction, { parts: [{ text: "回答使用中文。" }] });
  assert.deepEqual(request.payload.contents.map(({ role }) => role), ["user", "model"]);
});

test("BananaRouter GPT Image uses JSON response instead of image streaming", () => {
  setTestSettings({
    ...bananaSettings,
    imageModel: "gpt-image-1.5",
    imageSize: "1024x1024",
    imageQuality: "auto",
    imageStyle: "auto",
    imageCount: 1,
    imageEndpoint: "/v1/images/generations",
  });
  const request = buildImageRequest("测试图片", [], false);
  const body = JSON.parse(request.body);
  assert.equal(request.endpoint, "/v1/images/generations");
  assert.equal(body.response_format, undefined);
  assert.equal(body.stream, undefined);
  assert.equal(body.output_format, "png");
  assert.equal(body.background, "auto");
});

test("GPT Image 2 exposes official popular sizes and maps automatic ratios", () => {
  setTestSettings({
    ...bananaSettings,
    imageModel: "gpt-image-2",
    imageAspectRatio: "4:3",
    imageSize: "auto",
    imageQuality: "high",
    imageStyle: "auto",
    imageCount: 1,
    imageEndpoint: "/v1/images/generations",
  });
  const options = imageSizeOptionsForModel().map((option) => option.value);
  const body = JSON.parse(buildImageRequest("测试图片", [], false).body);

  assert.equal(options.includes("3840x2160"), true);
  assert.equal(options.includes("2160x3840"), true);
  assert.equal(body.size, "1360x1024");
  assert.equal(body.quality, "high");
});

test("GPT Image models have no style control (official profile)", () => {
  setTestSettings({
    ...bananaSettings,
    imageModel: "gpt-image-2",
    imageAspectRatio: "1:1",
    imageSize: "1024x1024",
    imageQuality: "auto",
    imageStyle: "cinematic",
    imageCount: 1,
    imageEndpoint: "/v1/images/generations",
  });
  const styles = imageStyleOptionsForModel().map((option) => option.value);
  const body = JSON.parse(buildImageRequest("雨夜街道", [], false).body);

  assert.deepEqual(styles, []);
  assert.match(body.prompt, /雨夜街道/);
  assert.doesNotMatch(body.prompt, /电影感构图/);
  assert.equal(body.style, undefined);
  assert.equal(body.stream, undefined);
});

test("Grok Imagine image generation uses official aspect ratio and resolution fields", () => {
  setTestSettings({
    ...bananaSettings,
    imageModel: "grok-imagine-image-quality",
    imageAspectRatio: "9:16",
    imageSize: "1024x1024",
    imageQuality: "2k",
    imageStyle: "cinematic",
    imageCount: 2,
    imageEndpoint: "/v1/images/generations",
  });
  const request = buildImageRequest("未来城市", [], false);
  const body = JSON.parse(request.body);

  assert.deepEqual(imageAspectOptionsForModel().map((option) => option.value), ["auto", "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "2:1", "1:2", "19.5:9", "9:19.5", "20:9", "9:20", "21:9", "5:2"]);
  assert.deepEqual(imageQualityOptionsForModel().map((option) => option.value), ["1k", "2k"]);
  assert.equal(request.endpoint, "/v1/images/generations");
  assert.deepEqual(body, {
    model: "grok-imagine-image-quality",
    prompt: "未来城市",
    n: 2,
    aspect_ratio: "9:16",
    resolution: "2k",
    response_format: "url",
  });
  assert.equal(body.size, undefined);
  assert.equal(body.quality, undefined);
  assert.equal(body.style, undefined);
});

test("LinkMesh Grok image generation preserves every selected official ratio", () => {
  ["9:16", "16:9", "2:3", "3:2", "1:1"].forEach((ratio) => {
    setTestSettings({
      ...bananaSettings,
      baseUrl: "https://ai.linkmesh.org",
      imageModel: "grok-imagine-image",
      imageAspectRatio: ratio,
      imageQuality: "1k",
      imageCount: 1,
    });
    const body = JSON.parse(buildImageRequest("比例测试", [], false).body);
    assert.equal(body.aspect_ratio, ratio);
    assert.equal(body.resolution, "1k");
  });
});

test("Grok Imagine multi-image continuation uses the official JSON edits endpoint", () => {
  setTestSettings({
    ...bananaSettings,
    imageModel: "grok-imagine-image",
    imageAspectRatio: "3:2",
    imageQuality: "1k",
    imageCount: 1,
    imageEditEndpoint: "/v1/images/edits",
  });
  const references = ["A", "B"].map((suffix) => ({
    name: `${suffix}.png`,
    mime: "image/png",
    dataUrl: `data:image/png;base64,${suffix}`,
  }));
  const request = buildImageRequest("继续修改", references, true);
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1/images/edits");
  assert.deepEqual(body.images, references.map((reference) => ({ url: reference.dataUrl })));
  assert.equal(body.aspect_ratio, "3:2");
  assert.equal(body.resolution, "1k");
});

test("GPT Image 1.5 repairs legacy DALL-E dimensions", () => {
  setTestSettings({
    ...bananaSettings,
    imageModel: "gpt-image-1.5",
    imageAspectRatio: "9:16",
    imageSize: "1024x1792",
    imageQuality: "auto",
    imageStyle: "auto",
    imageCount: 1,
    imageEndpoint: "/v1/images/generations",
  });
  const body = JSON.parse(buildImageRequest("测试图片", [], false).body);
  assert.equal(body.size, "1024x1536");
});

test("transient upstream image errors are retryable but parameter errors are not", () => {
  assert.equal(isRetryableImageError(400, "Upstream model service error. Try again later."), true);
  assert.equal(isRetryableImageError(503, "Service unavailable"), true);
  assert.equal(isRetryableImageError(400, "size sides must be multiples of 16px"), false);
});

test("BananaRouter Gemini image models use native generateContent", () => {
  setTestSettings({
    ...bananaSettings,
    imageModel: "gemini-3.1-flash-image-preview",
    imageAspectRatio: "1:1",
    imageSize: "1024x1024",
    imageQuality: "auto",
    imageStyle: "auto",
  });
  const request = buildImageRequest("测试图片", [{
    name: "reference.png",
    mime: "image/png",
    dataUrl: "data:image/png;base64,YWJjZA==",
  }], true);
  const body = JSON.parse(request.body);
  assert.equal(resolveGeminiImageRoute("gemini-3.1-flash-image-preview"), "native");
  assert.equal(request.endpoint, "/v1beta/models/gemini-3.1-flash-image-preview:generateContent");
  assert.deepEqual(body.contents[0].parts[1], {
    inlineData: { mimeType: "image/png", data: "YWJjZA==" },
  });
});
