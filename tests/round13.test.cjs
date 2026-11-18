const assert = require("node:assert/strict");
const test = require("node:test");

global.localStorage = { getItem() { return null; }, setItem() {} };
global.document = { addEventListener() {}, createElement: () => ({}) };

const app = require("../app.js");

const html = (options, key = "k", current = "", config = {}) => {
  const box = { innerHTML: "" };
  app.renderOptionGroup(box, key, options, current, config);
  return box.innerHTML;
};

test("#1 auto title is the first prompt cut to ~20 chars; custom titles are kept", () => {
  assert.equal(app.summarizeTitle("  一只  在雨中\n奔跑的橘猫  "), "一只 在雨中 奔跑的橘猫");
  const long = "一二三四五六七八九十一二三四五六七八九十多出来的部分";
  assert.equal(app.summarizeTitle(long), "一二三四五六七八九十一二三四五六七八九十…");
  assert.equal(app.summarizeTitle("   ", "新的视觉创作"), "新的视觉创作");

  app.setTestSettings({ visualMode: "image" });
  const visual = { id: "v", title: "新的视觉创作" };
  app.updateVisualSession(visual, long);
  assert.equal(visual.title, `${long.slice(0, 20)}…`);
  app.updateVisualSession(visual, "另一条提示词");
  assert.equal(visual.title, `${long.slice(0, 20)}…`, "title is set once");
  const renamed = { id: "v2", title: "我的作品集" };
  app.updateVisualSession(renamed, "xx");
  assert.equal(renamed.title, "我的作品集");

  const chat = { id: "c", title: "新的会话", messages: [{ role: "user", content: long }] };
  app.updateSession(chat);
  assert.equal(chat.title, `${long.slice(0, 20)}…`);
});

test("#1 record search matches the title and prompts inside the session", () => {
  const tasks = [{ sessionId: "s", prompt: "Sunset over the sea" }];
  const visual = { id: "s", title: "无关标题" };
  assert.ok(app.sessionMatchesQuery(visual, "sunset", true, tasks));
  assert.ok(app.sessionMatchesQuery(visual, "无关", true, tasks));
  assert.ok(!app.sessionMatchesQuery(visual, "mountain", true, tasks));
  assert.ok(app.sessionMatchesQuery(visual, "", true, tasks));
  const chat = { id: "c", title: "t", messages: [{ role: "user", content: "How to bake bread" }] };
  assert.ok(app.sessionMatchesQuery(chat, "BAKE", false));
  assert.ok(!app.sessionMatchesQuery(chat, "pizza", false));
});

test("#2 transparent background greys out JPEG; the user's format is never changed", () => {
  app.setTestSettings({ imageModel: "gpt-image-2", imageBackground: "transparent", imageOutputFormat: "jpeg" });
  const formats = app.gptImageFormatOptions();
  const jpeg = formats.find((option) => option.value === "jpeg");
  assert.match(jpeg.disabledReason, /透明背景不支持 JPEG/);
  assert.equal(formats.find((option) => option.value === "png").disabledReason, undefined);
  assert.equal(formats.find((option) => option.value === "webp").disabledReason, undefined);
  // UI state is untouched; the request layer keeps its safety net (unchanged behaviour)
  assert.equal(app.gptImageOutputFormatValue(), "png");
  const rendered = html(formats, "imageOutputFormat", "png");
  assert.match(rendered, /data-value="jpeg"[^>]*>|is-disabled/);
  assert.match(rendered, /is-disabled" aria-disabled="true" data-disabled-reason="透明背景不支持 JPEG/);
});

test("#2 with JPEG chosen, 透明 is the greyed option and nothing is auto-switched", () => {
  app.setTestSettings({ imageModel: "gpt-image-2", imageBackground: "auto", imageOutputFormat: "jpeg" });
  const backgrounds = app.gptImageBackgroundOptions();
  assert.match(backgrounds.find((option) => option.value === "transparent").disabledReason, /JPEG 不支持透明背景/);
  assert.equal(backgrounds.find((option) => option.value === "opaque").disabledReason, undefined);
  assert.equal(app.gptImageOutputFormatValue(), "jpeg");
  const free = app.gptImageFormatOptions();
  assert.ok(free.every((option) => !option.disabledReason));
});

test("#2 disabled options stay in the DOM (no native disabled) so a click can explain why", () => {
  const out = html([{ value: "1", label: "1" }, { value: "2", label: "2" }], "imageCount", "1", {
    disabled: true,
    disabledReason: "DALL-E 3 每次仅生成 1 张",
  });
  assert.equal((out.match(/data-disabled-reason="DALL-E 3 每次仅生成 1 张"/g) || []).length, 2);
  assert.doesNotMatch(out, /\sdisabled[\s>]/);
});

