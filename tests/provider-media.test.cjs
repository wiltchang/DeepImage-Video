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
  apiUrlForBase,
  buildGrokTextVideoFallbackRequest,
  buildVideoRequest,
  encodeVideoTaskId,
  extractErrorMessage,
  extractJobId,
  extractTaskStatus,
  extractVideoUrls,
  fetchVideoTaskResource,
  generatedResultToMedia,
  materializeVideoUrls,
  normalizeModelRecords,
  normalizeState,
  shouldStopMissingVideoTaskPolling,
  setTestDraftMedia,
  setTestSettings,
  videoStatusHeadersForTask,
  videoStatusEndpointForTask,
  videoResultUrlsForTask,
} = require("../app.js");

function media(name = "reference.png") {
  return {
    name,
    mime: "image/png",
    size: 4,
    dataUrl: "data:image/png;base64,YWJjZA==",
  };
}

function buildVideo(model, provider, overrides = {}, draft = {}) {
  setTestSettings({
    baseUrl: provider === "xai" ? "https://ai.linkmesh.org" : "https://deeprouter.top",
    apiKey: "test-key",
    videoModel: model,
    videoAspectRatio: "16:9",
    videoResolution: "720p",
    videoDuration: 8,
    videoAudio: true,
    videoApiStyle: "auto",
    videoEndpoint: "/v1/video/generations",
    videoStatusEndpoint: "/v1/video/generations/{id}",
    ...overrides,
  });
  setTestDraftMedia(draft);
  const vendor = provider === "veo" ? "Google" : provider === "sora" ? "OpenAI" : "xAI";
  return buildVideoRequest("测试视频提示词", { id: model, provider, vendor });
}

test("LinkMesh API URLs use the same-origin proxy without duplicating v1", () => {
  assert.equal(apiUrlForBase("https://ai.linkmesh.org", "/v1/models"), "/__linkmesh/v1/models");
  assert.equal(apiUrlForBase("https://ai.linkmesh.org/v1", "/v1/models"), "/__linkmesh/v1/models");
  assert.equal(
    apiUrlForBase("https://ai.linkmesh.org", "https://ai.linkmesh.org/v1/videos/task_123/content"),
    "/__linkmesh/v1/videos/task_123/content"
  );
  assert.equal(
    apiUrlForBase("https://deeprouter.top", "https://cdn.example.com/result.mp4"),
    "https://cdn.example.com/result.mp4"
  );
});

test("LinkMesh Grok video creation and status requests stay on official xAI paths", () => {
  const request = buildVideo("grok-imagine-video", "xai", {
    baseUrl: "https://ai.linkmesh.org",
    videoAspectRatio: "3:2",
    videoDuration: 8,
  });
  assert.equal(apiUrlForBase("https://ai.linkmesh.org", request.endpoint), "/__linkmesh/v1/videos/generations");
  assert.equal(
    apiUrlForBase("https://ai.linkmesh.org", videoStatusEndpointForTask({
      provider: "xai",
      requestEndpoint: request.endpoint,
    }).replace("{id}", "request-id")),
    "/__linkmesh/v1/videos/request-id"
  );
  assert.equal(JSON.parse(request.body).aspect_ratio, "3:2");
});

test("DeepRouter Grok video repairs stale official endpoints to multipart", () => {
  const request = buildVideo("grok-imagine-video", "xai", {
    baseUrl: "https://deeprouter.top",
    videoEndpoint: "/v1/videos/generations",
    videoStatusEndpoint: "/v1/videos/generations/{id}",
    videoAspectRatio: "9:16",
    videoResolution: "480p",
    videoDuration: 8,
  });

  assert.equal(request.endpoint, "/v1/videos");
  assert.equal(request.headers.Authorization, "test-key");
  assert.equal(request.body instanceof FormData, true);
  assert.equal(request.body.get("model"), "grok-imagine-video");
  assert.equal(request.body.get("prompt"), "测试视频提示词");
  assert.equal(request.body.get("size"), "9:16");
  assert.equal(request.body.get("seconds"), "8");
  assert.equal(request.body.get("duration"), "8");
  assert.equal(request.body.get("resolution"), "480p");
  assert.equal(videoStatusEndpointForTask({
    provider: "xai",
    requestEndpoint: request.endpoint,
  }), "/v1/videos/{id}");
  assert.equal(videoStatusHeadersForTask({
    provider: "xai",
    requestEndpoint: request.endpoint,
  }).Authorization, "test-key");
});

test("DeepRouter Grok Imagine 1.5 keeps the minimal multipart contract", () => {
  const reference = media();
  reference.file = new Blob(["abcd"], { type: "image/png" });
  const request = buildVideo("grok-imagine-video-1.5-preview", "xai", {
    baseUrl: "https://deeprouter.top",
    videoAspectRatio: "3:2",
    videoResolution: "1080p",
    videoDuration: 15,
  }, { firstFrame: reference });

  assert.equal(request.endpoint, "/v1/videos");
  assert.equal(request.body.get("size"), "3:2");
  assert.equal(request.body.get("seconds"), "15");
  assert.equal(request.body.has("duration"), false);
  assert.equal(request.body.has("resolution"), false);
  assert.equal(request.body.get("input_reference") instanceof Blob, true);
});

test("relative LinkMesh Grok video results are proxied and downloaded with authorization", async () => {
  setTestSettings({ baseUrl: "https://ai.linkmesh.org", apiKey: "test-key" });
  assert.deepEqual(extractVideoUrls({ status: "done", url: "/v1/videos/request-id/content" }), [
    "/__linkmesh/v1/videos/request-id/content",
  ]);

  const originalFetch = global.fetch;
  let receivedHeaders;
  global.fetch = async (url, options = {}) => {
    assert.equal(url, "/__linkmesh/v1/videos/request-id/content");
    receivedHeaders = options.headers;
    return new Response(new Blob(["video-content"], { type: "video/mp4" }), {
      status: 200,
      headers: { "Content-Type": "video/mp4" },
    });
  };
  try {
    const task = { id: "linkmesh-task", provider: "xai", requestEndpoint: "/v1/videos/generations" };
    const result = await materializeVideoUrls(["/__linkmesh/v1/videos/request-id/content"], task);
    assert.equal(receivedHeaders.Authorization, "Bearer test-key");
    assert.match(result[0], /^blob:/);
    URL.revokeObjectURL(result[0]);
  } finally {
    global.fetch = originalFetch;
  }
});

test("Grok Imagine 1.5 uses the official JSON generation endpoint", () => {
  const request = buildVideo("grok-imagine-video-1.5-preview", "xai", {
    videoResolution: "720p",
    videoDuration: 20,
  });
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1/videos/generations");
  assert.equal(request.headers.Authorization, "Bearer test-key");
  assert.deepEqual(body, {
    model: "grok-imagine-video-1.5-preview",
    prompt: "测试视频提示词",
    duration: 15,
    aspect_ratio: "16:9",
    resolution: "720p",
  });
});

test("Grok video duration follows the official 1 to 15 second range", () => {
  [1, 4, 8, 15].forEach((duration) => {
    const request = buildVideo("grok-imagine-video-1.5-preview", "xai", { videoDuration: duration });
    assert.equal(JSON.parse(request.body).duration, duration);
  });
  assert.equal(JSON.parse(buildVideo("grok-imagine-video", "xai", { videoDuration: 0 }).body).duration, 1);
  assert.equal(JSON.parse(buildVideo("grok-imagine-video", "xai", { videoDuration: 20 }).body).duration, 15);
});

test("Grok Imagine no longer needs a multipart-to-JSON fallback", () => {
  const request = buildVideo("grok-imagine-video-1.5-preview", "xai", {
    videoAspectRatio: "9:16",
    videoResolution: "720p",
    videoDuration: 8,
  });
  const fallback = buildGrokTextVideoFallbackRequest(
    "测试视频提示词",
    { id: "grok-imagine-video-1.5-preview", provider: "xai", vendor: "xAI" },
    request,
    "grok 1.5 requires a reference image"
  );
  assert.equal(fallback, null);
});