test("#9 resolution labels carry the real pixel size for the chosen ratio", () => {
  assert.equal(app.imageTierPixelSize("2K", "16:9"), "2048×1152");
  assert.equal(app.imageTierPixelSize("1K", "1:1"), "1024×1024");
  assert.equal(app.imageTierPixelSize("2K", "9:16"), "1152×2048");
  assert.equal(app.imageTierPixelSize("4K", "16:9"), "4096×2304");
  assert.equal(app.imageTierPixelSize("2K", "adaptive"), "");
  assert.equal(app.videoTierPixelSize("720p", "16:9"), "1280×720");
  assert.equal(app.videoTierPixelSize("1080p", "9:16"), "1080×1920");
  assert.equal(app.videoTierPixelSize("720p", "1:1"), "720×720");
  assert.equal(app.videoTierPixelSize("4k", "16:9"), "3840×2160");

  app.setTestSettings({ imageModel: "doubao-seedream-4-0-250828", imageAspectRatio: "16:9" });
  const tiers = app.imageSizeOptionsWithDims();
  assert.equal(tiers.find((option) => option.value === "2K").sub, "2048×1152");
  app.setTestSettings({ imageModel: "doubao-seedream-4-0-250828", imageAspectRatio: "1:1" });
  assert.equal(app.imageSizeOptionsWithDims().find((option) => option.value === "2K").sub, "2048×2048");
  assert.match(html(app.imageSizeOptionsWithDims(), "imageSize", "2K", { tiered: true }), /pill-sub">2048×2048/);
});

test("#9 'auto' shows its real size; a ratio/size contradiction is called out", () => {
  app.setTestSettings({ imageModel: "gpt-image-2", imageAspectRatio: "16:9", imageSize: "auto" });
  assert.equal(app.imageSizeOptionsWithDims().find((option) => option.value === "auto").sub, "1792×1024");
  assert.equal(app.imageSizeRatioMismatchHint(), "");
  app.setTestSettings({ imageModel: "gpt-image-2", imageAspectRatio: "16:9", imageSize: "1024x1024" });
  assert.match(app.imageSizeRatioMismatchHint(), /1024×1024.*16:9/);
  app.setTestSettings({ imageModel: "gpt-image-2", imageAspectRatio: "1:1", imageSize: "1024x1024" });
  assert.equal(app.imageSizeRatioMismatchHint(), "");

  app.setTestSettings({ videoModel: "doubao-seedance-2-0-260128", videoAspectRatio: "9:16" });
  const video = app.videoResolutionOptionsWithDims();
  assert.equal(video.find((option) => option.value === "720p").sub, "720×1280");
});

test("#9 duration slider shows ticks for the model's real steps", () => {
  assert.deepEqual(app.durationTickIndexes(1), [0]);
  assert.deepEqual(app.durationTickIndexes(4), [0, 1, 2, 3]);
  const many = app.durationTickIndexes(28);
  assert.equal(many[0], 0);
  assert.equal(many.at(-1), 27);
  assert.ok(many.length <= 7);

  const box = { innerHTML: "", title: "" };
  app.renderDurationSlider(box, "videoDuration", [
    { value: "-1", label: "自动" },
    { value: "5", label: "5s" },
    { value: "10", label: "10s" },
    { value: "15", label: "15s" },
  ], "5");
  ["自动", "5s", "10s", "15s"].forEach((label) => assert.ok(box.innerHTML.includes(`>${label}</span>`), label));
  assert.match(box.innerHTML, /duration-tick is-current"[^>]*>5s/);

  const fixed = { innerHTML: "", title: "" };
  app.renderDurationSlider(fixed, "videoDuration", [{ value: "8", label: "8s" }], "8");
  assert.doesNotMatch(fixed.innerHTML, /duration-tick"/);
  assert.match(fixed.innerHTML, /disabled/);
});

// r19: updated from "lists every setting" — Ryan decided the bottom button shows
// only the main items. Full options remain inside the settings panel.
test("#6 summary shows only main items (r19: image ratio/size/count, video ratio/res/duration/count)", () => {
  app.setTestSettings({ visualMode: "image", imageModel: "gpt-image-2", imageQuality: "high", imageBackground: "transparent", imageOutputFormat: "webp", imageCount: 3, imageAspectRatio: "1:1", imageSize: "auto" });
  const image = app.settingsSummaryParts().join(" · ");
  assert.match(image, /1:1/);
  assert.match(image, /3 张/);
  assert.doesNotMatch(image, /质量|背景|WEBP/);

  app.setTestSettings({ visualMode: "video", videoModel: "doubao-seedance-2-0-260128", videoStyle: "cinematic", videoAudio: false, videoCount: 2, videoDuration: 8 });
  const video = app.settingsSummaryParts().join(" · ");
  assert.match(video, /2 条/);
  assert.match(video, /8s/);
  assert.doesNotMatch(video, /风格|静音|有声|音频/);
});

test("r20 video summary shows only the resolution tier name, no pixel size", () => {
  app.setTestSettings({ visualMode: "video", videoModel: "doubao-seedance-2-0-260128", videoAspectRatio: "16:9", videoResolution: "720p", videoDuration: 5, videoCount: 1 });
  assert.equal(app.settingsSummaryParts().join(" · "), "16:9 · 720p · 5s · 1 条");
  // panel options keep their pixel sub text
  assert.ok(app.videoResolutionOptionsWithDims().some((option) => option.value === "720p" && option.sub));
});

test("r19 summary text is forced to a single line with ellipsis", () => {
  const css = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "styles.css"), "utf8");
  const block = css.slice(css.indexOf("r19: settings summary is always a single line"));
  assert.match(block, /white-space: nowrap;/);
  assert.match(block, /text-overflow: ellipsis;/);
  assert.match(block, /word-break: keep-all;/);
  // no later rule re-enables wrapping on the summary value
  assert.doesNotMatch(block, /white-space: normal/);
});

test("#7 record rows know their first thumbnail and work-type badge", () => {
  const session = { id: "s" };
  const png = "data:image/png;base64,AAAA";
  const tasks = [
    { sessionId: "s", type: "video", createdAt: 1, media: ["https://x/a.mp4"] },
    { sessionId: "s", type: "image", createdAt: 2, media: [png] },
    { sessionId: "other", type: "image", createdAt: 0, media: ["data:image/png;base64,ZZ"] },
  ];
  const mixed = app.visualSessionPreview(session, tasks);
  assert.deepEqual([mixed.badge, mixed.thumbSrc, mixed.count], ["混合", png, 2]);
  assert.equal(app.visualSessionPreview(session, [tasks[0]]).badge, "视频");
  assert.equal(app.visualSessionPreview(session, [tasks[0]]).thumbSrc, "");
  assert.equal(app.visualSessionPreview(session, [tasks[1]]).badge, "图片");
  const empty = app.visualSessionPreview(session, []);
  assert.deepEqual([empty.badge, empty.thumbSrc, empty.count], ["", "", 0]);
});

test("#11 (r16) queue is flat: no batch dividers, batches ignored", () => {
  assert.deepEqual(app.buildQueueGroups([{ id: 1, createdAt: 10 }, { id: 2, createdAt: 120 }]).map((t) => t.id), [2, 1]);
  assert.equal(app.buildQueueGroups([]).length, 0);
});

test("#12 model chips prefer the display name and keep the id for the tooltip", () => {
  app.setTestModelRecords([{ id: "gpt-x-0613", label: "GPT X", type: "chat" }, { id: "plain", label: "plain", type: "chat" }]);
  assert.equal(app.modelDisplayName("gpt-x-0613"), "GPT X");
  assert.equal(app.modelFullName("gpt-x-0613"), "GPT X（gpt-x-0613）");
  assert.equal(app.modelDisplayName("plain"), "plain");
  assert.equal(app.modelFullName("plain"), "plain");
  assert.equal(app.modelDisplayName(""), "");
  app.setTestModelRecords([]);
});

test("#5 one connection vocabulary", () => {
  assert.deepEqual(
    [app.CONNECTION_LABELS.missing, app.CONNECTION_LABELS.untested, app.CONNECTION_LABELS.error, app.CONNECTION_LABELS.ok],
    ["未配置密钥", "未测试", "连接失败", "已连接"]
  );
  app.setTestSettings({ baseUrl: "https://api.example.com", apiKey: "" });
  assert.equal(app.currentConnectionStatus(), "missing");
  app.setTestSettings({ baseUrl: "https://api.example.com", apiKey: "sk-1" });
  assert.equal(app.currentConnectionStatus(), "untested");
  app.setConnection("ok", "fine");
  assert.equal(app.currentConnectionStatus(), "ok");
  app.setConnection("error", "boom");
  assert.equal(app.currentConnectionStatus(), "error");
  app.setTestSettings({ baseUrl: "https://api.example.com", apiKey: "sk-2" });
  assert.equal(app.currentConnectionStatus(), "untested", "a result belongs to the credentials it was measured with");
  app.setConnection("testing");
  assert.equal(app.currentConnectionStatus(), "testing");
});

test("#13 chat and visual drafts are isolated per mode and per session", () => {
  app.els.promptInput = { value: "", style: {}, scrollHeight: 0 };
  app.setTestMode("chat", "c1", "v1");
  app.syncPromptDraft();
  app.els.promptInput.value = "聊天草稿";
  app.setTestMode("image", "c1", "v1");
  app.syncPromptDraft();
  assert.equal(app.els.promptInput.value, "", "visual box does not inherit the chat draft");
  app.els.promptInput.value = "视觉草稿";
  app.setTestMode("chat", "c1", "v1");
  app.syncPromptDraft();
  assert.equal(app.els.promptInput.value, "聊天草稿");
  app.setTestMode("chat", "c2", "v1");
  app.syncPromptDraft();
  assert.equal(app.els.promptInput.value, "", "another chat session starts empty");
  app.setTestMode("image", "c2", "v1");
  app.syncPromptDraft();
  assert.equal(app.els.promptInput.value, "视觉草稿");
});