test("Grok Imagine 1.5 does not use the text fallback when a reference image is present", () => {
  const reference = media();
  reference.file = new Blob(["abcd"], { type: "image/png" });
  const multipart = buildVideo("grok-imagine-video-1.5-preview", "xai", {}, { videoImages: [reference] });
  const fallback = buildGrokTextVideoFallbackRequest(
    "测试视频提示词",
    { id: "grok-imagine-video-1.5-preview", provider: "xai", vendor: "xAI" },
    multipart,
    "grok 1.5 requires a reference image"
  );
  assert.equal(fallback, null);
});

test("Grok Imagine 1.5 maps an input image into the official JSON body", () => {
  const reference = media();
  const request = buildVideo("grok-imagine-video-1.5-preview", "xai", {
    videoAspectRatio: "3:2",
    videoResolution: "1080p",
    videoDuration: 20,
  }, { firstFrame: reference });
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1/videos/generations");
  assert.equal(request.headers.Authorization, "Bearer test-key");
  assert.deepEqual(body, {
    model: "grok-imagine-video-1.5-preview",
    prompt: "测试视频提示词",
    duration: 15,
    aspect_ratio: "3:2",
    resolution: "1080p",
    image: { url: reference.dataUrl },
  });
  assert.equal(videoStatusHeadersForTask({ provider: "xai", requestEndpoint: request.endpoint }).Authorization, "Bearer test-key");
  assert.equal(videoStatusHeadersForTask({ provider: "xai", requestEndpoint: request.endpoint })["Content-Type"], "application/json");
});

test("continuing from a Grok video uses the official edits endpoint", () => {
  const video = {
    name: "result.mp4",
    mime: "video/mp4",
    size: 8,
    dataUrl: "data:video/mp4;base64,dmlkZW8=",
  };
  const request = buildVideo("grok-imagine-video", "xai", {}, { videoReferences: [video] });
  assert.equal(request.endpoint, "/v1/videos/edits");
  assert.equal(request.headers.Authorization, "Bearer test-key");
  assert.deepEqual(JSON.parse(request.body), {
    model: "grok-imagine-video",
    prompt: "测试视频提示词",
    video: { url: video.dataUrl },
  });
});

test("nested video task errors expose the upstream cause", () => {
  const failure = {
    code: "fail_to_fetch_task",
    message: JSON.stringify({
      code: "fail_to_fetch_task",
      message: JSON.stringify({ status: "failed", error: { message: "上游视频生成失败" } }),
    }),
  };
  assert.equal(extractErrorMessage(failure), "上游视频生成失败");
  assert.equal(extractTaskStatus(failure), "failed");
});

test("nested queued video responses expose their task ID", () => {
  const response = {
    code: "fail_to_fetch_task",
    message: JSON.stringify({
      id: "29d48f1857d04674a663ff00e5750689",
      model: "doubao-seedance-2.0",
      status: "queued",
    }),
  };
  assert.equal(extractJobId(response), "29d48f1857d04674a663ff00e5750689");
  assert.equal(extractTaskStatus(response), "queued");
});

test("missing DeepRouter video tasks receive a polling grace period", () => {
  assert.equal(shouldStopMissingVideoTaskPolling(3), false);
  assert.equal(shouldStopMissingVideoTaskPolling(11), false);
  assert.equal(shouldStopMissingVideoTaskPolling(12), true);
});

test("stringified task payloads expose completed video URLs", () => {
  const response = {
    message: JSON.stringify({ status: "succeeded", content: { video_url: "https://example.com/result.mp4" } }),
  };
  assert.equal(extractTaskStatus(response), "succeeded");
  assert.deepEqual(extractVideoUrls(response), ["https://example.com/result.mp4"]);
});

test("completed DeepRouter tasks prefer the directly playable upstream video URL", () => {
  setTestSettings({ baseUrl: "https://deeprouter.top" });
  const response = {
    data: {
      result_url: "https://www.deeprouter.top/v1/videos/task_public/content",
      data: {
        video_url: "https://api.huandutech.com/v1/videos/task_upstream/content",
      },
      status: "SUCCESS",
    },
  };
  assert.deepEqual(extractVideoUrls(response), [
    "https://api.huandutech.com/v1/videos/task_upstream/content",
  ]);
});

test("Grok result parsing ignores thumbnails and keeps the authenticated video", () => {
  setTestSettings({ baseUrl: "https://deeprouter.top" });
  const response = {
    status: "succeeded",
    result_url: "/v1/videos/task_with_thumbnail/content",
    thumbnail_url: "https://cdn.example.com/task-preview.jpg",
  };
  assert.deepEqual(extractVideoUrls(response), [
    "https://deeprouter.top/v1/videos/task_with_thumbnail/content",
  ]);
});

test("completed Grok tasks derive the standard content endpoint when no URL is returned", () => {
  setTestSettings({ baseUrl: "https://deeprouter.top" });
  assert.deepEqual(videoResultUrlsForTask(
    { id: "task_completed_without_url", status: "completed" },
    { jobId: "task_completed_without_url", provider: "xai", requestEndpoint: "/v1/videos" }
  ), ["https://deeprouter.top/v1/videos/task_completed_without_url/content"]);
});

test("completed LinkMesh Grok tasks also derive the authenticated content endpoint", () => {
  setTestSettings({ baseUrl: "https://ai.linkmesh.org" });
  assert.deepEqual(videoResultUrlsForTask(
    { status: "done" },
    { jobId: "request_without_url", provider: "xai", requestEndpoint: "/v1/videos/generations" }
  ), ["/__linkmesh/v1/videos/request_without_url/content"]);
});

test("relative DeepRouter video content URLs are normalized against the API base", () => {
  setTestSettings({ baseUrl: "https://deeprouter.top" });
  assert.deepEqual(extractVideoUrls({ result_url: "/v1/videos/task_relative/content" }), [
    "https://deeprouter.top/v1/videos/task_relative/content",
  ]);
});

test("authenticated DeepRouter video results are downloaded for browser playback", async () => {
  setTestSettings({ baseUrl: "https://deeprouter.top", apiKey: "test-key" });
  const originalFetch = global.fetch;
  let receivedHeaders;
  global.fetch = async (url, options) => {
    assert.equal(url, "https://www.deeprouter.top/v1/videos/task_private/content");
    receivedHeaders = options.headers;
    return new Response(new Blob(["video-content"], { type: "video/mp4" }), {
      status: 200,
      headers: { "Content-Type": "video/mp4" },
    });
  };
  try {
    const task = { id: "visual-task", provider: "xai", requestEndpoint: "/v1/videos" };
    const media = await materializeVideoUrls([
      "https://www.deeprouter.top/v1/videos/task_private/content",
    ], task);
    assert.equal(receivedHeaders.Authorization, "test-key");
    assert.match(media[0], /^blob:/);
    assert.equal(task.mediaSourceUrls[0], "https://www.deeprouter.top/v1/videos/task_private/content");
    URL.revokeObjectURL(media[0]);
  } finally {
    global.fetch = originalFetch;
  }
});

test("DeepRouter Grok polling retries raw authorization after Bearer is rejected", async () => {
  setTestSettings({ baseUrl: "https://deeprouter.top", apiKey: "test-key" });
  const received = [];
  const originalFetch = global.fetch;
  global.fetch = async (_url, options = {}) => {
    received.push(options.headers?.Authorization);
    if (received.length === 1) {
      return new Response(JSON.stringify({ error: { message: "unauthorized" } }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ status: "pending" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    const response = await fetchVideoTaskResource(
      "https://deeprouter.top/v1/videos/request_test",
      { provider: "xai" }
    );
    assert.equal(response.status, 200);
    assert.deepEqual(received, ["Bearer test-key", "test-key"]);
  } finally {
    global.fetch = originalFetch;
  }
});

test("cross-origin generated media remains reusable when browser download is blocked", async () => {
  setTestSettings({ baseUrl: "https://deeprouter.top", apiKey: "test-key" });
  const originalFetch = global.fetch;
  global.fetch = async () => {
    throw new TypeError("Failed to fetch");
  };

  try {
    const result = await generatedResultToMedia(
      "https://cdn.example.com/generated/result.png",
      "image",
      { id: "task-cors", type: "image", media: [] }
    );
    assert.equal(result.dataUrl, "https://cdn.example.com/generated/result.png");
    assert.equal(result.mime, "image/png");
    assert.equal(result.size, 0);
  } finally {
    global.fetch = originalFetch;
  }
});

test("public upstream video results remain directly playable", async () => {
  const source = "https://cdn.example.com/result.mp4";
  assert.deepEqual(await materializeVideoUrls([source], { id: "public-task", provider: "xai" }), [source]);
});

test("Grok Imagine 1.5 supports the official JSON endpoint when configured", () => {
  const request = buildVideo("grok-imagine-video-1.5-preview", "xai", {
    videoEndpoint: "/v1/videos/generations",
    videoAspectRatio: "2:3",
    videoResolution: "1080p",
    videoDuration: 20,
  }, { videoImages: [media()] });
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1/videos/generations");
  assert.equal(request.headers.Authorization, "Bearer test-key");
  assert.deepEqual(body, {
    model: "grok-imagine-video-1.5-preview",
    prompt: "测试视频提示词",
    duration: 15,
    aspect_ratio: "2:3",
    resolution: "1080p",
    image: { url: "data:image/png;base64,YWJjZA==" },
  });
  assert.equal(videoStatusHeadersForTask({ provider: "xai", requestEndpoint: request.endpoint }).Authorization, "Bearer test-key");
  assert.equal(videoStatusHeadersForTask({ provider: "xai", requestEndpoint: request.endpoint })["Content-Type"], "application/json");

  setTestSettings({ baseUrl: "https://api.x.ai", apiKey: "test-key" });
  assert.equal(videoStatusHeadersForTask({ provider: "xai", requestEndpoint: request.endpoint }).Authorization, "Bearer test-key");
});

test("all Grok video models use the shared supported duration and resolution values", () => {
  [1, 4, 8, 15].forEach((duration) => {
    const request = buildVideo("grok-video-3", "xai", { videoDuration: duration });
    assert.equal(JSON.parse(request.body).duration, duration);
  });

  const standard = buildVideo("grok-video-3", "xai", { videoDuration: 20, videoResolution: "480p" });
  assert.deepEqual(JSON.parse(standard.body), {
    model: "grok-video-3",
    prompt: "测试视频提示词",
    duration: 15,
    aspect_ratio: "16:9",
    resolution: "480p",
  });

  const pro = buildVideo("grok-video-3-pro", "xai", { videoDuration: 20, videoAspectRatio: "9:16" });
  assert.equal(JSON.parse(pro.body).duration, 15);
  assert.equal(JSON.parse(pro.body).aspect_ratio, "9:16");

  const repaired = buildVideo("grok-video-3", "xai", {
    videoAspectRatio: "21:9",
    videoResolution: "1080p",
    videoDuration: 15,
  });
  assert.equal(JSON.parse(repaired.body).aspect_ratio, "16:9");
  assert.equal(JSON.parse(repaired.body).resolution, "720p");
  assert.equal(JSON.parse(repaired.body).duration, 15);

  const quality = buildVideo("grok-imagine-video-1.5", "xai", { videoResolution: "1080p" });
  assert.equal(JSON.parse(quality.body).resolution, "1080p");
});

test("DeepRouter Veo uses the documented multipart video endpoint", () => {
  const reference = media();
  reference.file = new Blob(["abcd"], { type: "image/png" });
  const request = buildVideo("veo_3_1-fast", "veo", {
    videoAspectRatio: "9:16",
    videoResolution: "4k",
    videoDuration: 4,
  }, { firstFrame: reference });

  assert.equal(request.endpoint, "/v1/videos");
  assert.equal(request.headers.Authorization, "test-key");
  assert.equal(request.body instanceof FormData, true);
  assert.equal(request.body.get("model"), "veo_3_1-fast");
  assert.equal(request.body.get("prompt"), "测试视频提示词");
  assert.equal(request.body.get("size"), "1080x1920");
  assert.equal(request.body.get("seconds"), "8");
  assert.equal(request.body.get("duration"), "8");
  assert.equal(request.body.get("resolution"), null);
  assert.equal(request.body.get("input_reference") instanceof Blob, true);
  const task = { provider: "veo", requestEndpoint: request.endpoint };
  assert.equal(videoStatusEndpointForTask(task), "/v1/videos/{id}");
  assert.equal(videoStatusHeadersForTask(task).Authorization, "test-key");
});

test("compact Veo aliases use the working multipart compatibility route", () => {
  const request = buildVideo("veo3.1-fast", "veo", {
    videoAspectRatio: "9:16",
    videoResolution: "720p",
    videoDuration: 4,
  });
  assert.equal(request.endpoint, "/v1/videos");
  assert.equal(request.headers.Authorization, "test-key");
  assert.equal(request.body instanceof FormData, true);
  assert.equal(request.body.get("model"), "veo3.1-fast");
  assert.equal(request.body.get("size"), "1080x1920");
  assert.equal(request.body.get("seconds"), "8");
  assert.equal(request.body.get("duration"), "8");
  const task = { provider: "veo", requestEndpoint: request.endpoint };
  assert.equal(videoStatusEndpointForTask(task), "/v1/videos/{id}");
  assert.equal(videoStatusHeadersForTask(task).Authorization, "test-key");
});

test("official Veo model IDs retain NewAPI metadata controls", () => {
  const request = buildVideo("veo-3.1-fast-generate-preview", "veo", {
    videoAspectRatio: "9:16",
    videoResolution: "4k",
    videoDuration: 4,
  });
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1/video/generations");
  assert.equal(request.headers.Authorization, "Bearer test-key");
  assert.equal(body.metadata.aspectRatio, "9:16");
  assert.equal(body.metadata.resolution, "4k");
  assert.equal(body.metadata.durationSeconds, 8);
});

test("Veo 3.1 uses predictLongRunning on a native Gemini service", () => {
  const request = buildVideo("veo-3.1-generate-preview", "veo", {
    baseUrl: "https://generativelanguage.googleapis.com",
    videoAspectRatio: "4:3",
    videoResolution: "4k",
    videoDuration: 4,
  });
  const body = JSON.parse(request.body);

  assert.equal(request.endpoint, "/v1beta/models/veo-3.1-generate-preview:predictLongRunning");
  assert.deepEqual(body, {
    instances: [{ prompt: "测试视频提示词" }],
    parameters: { aspectRatio: "16:9", durationSeconds: 8, resolution: "4k" },
  });
});

test("Veo 3.1 maps first frame, last frame, and reference images", () => {
  const request = buildVideo("veo-3.1-generate-preview", "veo", {
    baseUrl: "https://generativelanguage.googleapis.com",
  }, {
    firstFrame: media("first.png"),
    lastFrame: media("last.png"),
    videoImages: [media("asset.png")],
  });
  const body = JSON.parse(request.body);

  assert.equal(body.parameters.durationSeconds, 8);
  assert.equal(body.instances[0].image.inlineData.data, "YWJjZA==");
  assert.equal(body.instances[0].lastFrame.inlineData.data, "YWJjZA==");
  assert.equal(body.instances[0].referenceImages[0].referenceType, "asset");
});

test("Veo 2 omits its unsupported resolution parameter", () => {
  const request = buildVideo("veo-2", "veo", {
    baseUrl: "https://generativelanguage.googleapis.com",
    videoDuration: 7,
    videoResolution: "1080p",
  });
  const body = JSON.parse(request.body);
  assert.deepEqual(body.parameters, { aspectRatio: "16:9", durationSeconds: 6 });
});

test("Veo 3.1 Lite is restricted to its supported 720p output", () => {
  const request = buildVideo("veo-3.1-lite-generate-preview", "veo", {
    baseUrl: "https://generativelanguage.googleapis.com",
    videoResolution: "4k",
    videoDuration: 6,
  }, { videoImages: [media("first.png"), media("extra.png")] });
  const body = JSON.parse(request.body);

  assert.equal(body.parameters.resolution, "720p");
  assert.equal(body.parameters.durationSeconds, 6);
  assert.equal(body.instances[0].referenceImages, undefined);
});

test("Sora-2 text generation uses multipart duration aliases", () => {
  const request = buildVideo("sora-2", "sora", {
    videoAspectRatio: "1024x1792",
    videoDuration: 12,
  });
  assert.equal(request.endpoint, "/v1/videos");
  assert.equal(request.headers.Authorization, "Bearer test-key");
  assert.equal(request.body instanceof FormData, true);
  assert.equal(request.body.get("model"), "sora-2");
  assert.equal(request.body.get("size"), "1280x720");
  assert.equal(request.body.get("seconds"), "12");
  assert.equal(request.body.get("duration"), "12");
  const task = { provider: "sora", requestEndpoint: request.endpoint };
  assert.equal(videoStatusEndpointForTask(task), "/v1/videos/{id}");
  assert.equal(videoStatusHeadersForTask(task).Authorization, "Bearer test-key");
});

test("Sora-2 fixes old duration settings to the upstream 12-second default and filters Sora-2 Pro", () => {
  const request = buildVideo("sora-2", "sora", {
    videoAspectRatio: "9:16",
    videoDuration: 10,
  });
  assert.equal(request.body.get("size"), "1280x720");
  assert.equal(request.body.get("seconds"), "12");
  assert.equal(request.body.get("duration"), "12");

  const records = normalizeModelRecords([
    { id: "sora-2", type: "model" },
    { id: "sora-2-pro", type: "model" },
  ]);
  assert.deepEqual(records.map(({ id, vendor, type, provider }) => [id, vendor, type, provider]), [
    ["sora-2", "OpenAI", "video", "sora"],
  ]);
});

test("Sora-2 image generation retains multipart input and duration fields", () => {
  const reference = media();
  reference.file = new Blob(["abcd"], { type: "image/png" });
  const request = buildVideo("sora-2", "sora", { videoDuration: 4 }, { firstFrame: reference });

  assert.equal(request.body instanceof FormData, true);
  assert.equal(request.headers.Authorization, "Bearer test-key");
  assert.equal(request.body.get("size"), "1280x720");
  assert.equal(request.body.get("seconds"), "12");
  assert.equal(request.body.get("duration"), "12");
  assert.equal(request.body.get("input_reference") instanceof Blob, true);
});

test("video providers are classified and operation paths remain pollable", () => {
  const records = normalizeModelRecords([
    { id: "grok-imagine-video-1.5-preview", type: "model" },
    { id: "veo-3.1-generate-preview", type: "model" },
    { id: "veo3.1-fast", type: "model" },
  ]);
  assert.deepEqual(records.map(({ vendor, type, provider }) => [vendor, type, provider]), [
    ["xAI", "video", "xai"],
    ["Google", "video", "veo"],
    ["Google", "video", "veo"],
  ]);
  assert.deepEqual(records[0].capabilities, ["文生视频", "图生视频"]);
  assert.equal(extractJobId({ name: "models/veo/operations/op-123" }), "models/veo/operations/op-123");
  setTestSettings({
    baseUrl: "https://generativelanguage.googleapis.com",
    videoStatusEndpoint: "/v1/video/generations/{id}",
  });
  assert.equal(videoStatusEndpointForTask({ provider: "veo", requestEndpoint: "/v1beta/models/veo:predictLongRunning" }), "/v1beta/{id}");
  assert.equal(encodeVideoTaskId("models/veo/operations/op-123", { provider: "veo" }), "models/veo/operations/op-123");
});

test("persisted Veo selections survive state normalization", () => {
  const normalized = normalizeState({ settings: { videoModel: "veo-3.1" } });
  assert.equal(normalized.settings.videoModel, "veo-3.1");
});

test("official Grok JSON endpoint survives state normalization", () => {
  const normalized = normalizeState({ settings: { videoEndpoint: "/v1/videos/generations" } });
  assert.equal(normalized.settings.videoEndpoint, "/v1/videos/generations");
});
