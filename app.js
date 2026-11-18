const STORAGE_KEY = "yhshu_online_client_state_v1";
const EXPORT_VERSION = 2;
const DEFAULT_API_BASE_URL = "https://www.deeprouter.top";
const LEGACY_DEFAULT_API_BASE_URLS = new Set(["https://www.yhshu.ai"]);
const LINKMESH_API_HOSTS = new Set(["ai.linkmesh.org", "api.linkmesh.org", "www.linkmesh.org", "linkmesh.org"]);
const DEEPLINK_API_HOSTS = new Set(["www.deeplink.cv", "deeplink.cv"]);
const DEEPLINK_PROXY_PREFIX = "/__deeplink";
const LINKMESH_PROXY_PREFIX = "/__linkmesh";
const LINKMESH_API_PROXY_PREFIX = "/__linkmesh-api";
const LINKMESH_WWW_PROXY_PREFIX = "/__linkmesh-www";
const DEEPROUTER_API_HOST = "deeprouter.top";
const DEEPROUTER_PROXY_PREFIX = "/__deeprouter";
const MEDIA_CACHE_DB_NAME = "yhshu_visual_media_cache";
const MEDIA_CACHE_STORE = "visual_media";
const MEDIA_CACHE_VERSION = 1;

const MODEL_CATALOG = [
  {
    id: "gpt-image-2.6-sunburst",
    label: "GPT Image 2.6 Sunburst",
    vendor: "OpenAI",
    type: "image",
    provider: "openai",
    capabilities: ["文生图", "图生图", "高质量"],
    description: "OpenAI 最新图片模型，按 size、quality、background、output_format 映射。",
  },
  {
    id: "gpt-image-2.6-flare",
    label: "GPT Image 2.6 Flare",
    vendor: "OpenAI",
    type: "image",
    provider: "openai",
    capabilities: ["文生图", "图生图", "高质量"],
    description: "OpenAI 最新图片模型，按 size、quality、background、output_format 映射。",
  },
  {
    id: "gpt-image-2.5-sunburst",
    label: "GPT Image 2.5 Sunburst",
    vendor: "OpenAI",
    type: "image",
    provider: "openai",
    capabilities: ["文生图", "图生图", "高质量"],
    description: "OpenAI 图片模型，quality 额外支持 xhigh、max。",
  },
  {
    id: "gpt-image-2.5-flare",
    label: "GPT Image 2.5 Flare",
    vendor: "OpenAI",
    type: "image",
    provider: "openai",
    capabilities: ["文生图", "图生图", "高质量"],
    description: "OpenAI 图片模型，quality 额外支持 xhigh、max。",
  },
  {
    id: "gpt-image-2",
    label: "GPT Image 2",
    vendor: "OpenAI",
    type: "image",
    provider: "openai",
    capabilities: ["文生图", "图生图", "高质量"],
    description: "OpenAI 图片模型，按 size、quality、background、output_format 映射。",
  },
  {
    id: "gpt-image-1.5",
    label: "GPT Image 1.5",
    vendor: "OpenAI",
    type: "image",
    provider: "openai",
    capabilities: ["文生图", "图生图"],
    description: "OpenAI 图片模型，size 使用官方标准三档与 auto。",
  },
  {
    id: "dall-e-3",
    label: "DALL-E 3",
    vendor: "OpenAI",
    type: "image",
    provider: "openai",
    capabilities: ["文生图"],
    description: "兼容 vivid/natural 和 standard/hd 参数。",
  },
  {
    id: "gemini-2.5-flash-image-preview",
    label: "Gemini 2.5 Flash Image",
    vendor: "Gemini",
    type: "image",
    provider: "gemini",
    capabilities: ["文生图", "图生图", "参考图"],
    description: "Gemini 图片模型，优先使用比例、分辨率和多模态输入参数。",
  },
  {
    id: "gemini-2.0-flash-preview-image-generation",
    label: "Gemini 2.0 Flash Image",
    vendor: "Gemini",
    type: "image",
    provider: "gemini",
    capabilities: ["文生图", "图生图"],
    description: "Gemini 旧版图片预览模型。",
  },
  {
    id: "seedream-4.0",
    label: "Seedream 4.0",
    vendor: "Doubao",
    type: "image",
    provider: "seed",
    capabilities: ["文生图", "图生图", "组图"],
    description: "Seedream/豆包图片模型，使用 1K/2K/4K 档位、水印与组图参数。",
  },
  {
    id: "nano-banana-2.1",
    label: "Nano Banana 2.1",
    vendor: "Gemini",
    type: "image",
    provider: "gemini",
    capabilities: ["文生图", "图生图", "参考图"],
    description: "Gemini 图片模型，使用官方比例集与 1K/2K/4K 分辨率档位。",
  },
  {
    id: "grok-2-image",
    label: "Grok Image",
    vendor: "xAI",
    type: "image",
    provider: "xai",
    capabilities: ["文生图"],
    description: "xAI 图片模型预设。",
  },
  {
    id: "doubao-seedance-2-0-260128",
    label: "Seedance 2.0",
    vendor: "Doubao",
    type: "video",
    provider: "seedance",
    capabilities: ["文生视频", "图生视频", "首尾帧", "参考视频", "音频"],
    description: "Seedance 2.0 全量版，支持 480p/720p/1080p/4K 与 4-15 秒时长。",
  },
  {
    id: "doubao-seedance-2-0-fast-260128",
    label: "Seedance 2.0 Fast",
    vendor: "Doubao",
    type: "video",
    provider: "seedance",
    capabilities: ["文生视频", "图生视频", "首尾帧"],
    description: "Seedance 2.0 快速版，支持 480p/720p 与 4-15 秒时长。",
  },
  {
    id: "doubao-seedance-2-0-mini-260615",
    label: "Seedance 2.0 Mini",
    vendor: "Doubao",
    type: "video",
    provider: "seedance",
    capabilities: ["文生视频", "图生视频", "首尾帧"],
    description: "Seedance 2.0 轻量版，支持 480p/720p 与 4-15 秒时长。",
  },
  {
    id: "doubao-seedance-2-5-260628",
    label: "Seedance 2.5",
    vendor: "Doubao",
    type: "video",
    provider: "seedance",
    capabilities: ["文生视频", "图生视频", "首尾帧", "参考视频", "音频"],
    description: "Seedance 2.5，支持 480p/720p/1080p 与 4-30 秒时长。",
  },
  {
    id: "seedance-1.0-pro",
    label: "SeedDance Pro",
    vendor: "Doubao",
    type: "video",
    provider: "seedance",
    capabilities: ["文生视频", "首尾帧", "参考视频"],
    description: "SeedDance 视频模型，适配 duration、resolution、aspect_ratio。",
  },
  {
    id: "seedance-1.0-lite",
    label: "SeedDance Lite",
    vendor: "Doubao",
    type: "video",
    provider: "seedance",
    capabilities: ["文生视频", "图生视频"],
    description: "SeedDance 轻量视频预设。",
  },
  {
    id: "grok-video",
    label: "Grok Video",
    vendor: "xAI",
    type: "video",
    provider: "xai",
    capabilities: ["文生视频", "图生视频"],
    description: "Grok 视频生成预设。",
  },
  {
    id: "grok-imagine-video-1.5-preview",
    label: "Grok Imagine Video 1.5 Preview",
    vendor: "xAI",
    type: "video",
    provider: "xai",
    capabilities: ["文生视频", "图生视频"],
    description: "支持纯文本生成视频，也可上传一张参考图进行图生视频。",
  },
  {
    id: "veo-3.1",
    label: "Veo 3.1",
    vendor: "Google",
    type: "video",
    provider: "veo",
    capabilities: ["文生视频", "图生视频", "音频"],
    description: "Google Veo 视频模型，支持时长、比例和音频开关。",
  },
  {
    id: "veo-3.1-fast",
    label: "Veo 3.1 Fast",
    vendor: "Google",
    type: "video",
    provider: "veo",
    capabilities: ["快速视频", "图生视频"],
    description: "Veo 快速生成预设。",
  },
  {
    id: "veo-2",
    label: "Veo 2",
    vendor: "Google",
    type: "video",
    provider: "veo",
    capabilities: ["文生视频", "图生视频"],
    description: "Veo 2 兼容预设。",
  },
];

const IMAGE_ASPECT_OPTIONS = [
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "21:9", label: "21:9" },
];

const IMAGE_SIZE_OPTIONS = [
  { value: "auto", label: "自动" },
  { value: "1024x1024", label: "1024²" },
  { value: "1536x1024", label: "1536×1024" },
  { value: "1024x1536", label: "1024×1536" },
  { value: "1792x1024", label: "1792×1024" },
  { value: "1024x1792", label: "1024×1792" },
];

const IMAGE_QUALITY_OPTIONS = [
  { value: "auto", label: "自动" },
  { value: "standard", label: "标准" },
  { value: "hd", label: "高清" },
  { value: "low", label: "低" },
  { value: "medium", label: "中" },
  { value: "high", label: "高" },
];

const IMAGE_STYLE_OPTIONS = [
  { value: "auto", label: "自动" },
  { value: "natural", label: "自然" },
  { value: "vivid", label: "鲜艳" },
  { value: "cinematic", label: "电影感" },
  { value: "illustration", label: "插画" },
  { value: "photorealistic", label: "写实" },
];

const GPT_IMAGE_BACKGROUND_OPTIONS = [
  { value: "auto", label: "自动" },
  { value: "opaque", label: "不透明" },
  { value: "transparent", label: "透明" },
];

const GPT_IMAGE_FORMAT_OPTIONS = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
];

const GPT_IMAGE_QUALITY_LABELS = {
  auto: "自动",
  low: "低",
  medium: "中",
  high: "高",
  xhigh: "超高",
  max: "最高",
};

const SEEDREAM_SIZE_OPTIONS = [
  { value: "1K", label: "1K" },
  { value: "2K", label: "2K" },
  { value: "4K", label: "4K" },
];

const MUSE_VIDEO_ASPECT_OPTIONS = ["16:9", "9:16", "1:1"];
const MUSE_VIDEO_RESOLUTION_OPTIONS = ["720p", "1080p"];
const MUSE_VIDEO_DURATION_OPTIONS = [5, 10];

const VIDEO_ASPECT_OPTIONS = [
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
  { value: "21:9", label: "21:9" },
];

const VIDEO_RESOLUTION_OPTIONS = [
  { value: "480p", label: "480p" },
  { value: "720p", label: "720p" },
  { value: "1080p", label: "1080p" },
  { value: "2k", label: "2K" },
  { value: "4k", label: "4K" },
];

const VIDEO_DURATION_OPTIONS = [
  { value: "4", label: "4s" },
  { value: "5", label: "5s" },
  { value: "8", label: "8s" },
  { value: "10", label: "10s" },
];

const GROK_VIDEO_DURATIONS = Array.from({ length: 15 }, (_, index) => index + 1);
const MISSING_VIDEO_TASK_RETRY_LIMIT = 12;
const VIDEO_TASK_POLL_ATTEMPTS = 720;

const VIDEO_STYLE_OPTIONS = [
  { value: "cinematic", label: "电影" },
  { value: "realistic", label: "写实" },
  { value: "animation", label: "动画" },
  { value: "commercial", label: "广告" },
  { value: "documentary", label: "纪实" },
  { value: "auto", label: "自动" },
];

const DEFAULT_SETTINGS = {
  baseUrl: DEFAULT_API_BASE_URL,
  apiKey: "",
  chatModel: "gpt-4o-mini",
  imageModel: "gpt-image-2",
  videoModel: "doubao-seedance-2-0-260128",
  temperature: 0.7,
  contextTurns: 10,
  visualMode: "image",
  imageMode: "text-to-image",
  imageAspectRatio: "1:1",
  imageSize: "1024x1024",
  imageQuality: "medium",
  imageStyle: "auto",
  imageBackground: "auto",
  imageOutputFormat: "png",
  imageWatermark: false,
  imageSequential: false,
  imageCount: 1,
  imageApiStyle: "auto",
  imageEndpoint: "/v1/images/generations",
  imageEditEndpoint: "/v1/images/edits",
  videoAspectRatio: "16:9",
  videoResolution: "720p",
  videoDuration: 5,
  videoCount: 1,
  videoStyle: "cinematic",
  videoAudio: true,
  videoApiStyle: "auto",
  videoEndpoint: "/v1/video/generations",
  videoStatusEndpoint: "/v1/video/generations/{id}",
  visualContext: true,
  visualContextTurns: 4,
  chatWeb: false,
  stream: true,
  thinking: false,
  systemPrompt: "你是一个专业的 AI 创作助手。",
};

const els = {};
let state = loadState();
let activeMode = state.activeMode || "image";
let activeSessionId = state.activeSessionId || null;
let activeVisualSessionId = state.activeVisualSessionId || null;
let abortController = null;
const activeImageRequests = new Map();
let toastTimer = null;
let deleteArmed = null;
let draftMedia = createEmptyDraftMedia();
let viewerZoom = 1;
let modelPopoverType = "chat";
let modelPopoverOpen = false;
let settingsPopoverOpen = false;
let chatAttachments = [];
let settingsFormSnapshot = "";
let activeSettingsTab = "api";
const activeVideoPolls = new Set();
const desiredMediaCacheWrites = new Map();
const activeMediaCacheWrites = new Set();
const mediaCacheWritePromises = new Map();
const cachedMediaObjectUrls = new Map();
let mediaCacheDatabasePromise = null;

function $(id) {
  return document.getElementById(id);
}

function initElements() {
  [
    "workspace",
    "sidebar",
    "menuImageMode",
    "menuVideoMode",
    "menuChatMode",
    "connectionStatus",
    "sidebarModelSettings",
    "sidebarModelName",
    "collapseSidebar",
    "sessionBrowser",
    "sidebarRecords",
    "sessionMountSidebar",
    "sessionSearch",
    "sessionList",
    "openSettingsSide",
    "mobileMenu",
    "closeSettings",
    "chatPanel",
    "imagePanel",
    "emptyChat",
    "messages",
    "composerTitle",
    "composerTitleRow",
    "newSessionBtn",
    "menuNewChat",
    "menuNewCreation",
    "sidebarRecordsTitle",
    "sidebarRecordsCount",
    "chatJumpList",
    "chatJumpCount",
    "chatJumpEmpty",
    "settingsPopoverTitle",
    "settingsPopoverSub",
    "visualPanelTitle",
    "visualCanvas",
    "visualEmptyText",
    "imageEmpty",
    "imageGrid",
    "clearImages",
    "queueWaitingCount",
    "queueRunningCount",
    "imageHistory",
    "composer",
    "referencePanel",
    "referenceCount",
    "referenceSlotHint",
    "chatToolbar",
    "chatWebToggle",
    "uploadChatFileButton",
    "chatAttachmentTray",
    "visualToolbar",
    "visualContextToggle",
    "draftMediaTray",
    "visualSettingsCard",
    "imageOutputSettings",
    "videoOutputSettings",
    "imageAspectGroup",
    "imageSizeGroup",
    "imageQualityGroup",
    "imageStyleGroup",
    "imageBackgroundGroup",
    "imageFormatGroup",
    "imageWatermarkGroup",
    "imageSequentialGroup",
    "imageCountGroup",
    "videoAspectGroup",
    "videoResolutionGroup",
    "videoDurationGroup",
    "videoCountGroup",
    "videoStyleGroup",
    "videoAudioGroup",
    "settingsSummaryBlock",
    "settingsSummaryLabel",
    "settingsSummaryText",
    "uploadImageRefButton",
    "uploadFirstFrameButton",
    "uploadLastFrameButton",
    "uploadVideoRefButton",
    "uploadAudioButton",
    "promptInput",
    "streamToggle",
    "thinkingToggle",
    "quickModel",
    "quickModelButton",
    "quickModelVendor",
    "quickModelLabel",
    "modelPopover",
    "modelPopoverList",
    "stopButton",
    "sendButton",
    "overlay",
    "settingsDialog",
    "connectionState",
    "connectionDetail",
    "baseUrl",
    "apiKey",
    "toggleApiKey",
    "copyApiKey",
    "chatModel",
    "imageModel",
    "videoModel",
    "temperature",
    "contextTurns",
    "visualContextTurns",
    "imageApiStyle",
    "videoApiStyle",
    "imageEndpoint",
    "imageEditEndpoint",
    "videoEndpoint",
    "videoStatusEndpoint",
    "systemPrompt",
    "saveSettings",
    "testConnection",
    "reloadModels",
    "exportData",
    "importData",
    "clearAll",
    "unsavedSettingsPrompt",
    "cancelSettingsClose",
    "discardSettingsClose",
    "saveSettingsClose",
    "importFile",
    "imageReferenceFiles",
    "videoReferenceFiles",
    "firstFrameFile",
    "lastFrameFile",
    "audioReferenceFile",
    "chatAttachmentFiles",
    "mediaViewer",
    "viewerTitle",
    "viewerZoomLabel",
    "viewerZoomOut",
    "viewerZoomIn",
    "viewerFit",
    "viewerDownload",
    "closeMediaViewer",
    "viewerStage",
    "viewerImage",
    "viewerVideo",
    "modelOptions",
    "toast",
  ].forEach((id) => {
    els[id] = $(id);
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return createInitialState();
  }
}

function linkedSettingsKeyOf(entry) {
  if (!entry || typeof entry !== "object") return "";
  return String(entry.key || entry.apiKey || entry.api_key || entry.token || "").trim();
}

function linkedSettingsUrlOf(entry) {
  if (!entry || typeof entry !== "object") return "";
  return decodeLinkedNewApiUrl(entry.url || entry.address || entry.baseUrl || entry.base_url || entry.server);
}

function resolveLinkedSettings(parsed) {
  if (!parsed || typeof parsed !== "object") return null;
  const containers = [parsed, parsed.settings, parsed.data].filter(
    (item) => item && typeof item === "object" && !Array.isArray(item)
  );
  for (const container of containers) {
    const candidates = [];
    const collect = (entry) => {
      const key = linkedSettingsKeyOf(entry);
      if (key) candidates.push({ key, group: String(entry?.group || "").trim().toLowerCase() });
    };
    [container.keys, container.tokens].forEach((list) => {
      if (Array.isArray(list)) list.forEach(collect);
    });
    collect(container);
    const ownGroup = String(container.group || "").trim().toLowerCase();
    const preferred = candidates.find((candidate) => candidate.group === "default")
      || (ownGroup === "default" ? candidates[0] : null)
      || candidates[0];
    const key = preferred?.key || "";
    const url = linkedSettingsUrlOf(container) || linkedSettingsUrlOf(parsed);
    if (key || url) return { key, url };
  }
  return null;
}

function parseLinkedDirectParams(query) {
  const params = new URLSearchParams(query);
  // In a Sub2API embed the "token" param is the user's login JWT, not an API
  // key; it is exchanged for a real key by applySub2ApiEmbedSettings instead.
  const isSub2ApiEmbed = params.get("ui_mode") === "embedded" || params.has("user_id");
  const key = String(
    params.get("api_key") || params.get("apiKey") || (isSub2ApiEmbed ? "" : params.get("token")) || ""
  ).trim();
  const url = decodeLinkedNewApiUrl(
    params.get("base_url") || params.get("baseUrl") || params.get("url") || params.get("address") || params.get("server") || ""
  );
  return key || url ? { key, url } : null;
}

function parseLinkedNewApiSettings(locationLike) {
  const sources = [locationLike?.hash, locationLike?.search].filter(Boolean);
  for (const source of sources) {
    const query = String(source).slice(String(source).indexOf("?") + 1).replace(/^#?\/?/, "");
    const marker = query.indexOf("settings=");
    if (marker >= 0) {
      const parameterValue = new URLSearchParams(query).get("settings");
      const rawValue = query.slice(marker + "settings=".length);
      const candidates = unique([rawValue, parameterValue]);
      for (const candidate of candidates) {
        const decoded = [candidate];
        try {
          decoded.push(decodeURIComponent(candidate));
        } catch {
          // The URLSearchParams value may already be decoded.
        }
        for (const value of unique(decoded)) {
          try {
            let parsed = JSON.parse(value);
            if (typeof parsed === "string") parsed = JSON.parse(parsed);
            const resolved = resolveLinkedSettings(parsed);
            if (resolved) return resolved;
          } catch {
            // Try the next decoding form.
          }
        }
      }
    }
    const direct = parseLinkedDirectParams(query);
    if (direct) return direct;
  }
  return null;
}

function decodeLinkedNewApiUrl(value) {
  let decoded = String(value || "").trim();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
}

function applyLinkedNewApiSettings() {
  const linked = parseLinkedNewApiSettings(window.location);
  if (!linked) return false;
  const key = linked.key && linked.key !== "{key}" ? linked.key : "";
  const url = linked.url && linked.url !== "{address}" && /^https?:\/\//i.test(linked.url)
    ? normalizeApiBaseUrl(linked.url)
    : "";
  if (key) state.settings.apiKey = key;
  if (url) state.settings.baseUrl = url;
  if (key || url) saveState();
  const cleanQuery = new URLSearchParams(window.location.search);
  cleanQuery.delete("settings");
  ["api_key", "apiKey", "token", "base_url", "baseUrl", "address", "server"].forEach((name) => cleanQuery.delete(name));
  const cleanSearch = cleanQuery.toString();
  window.history.replaceState(null, document.title, `${window.location.pathname}${cleanSearch ? `?${cleanSearch}` : ""}`);
  return Boolean(key || url);
}

const SUB2API_EMBED_PARAM_NAMES = ["token", "user_id", "ui_mode", "theme", "lang", "src_host", "src_url"];

function linkedQueryFromSource(source) {
  const text = String(source || "");
  return text.slice(text.indexOf("?") + 1).replace(/^#?\/?/, "");
}

function parseSub2ApiEmbedParams(locationLike) {
  const sources = [locationLike?.hash, locationLike?.search].filter(Boolean);
  for (const source of sources) {
    const params = new URLSearchParams(linkedQueryFromSource(source));
    const jwt = String(params.get("token") || "").trim();
    if (!jwt) continue;
    if (params.get("ui_mode") === "embedded" || params.has("user_id")) {
      let srcHost = "";
      try {
        const parsed = new URL(String(params.get("src_host") || "").trim());
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          srcHost = parsed.origin;
        }
      } catch {
        srcHost = "";
      }
      return { jwt, srcHost };
    }
  }
  return null;
}

function sub2ApiKeyItems(payload) {
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && typeof payload.data === "object" && Array.isArray(payload.data.items)) {
    return payload.data.items;
  }
  return [];
}

function selectSub2ApiKey(payload) {
  const active = sub2ApiKeyItems(payload).filter(
    (item) => item && item.status === "active" && String(item.key || "").trim()
  );
  if (!active.length) return null;
  const preferred =
    active.find((item) => String(item.group?.name || "").trim().toLowerCase() === "default") ||
    active.find((item) => item.group_id === null || item.group_id === undefined) ||
    active[0];
  return String(preferred.key).trim();
}

function stripSub2ApiEmbedParams(query) {
  const params = new URLSearchParams(query);
  SUB2API_EMBED_PARAM_NAMES.forEach((name) => params.delete(name));
  return params.toString();
}

function cleanSub2ApiEmbedParamsFromUrl() {
  const cleanSearch = stripSub2ApiEmbedParams(String(window.location.search || "").replace(/^\?/, ""));
  let cleanHash = String(window.location.hash || "");
  const hashQueryIndex = cleanHash.indexOf("?");
  if (hashQueryIndex >= 0) {
    const hashHead = cleanHash.slice(0, hashQueryIndex);
    const hashTail = stripSub2ApiEmbedParams(cleanHash.slice(hashQueryIndex + 1));
    cleanHash = hashTail ? `${hashHead}?${hashTail}` : hashHead;
  }
  window.history.replaceState(
    null,
    document.title,
    `${window.location.pathname}${cleanSearch ? `?${cleanSearch}` : ""}${cleanHash}`
  );
}

function sub2ApiSiteOrigin(srcHost) {
  try {
    if (document.referrer) {
      const referrer = new URL(document.referrer);
      if (referrer.protocol === "http:" || referrer.protocol === "https:") {
        return referrer.origin;
      }
    }
  } catch {
    // fall through to the src_host passthrough param
  }
  // Sub2API also appends src_host (the console origin) to embedded URLs;
  // it survives referrer stripping, so use it as the fallback source.
  return String(srcHost || "");
}

async function applySub2ApiEmbedSettings() {
  const embed = parseSub2ApiEmbedParams(window.location);
  if (!embed) return false;
  // Strip the passthrough params (including the JWT) from the address bar
  // first, whether the import below succeeds or not. The JWT is only used
  // for this one request: never stored, never logged.
  cleanSub2ApiEmbedParamsFromUrl();
  const origin = sub2ApiSiteOrigin(embed.srcHost);
  if (!origin) return false;
  let payload;
  try {
    const response = await fetch(`${origin}/api/v1/keys?page=1&page_size=100`, {
      headers: { Authorization: `Bearer ${embed.jwt}` },
    });
    if (!response || !response.ok) return false;
    payload = await response.json();
  } catch {
    // Network failures and CORS blocks silently fall back to manual setup.
    return false;
  }
  const key = selectSub2ApiKey(payload);
  if (!key) return false;
  state.settings.apiKey = key;
  state.settings.baseUrl = normalizeApiBaseUrl(origin);
  saveState();
  return true;
}

function createInitialState() {
  const id = generateId();
  const visualId = generateId();
  return {
    settings: { ...DEFAULT_SETTINGS },
    activeMode: "image",
    activeSessionId: id,
    activeVisualSessionId: visualId,
    sessions: [
      {
        id,
        title: "新的会话",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        pinned: false,
        messages: [],
      },
    ],
    visualSessions: [
      {
        id: visualId,
        title: "新的视觉创作",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        pinned: false,
        contextEnabled: true,
      },
    ],
    visualTasks: [],
    modelOptions: [DEFAULT_SETTINGS.chatModel, DEFAULT_SETTINGS.imageModel, DEFAULT_SETTINGS.videoModel],
    modelRecords: [],
  };
}

function normalizeState(input) {
  const initial = createInitialState();
  const settings = { ...DEFAULT_SETTINGS, ...(input.settings || {}) };
  settings.baseUrl = normalizeApiBaseUrl(settings.baseUrl);
  if (LEGACY_DEFAULT_API_BASE_URLS.has(settings.baseUrl)) {
    settings.baseUrl = DEFAULT_API_BASE_URL;
  }
  if (!input.settings?.videoModel) {
    settings.videoModel = DEFAULT_SETTINGS.videoModel;
  }
  if (!input.settings?.videoEndpoint) {
    settings.videoEndpoint = DEFAULT_SETTINGS.videoEndpoint;
  }
  if (!input.settings?.videoStatusEndpoint || input.settings.videoStatusEndpoint === "/v1/videos/{id}") {
    settings.videoStatusEndpoint = DEFAULT_SETTINGS.videoStatusEndpoint;
  }
  settings.videoCount = clampNumber(settings.videoCount, 1, 4, 1);
  if (input.settings?.imageSize && !input.settings?.imageAspectRatio) {
    settings.imageAspectRatio = aspectFromSize(input.settings.imageSize);
  }
  settings.imageQuality = normalizeImageQualityForModel(settings.imageModel, settings.imageQuality);
  settings.imageMode = "text-to-image";
  if (isHiddenModel(settings.chatModel)) settings.chatModel = DEFAULT_SETTINGS.chatModel;
  if (isHiddenModel(settings.imageModel)) settings.imageModel = DEFAULT_SETTINGS.imageModel;
  if (isHiddenModel(settings.videoModel)) settings.videoModel = DEFAULT_SETTINGS.videoModel;
  const sessions = Array.isArray(input.sessions) && input.sessions.length ? input.sessions : initial.sessions;
  const migratedImageTasks = Array.isArray(input.images)
    ? input.images.map((task) => ({
        ...task,
        type: "image",
        media: Array.isArray(task.images) ? task.images : [],
        params: {
          size: task.size || settings.imageSize,
        },
      }))
    : [];
  const unified = unifyVisualData(input, migratedImageTasks, settings);
  const visualSessions = unified.visualSessions;
  const activeVisualId = unified.activeVisualSessionId;
  const visualTasks = unified.visualTasks.map((task) => {
    const normalized = { ...task };
    if (normalized.persistedMediaOmitted && normalized.status === "done" && !(normalized.media || []).length) {
      normalized.status = "empty";
      normalized.error = "此图片由旧版本生成，当时未写入浏览器缓存，请重新生成。";
    }
    return normalized;
  });
  const modelRecords = normalizeModelRecords(input.modelRecords || []);
  const storedChat = modelRecords.find((model) => model.id === settings.chatModel);
  const storedImage = modelRecords.find((model) => model.id === settings.imageModel);
  const storedVideo = modelRecords.find((model) => model.id === settings.videoModel);
  if (storedChat && storedChat.type !== "chat") settings.chatModel = modelRecords.find((model) => model.type === "chat")?.id || DEFAULT_SETTINGS.chatModel;
  if (storedImage && storedImage.type !== "image") settings.imageModel = modelRecords.find((model) => model.type === "image")?.id || DEFAULT_SETTINGS.imageModel;
  if (storedVideo && storedVideo.type !== "video") settings.videoModel = modelRecords.find((model) => model.type === "video")?.id || DEFAULT_SETTINGS.videoModel;
  const persistedModelOptions = Array.isArray(input.modelOptions) ? input.modelOptions.filter((id) => !isHiddenModel(id)) : [];
  const legacyVisualKeys = ["videoSessions", "imageSessions", "videoTasks", "imageTasks", "activeVideoSessionId", "activeImageSessionId"];
  const carried = { ...input };
  legacyVisualKeys.forEach((key) => delete carried[key]);
  return {
    ...initial,
    ...carried,
    settings,
    sessions,
    activeMode: input.activeMode === "chat" ? "chat" : "image",
    activeSessionId: sessions.some((session) => session.id === input.activeSessionId)
      ? input.activeSessionId
      : mostRecentById(sessions),
    visualSessions,
    activeVisualSessionId: activeVisualId,
    unifiedVisualVersion: UNIFIED_VISUAL_VERSION,
    visualTasks,
    images: migratedImageTasks,
    modelRecords,
    modelOptions: unique([
      settings.chatModel,
      settings.imageModel,
      settings.videoModel,
      ...persistedModelOptions,
      ...modelRecords.map((model) => model.id),
    ]),
  };
}

// ---------------------------------------------------------------------------
// Round 9: unified visual sessions. One list holds sessions whose works may
// mix images and videos (every task carries its own `type`). Older stores
// that kept image/video sessions and tasks apart are merged here.
// ---------------------------------------------------------------------------
const UNIFIED_VISUAL_VERSION = 1;
const VIDEO_MEDIA_PATTERN = /(^data:video\/|\.(mp4|webm|mov|m4v)(\?|#|$))/i;

function mostRecentById(items) {
  let best = null;
  (items || []).forEach((item) => {
    if (!best || (item.updatedAt || 0) > (best.updatedAt || 0)) best = item;
  });
  return best ? best.id : null;
}

function inferVisualTaskType(task, hint = "") {
  if (task?.type === "image" || task?.type === "video") return task.type;
  if (hint === "image" || hint === "video") return hint;
  const media = Array.isArray(task?.media) ? task.media : [];
  if (media.some((item) => VIDEO_MEDIA_PATTERN.test(String(item || "")))) return "video";
  const profileType = task?.model ? getModelProfile(task.model)?.type : "";
  if (profileType === "video") return "video";
  if (profileType === "image") return "image";
  const params = task?.params || {};
  if (task?.jobId || params.duration || params.resolution || params.audio !== undefined) return "video";
  return "image";
}

function unifyVisualData(input, migratedImageTasks, settings) {
  const legacySources = [
    [input.visualSessions, ""],
    [input.imageSessions, "image"],
    [input.videoSessions, "video"],
  ];
  const sessionHints = new Map();
  const mergedSessions = [];
  legacySources.forEach(([list, hint]) => {
    if (!Array.isArray(list)) return;
    list.forEach((session) => {
      if (!session || !session.id || sessionHints.has(session.id)) return;
      sessionHints.set(session.id, hint);
      mergedSessions.push(session);
    });
  });
  const taskSources = [
    Array.isArray(input.visualTasks) ? input.visualTasks : migratedImageTasks,
    Array.isArray(input.imageTasks) ? input.imageTasks.map((task) => ({ ...task, type: task.type || "image" })) : [],
    Array.isArray(input.videoTasks) ? input.videoTasks.map((task) => ({ ...task, type: task.type || "video" })) : [],
  ];
  const seenTaskIds = new Set();
  const sourceTasks = [];
  taskSources.flat().forEach((task) => {
    if (!task || task.id === undefined || task.id === null) return;
    if (seenTaskIds.has(task.id)) return;
    seenTaskIds.add(task.id);
    sourceTasks.push(task);
  });

  const fallbackId = input.activeVisualSessionId || generateId();
  if (!mergedSessions.length) {
    mergedSessions.push({
      id: fallbackId,
      title: "视觉创作历史",
      createdAt: sourceTasks.at(-1)?.createdAt || Date.now(),
      updatedAt: sourceTasks[0]?.createdAt || Date.now(),
      pinned: false,
    });
  }
  const sessionIds = new Set(mergedSessions.map((session) => session.id));
  const preferredActive = [
    input.activeVisualSessionId,
    settings.visualMode === "video" ? input.activeVideoSessionId : input.activeImageSessionId,
    input.activeImageSessionId,
    input.activeVideoSessionId,
  ].find((id) => id && sessionIds.has(id));
  const activeId = preferredActive || mostRecentById(mergedSessions);

  const visualTasks = sourceTasks.map((task) => {
    const sessionId = task.sessionId && sessionIds.has(task.sessionId) ? task.sessionId : activeId;
    return { ...task, sessionId, type: inferVisualTaskType(task, sessionHints.get(sessionId) || "") };
  });

  const visualSessions = mergedSessions
    .map((session) => {
      const own = visualTasks
        .filter((task) => task.sessionId === session.id)
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      const lastType = ["image", "video"].includes(session.lastVisualMode)
        ? session.lastVisualMode
        : own[0]?.type || sessionHints.get(session.id) || settings.visualMode || "image";
      return {
        ...session,
        contextEnabled: session.contextEnabled ?? settings.visualContext,
        lastVisualMode: lastType === "video" ? "video" : "image",
        queueBatches: Array.isArray(session.queueBatches) ? session.queueBatches : [],
      };
    })
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return { visualSessions, visualTasks, activeVisualSessionId: activeId };
}

function saveState() {
  state.activeMode = activeMode;
  state.activeSessionId = activeSessionId;
  state.activeVisualSessionId = activeVisualSessionId;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistableState()));
  } catch (error) {
    console.warn("Unable to persist client state", error);
  }
  scheduleVisualMediaCache();
}

function persistableState() {
  const persistedTasks = state.visualTasks.map((task) => {
    const sourceMedia = task.media || [];
    const usesMediaCache = task.type === "image" || sourceMedia.some((item) => isInlineMedia(item) || isMediaCacheReference(item));
    if (!usesMediaCache) return { ...task, media: sourceMedia };
    const mediaCacheKeys = sourceMedia.map((_, index) => task.mediaCacheKeys?.[index] || visualMediaCacheKey(task.id, index));
    const media = sourceMedia.map((item, index) => {
      if (isMediaCacheReference(item)) return item;
      return isInlineMedia(item) ? mediaCacheReference(mediaCacheKeys[index]) : item;
    });
    return {
      ...task,
      media,
      mediaCacheKeys,
      persistedMediaOmitted: false,
      persistedMediaCount: 0,
    };
  });
  return {
    ...state,
    visualTasks: persistedTasks,
    images: [],
  };
}

function isInlineMedia(value) {
  return typeof value === "string" && /^(?:data:|blob:)/i.test(value);
}

function visualMediaCacheKey(taskId, index) {
  return `${taskId}:${index}`;
}

function mediaCacheReference(key) {
  return `idb-media:${encodeURIComponent(key)}`;
}

function isMediaCacheReference(value) {
  return typeof value === "string" && value.startsWith("idb-media:");
}

function mediaCacheKeyFromReference(value) {
  if (!isMediaCacheReference(value)) return "";
  try {
    return decodeURIComponent(value.slice("idb-media:".length));
  } catch {
    return "";
  }
}

function openMediaCacheDatabase() {
  if (mediaCacheDatabasePromise) return mediaCacheDatabasePromise;
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("当前浏览器不支持 IndexedDB"));
  mediaCacheDatabasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(MEDIA_CACHE_DB_NAME, MEDIA_CACHE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(MEDIA_CACHE_STORE)) {
        const store = database.createObjectStore(MEDIA_CACHE_STORE, { keyPath: "key" });
        store.createIndex("taskId", "taskId", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("无法打开视觉媒体缓存"));
    request.onblocked = () => reject(new Error("视觉媒体缓存数据库被其他页面占用"));
  });
  mediaCacheDatabasePromise.catch(() => {
    mediaCacheDatabasePromise = null;
  });
  return mediaCacheDatabasePromise;
}

function indexedDbRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("浏览器缓存操作失败"));
  });
}

function indexedDbTransaction(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("浏览器缓存写入失败"));
    transaction.onabort = () => reject(transaction.error || new Error("浏览器缓存写入已取消"));
  });
}

async function putVisualMediaCache(key, taskId, blob) {
  const database = await openMediaCacheDatabase();
  const transaction = database.transaction(MEDIA_CACHE_STORE, "readwrite");
  transaction.objectStore(MEDIA_CACHE_STORE).put({ key, taskId, blob, updatedAt: Date.now() });
  await indexedDbTransaction(transaction);
}

async function getVisualMediaCache(key) {
  const database = await openMediaCacheDatabase();
  const transaction = database.transaction(MEDIA_CACHE_STORE, "readonly");
  const record = await indexedDbRequest(transaction.objectStore(MEDIA_CACHE_STORE).get(key));
  return record?.blob || null;
}

async function deleteVisualMediaCacheForTask(taskId) {
  revokeCachedMediaObjectUrls(taskId);
  if (typeof indexedDB === "undefined") return;
  try {
    const database = await openMediaCacheDatabase();
    const readTransaction = database.transaction(MEDIA_CACHE_STORE, "readonly");
    const keys = await indexedDbRequest(readTransaction.objectStore(MEDIA_CACHE_STORE).index("taskId").getAllKeys(taskId));
    if (keys.length) {
      const writeTransaction = database.transaction(MEDIA_CACHE_STORE, "readwrite");
      const store = writeTransaction.objectStore(MEDIA_CACHE_STORE);
      keys.forEach((key) => store.delete(key));
      await indexedDbTransaction(writeTransaction);
    }
  } catch (error) {
    console.warn("Unable to delete visual media cache", error);
  }
}

async function clearVisualMediaCache() {
  cachedMediaObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  cachedMediaObjectUrls.clear();
  desiredMediaCacheWrites.clear();
  if (typeof indexedDB === "undefined") return;
  try {
    const database = await openMediaCacheDatabase();
    const transaction = database.transaction(MEDIA_CACHE_STORE, "readwrite");
    transaction.objectStore(MEDIA_CACHE_STORE).clear();
    await indexedDbTransaction(transaction);
  } catch (error) {
    console.warn("Unable to clear visual media cache", error);
  }
}

function revokeCachedMediaObjectUrls(taskId) {
  const prefix = `${taskId}:`;
  [...cachedMediaObjectUrls.entries()].forEach(([key, url]) => {
    if (!key.startsWith(prefix)) return;
    URL.revokeObjectURL(url);
    cachedMediaObjectUrls.delete(key);
    desiredMediaCacheWrites.delete(key);
  });
}

function scheduleVisualMediaCache() {
  if (typeof indexedDB === "undefined") return;
  state.visualTasks
    .filter((task) => task.type === "image" || (task.media || []).some((source) => isInlineMedia(source)))
    .forEach((task) => {
      (task.media || []).forEach((source, index) => {
        if (!source || isMediaCacheReference(source)) return;
        if (task.type !== "image" && !isInlineMedia(source)) return;
        queueVisualMediaCacheWrite(visualMediaCacheKey(task.id, index), task.id, source);
      });
    });
}

function queueVisualMediaCacheWrite(key, taskId, source) {
  const current = desiredMediaCacheWrites.get(key);
  if (current?.source === source) return mediaCacheWritePromises.get(key) || Promise.resolve();
  desiredMediaCacheWrites.set(key, { key, taskId, source });
  if (activeMediaCacheWrites.has(key)) return mediaCacheWritePromises.get(key) || Promise.resolve();
  activeMediaCacheWrites.add(key);
  const promise = runVisualMediaCacheWrite(key).finally(() => {
    mediaCacheWritePromises.delete(key);
  });
  mediaCacheWritePromises.set(key, promise);
  return promise;
}

async function runVisualMediaCacheWrite(key) {
  try {
    while (desiredMediaCacheWrites.has(key)) {
      const entry = desiredMediaCacheWrites.get(key);
      try {
        const task = state.visualTasks.find((item) => item.id === entry.taskId);
        const response = await fetchGeneratedMediaResource(entry.source, task);
        if (!response.ok) throw new Error(`媒体缓存读取失败：${response.status}`);
        const blob = await response.blob();
        if (!blob.size) throw new Error("媒体缓存内容为空");
        if (desiredMediaCacheWrites.get(key) !== entry) continue;
        await putVisualMediaCache(key, entry.taskId, blob);
      } catch (error) {
        if (desiredMediaCacheWrites.get(key) === entry) desiredMediaCacheWrites.delete(key);
        console.warn("Unable to cache visual media", error);
        break;
      }
      if (desiredMediaCacheWrites.get(key) === entry) break;
    }
  } finally {
    activeMediaCacheWrites.delete(key);
  }
}

async function cacheVisualTaskMedia(task) {
  if (typeof indexedDB === "undefined" || task?.type !== "image") return;
  const writes = (task.media || [])
    .map((source, index) => {
      if (!source || isMediaCacheReference(source)) return null;
      return queueVisualMediaCacheWrite(visualMediaCacheKey(task.id, index), task.id, source);
    })
    .filter(Boolean);
  await Promise.all(writes);
}

async function restoreCachedVisualMedia() {
  const cachedTasks = state.visualTasks.filter(
    (task) => ["image", "video"].includes(task.type)
      && (task.media || []).some((item) => isMediaCacheReference(item) || task.mediaCacheKeys?.length)
  );
  if (!cachedTasks.length) return;

  await Promise.all(
    cachedTasks.map(async (task) => {
      const restored = await Promise.all(
        (task.media || []).map(async (source, index) => {
          const key = task.mediaCacheKeys?.[index] || mediaCacheKeyFromReference(source) || visualMediaCacheKey(task.id, index);
          try {
            const blob = await getVisualMediaCache(key);
            if (!blob) {
              if (isMediaCacheReference(source)) return task.mediaSourceUrls?.[index] || "";
              return source;
            }
            const oldUrl = cachedMediaObjectUrls.get(key);
            if (oldUrl) URL.revokeObjectURL(oldUrl);
            const url = URL.createObjectURL(blob);
            cachedMediaObjectUrls.set(key, url);
            desiredMediaCacheWrites.set(key, { key, taskId: task.id, source: url });
            return url;
          } catch (error) {
            console.warn("Unable to restore visual media", error);
            return isMediaCacheReference(source) ? "" : source;
          }
        })
      );
      task.media = restored.filter(Boolean);
      if (task.type === "video" && task.media.some((source) => isAuthenticatedVideoProxyUrl(source))) {
        try {
          task.media = await materializeVideoUrls(task.media, task);
        } catch (error) {
          console.warn("Unable to restore authenticated video result", error);
        }
      }
      if (task.status === "done" && !task.media.length) {
        task.status = "empty";
        task.error = "浏览器缓存中未找到该媒体结果。";
      }
    })
  );
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function createEmptyDraftMedia() {
  return {
    imageReferences: [],
    videoImages: [],
    videoReferences: [],
    firstFrame: null,
    lastFrame: null,
    audio: null,
  };
}

function getActiveSession() {
  let session = state.sessions.find((item) => item.id === activeSessionId);
  if (!session) {
    activeSessionId = state.sessions[0]?.id || createSession();
    session = state.sessions.find((item) => item.id === activeSessionId);
  }
  return session;
}

function createSession(title = "新的会话") {
  const id = generateId();
  state.sessions.unshift({
    id,
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pinned: false,
    messages: [],
  });
  activeSessionId = id;
  saveState();
  render();
  return id;
}

function getActiveVisualSession() {
  let session = state.visualSessions.find((item) => item.id === activeVisualSessionId);
  if (!session) {
    activeVisualSessionId = state.visualSessions[0]?.id || createVisualSession();
    session = state.visualSessions.find((item) => item.id === activeVisualSessionId);
  }
  return session;
}

function createVisualSession(title = "新的视觉创作") {
  const id = generateId();
  state.visualSessions.unshift({
    id,
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pinned: false,
    contextEnabled: state.settings.visualContext,
    lastVisualMode: state.settings.visualMode === "video" ? "video" : "image",
    queueBatches: [],
  });
  activeVisualSessionId = id;
  activeMode = "image";
  draftMedia = createEmptyDraftMedia();
  syncImageModeFromReferences();
  saveState();
  render();
  return id;
}

// 新建对话: switch to the language model and open a fresh chat session.
function newChatFromMenu() {
  activeMode = "chat";
  closeMobileSidebar();
  createSession();
  els.promptInput.focus();
}

// 新建创作: a blank unified visual session. The generation type (image/video)
// stays whatever the user is on right now.
function newCreationFromMenu() {
  closeMobileSidebar();
  createVisualSession();
  els.promptInput.focus();
}

// "+ 新建队列": start a fresh round inside the current visual session — clear
// the draft prompt/reference slots and drop a batch marker into the queue.
// The canvas keeps its works; no session or record entry is created.
function startNewQueueBatch() {
  if (activeMode !== "image") return;
  const session = getActiveVisualSession();
  if (session) {
    if (!Array.isArray(session.queueBatches)) session.queueBatches = [];
    session.queueBatches.push({ id: generateId(), at: Date.now() });
  }
  draftMedia = createEmptyDraftMedia();
  els.promptInput.value = "";
  autoResizePrompt();
  syncImageModeFromReferences();
  saveState();
  renderDraftMediaTray();
  renderVisualMeta();
  renderImages();
  els.promptInput.focus();
}

function updateVisualSession(session, prompt = "") {
  if (!session) return;
  session.updatedAt = Date.now();
  session.lastVisualMode = state.settings.visualMode;
  if ((!session.title || session.title === "新的视觉创作") && prompt.trim()) {
    session.title = prompt.trim().slice(0, 36) || "新的视觉创作";
  }
  saveState();
}

function updateSession(session) {
  session.updatedAt = Date.now();
  if ((!session.title || session.title === "新的会话") && session.messages.length) {
    const firstUser = session.messages.find((message) => message.role === "user");
    if (firstUser?.content) session.title = firstUser.content.trim().slice(0, 36) || "新的会话";
  }
  saveState();
}

function bindEvents() {
  els.newSessionBtn.addEventListener("click", startNewQueueBatch);
  els.menuNewChat.addEventListener("click", newChatFromMenu);
  els.menuNewCreation.addEventListener("click", newCreationFromMenu);
  els.collapseSidebar.addEventListener("click", () => {
    els.sidebar.classList.toggle("collapsed");
  });
  els.mobileMenu.addEventListener("click", openMobileSidebar);
  els.overlay.addEventListener("click", closeMobileSidebar);
  els.menuImageMode.addEventListener("click", () => {
    setMode("image");
    if (state.settings.visualMode !== "image") setVisualMode("image");
  });
  els.menuVideoMode.addEventListener("click", () => {
    setMode("image");
    if (state.settings.visualMode !== "video") setVisualMode("video");
  });
  els.menuChatMode.addEventListener("click", () => setMode("chat"));
  els.sidebarModelSettings.addEventListener("click", () => openSettings("models"));
  els.sessionSearch.addEventListener("input", renderSessions);
  els.openSettingsSide.addEventListener("click", () => openSettings("api"));
  els.closeSettings.addEventListener("click", closeSettings);
  els.reloadModels.addEventListener("click", fetchModels);
  document.addEventListener("input", (event) => {
    const slider = event.target.closest?.("[data-duration-key]");
    if (!slider) return;
    const options = videoDurationOptionsForModel();
    const option = options[Number(slider.value)];
    if (!option) return;
    state.settings.videoDuration = effectiveVideoDurationForValue(option.value);
    saveState();
    const badge = slider.closest(".duration-control")?.querySelector(".duration-value");
    if (badge) badge.textContent = option.label;
    updateSettingsSummary();
    renderVisualMeta();
  });
  document.addEventListener("change", (event) => {
    if (!event.target.closest?.("[data-duration-key]")) return;
    renderOutputOptions();
  });
  els.testConnection.addEventListener("click", testConnection);
  els.saveSettings.addEventListener("click", () => saveSettingsFromForm());
  els.toggleApiKey.addEventListener("click", toggleApiKeyVisibility);
  els.copyApiKey.addEventListener("click", () => copyText(els.apiKey.value));
  els.settingsDialog.querySelectorAll("[data-settings-tab]").forEach((button) => {
    button.addEventListener("click", () => setSettingsTab(button.dataset.settingsTab));
  });
  els.settingsDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    if (!els.unsavedSettingsPrompt.hidden) {
      hideUnsavedSettingsPrompt();
      return;
    }
    requestSettingsClose();
  });
  els.settingsDialog.addEventListener("click", (event) => {
    if (event.target === els.settingsDialog) requestSettingsClose();
  });
  els.cancelSettingsClose.addEventListener("click", hideUnsavedSettingsPrompt);
  els.discardSettingsClose.addEventListener("click", closeSettingsDirect);
  els.saveSettingsClose.addEventListener("click", () => {
    saveSettingsFromForm({ closeAfterSave: true });
  });
  els.exportData.addEventListener("click", exportData);
  els.importData.addEventListener("click", () => els.importFile.click());
  els.importFile.addEventListener("change", importData);
  els.clearAll.addEventListener("click", clearAllData);
  els.clearImages.addEventListener("click", clearVisualTasks);
  els.composer.addEventListener("submit", onSubmit);
  els.promptInput.addEventListener("input", autoResizePrompt);
  els.promptInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      submitComposer();
    }
  });
  els.streamToggle.addEventListener("click", () => {
    state.settings.stream = !state.settings.stream;
    saveState();
    renderControls();
  });
  els.thinkingToggle.addEventListener("click", () => {
    state.settings.thinking = !state.settings.thinking;
    saveState();
    renderControls();
  });
  els.visualContextToggle.addEventListener("click", () => {
    const session = getActiveVisualSession();
    session.contextEnabled = !isVisualContextEnabled();
    state.settings.visualContext = session.contextEnabled;
    saveState();
    renderControls();
    renderVisualMeta();
  });
  els.chatWebToggle.addEventListener("click", () => {
    state.settings.chatWeb = !state.settings.chatWeb;
    saveState();
    renderControls();
    if (state.settings.chatWeb && !isWebSearchModel(state.settings.chatModel)) {
      showToast(`联网请求将使用 ${resolveWebSearchModel(state.settings.chatModel)}`);
    }
  });
  els.uploadChatFileButton.addEventListener("click", () => els.chatAttachmentFiles.click());
  els.chatAttachmentFiles.addEventListener("change", handleChatAttachmentFiles);
  els.quickModel.addEventListener("change", () => {
    if (activeMode === "image") {
      if (state.settings.visualMode === "video") {
        state.settings.videoModel = els.quickModel.value;
        normalizeDocumentedVeo31DraftForModel();
      }
      else {
        state.settings.imageModel = els.quickModel.value;
        state.settings.imageQuality = normalizeImageQualityForModel(
          state.settings.imageModel,
          state.settings.imageQuality
        );
      }
    } else {
      state.settings.chatModel = els.quickModel.value;
    }
    state.modelOptions = unique([els.quickModel.value, ...state.modelOptions]);
    saveState();
    syncSettingsForm();
    renderHeader();
    renderControls();
    renderOutputOptions();
    renderVisualMeta();
  });
  els.quickModelButton.addEventListener("click", toggleModelPopover);
  els.settingsSummaryBlock.addEventListener("click", toggleSettingsPopover);
  els.settingsSummaryBlock.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSettingsPopover();
    }
  });
  document.addEventListener("click", (event) => {
    // Use the composed path captured at dispatch time: option clicks inside
    // the settings popover re-render (and detach) the clicked button before
    // this listener runs, so closest() on the live target alone would miss.
    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    const pathHasId = (id) => path.some((node) => node && node.id === id);
    if (settingsPopoverOpen
      && !pathHasId("visualSettingsCard")
      && !pathHasId("settingsSummaryBlock")
      && !event.target.closest("#visualSettingsCard")
      && !event.target.closest("#settingsSummaryBlock")) {
      closeSettingsPopover();
    }
    if (!modelPopoverOpen) return;
    if (pathHasId("modelPopover") || pathHasId("quickModelButton")) return;
    if (event.target.closest("#modelPopover") || event.target.closest("#quickModelButton")) return;
    closeModelPopover();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModelPopover();
      closeSettingsPopover();
    }
  });
  els.stopButton.addEventListener("click", stopRequest);
  els.uploadImageRefButton.addEventListener("click", () => els.imageReferenceFiles.click());
  els.uploadFirstFrameButton.addEventListener("click", () => els.firstFrameFile.click());
  els.uploadLastFrameButton.addEventListener("click", () => els.lastFrameFile.click());
  els.uploadVideoRefButton.addEventListener("click", () => els.videoReferenceFiles.click());
  els.uploadAudioButton.addEventListener("click", () => els.audioReferenceFile.click());
  els.imageReferenceFiles.addEventListener("change", (event) => handleReferenceFiles(event, "image-reference"));
  els.videoReferenceFiles.addEventListener("change", (event) => handleReferenceFiles(event, "video-reference"));
  els.firstFrameFile.addEventListener("change", (event) => handleReferenceFiles(event, "first-frame"));
  els.lastFrameFile.addEventListener("change", (event) => handleReferenceFiles(event, "last-frame"));
  els.audioReferenceFile.addEventListener("change", (event) => handleReferenceFiles(event, "audio"));
  els.closeMediaViewer.addEventListener("click", closeMediaViewer);
  els.viewerZoomIn.addEventListener("click", () => setViewerZoom(viewerZoom + 0.25));
  els.viewerZoomOut.addEventListener("click", () => setViewerZoom(viewerZoom - 0.25));
  els.viewerFit.addEventListener("click", () => setViewerZoom(1));
  els.viewerImage.addEventListener("dblclick", () => setViewerZoom(viewerZoom === 1 ? 2 : 1));
  els.mediaViewer.addEventListener("click", (event) => {
    if (event.target === els.mediaViewer) closeMediaViewer();
  });
  els.mediaViewer.addEventListener("close", () => {
    els.viewerVideo.pause();
    els.viewerVideo.removeAttribute("src");
  });

  document.addEventListener("click", (event) => {
    const optionButton = event.target.closest("[data-setting-key]");
    if (optionButton) {
      setVisualOption(optionButton.dataset.settingKey, optionButton.dataset.value);
      return;
    }

    const removeButton = event.target.closest("[data-remove-media]");
    if (removeButton) {
      removeDraftMedia(removeButton.dataset.removeMedia, removeButton.dataset.mediaId);
      return;
    }

    const addMediaButton = event.target.closest("[data-add-media]");
    if (addMediaButton) {
      if (addMediaButton.dataset.addMedia === "video" && !draftMedia.firstFrame) {
        els.firstFrameFile.click();
      } else {
        els.imageReferenceFiles.click();
      }
      return;
    }

    const removeChatAttachmentButton = event.target.closest("[data-remove-chat-attachment]");
    if (removeChatAttachmentButton) {
      chatAttachments = chatAttachments.filter((item) => item.id !== removeChatAttachmentButton.dataset.removeChatAttachment);
      renderChatAttachments();
      return;
    }

    const refreshVideoButton = event.target.closest("[data-refresh-video]");
    if (refreshVideoButton) {
      const task = state.visualTasks.find((item) => item.id === refreshVideoButton.dataset.refreshVideo);
      if (!task?.jobId) return;
      task.status = "submitted";
      task.error = "";
      task.lastPollError = "";
      task.missingTaskPolls = 0;
      saveState();
      renderImages();
      pollVideoTask(task.id, { immediate: true, attempts: VIDEO_TASK_POLL_ATTEMPTS });
      showToast("正在刷新视频任务结果");
      return;
    }

    const popoverModelButton = event.target.closest("[data-popover-model-id]");
    if (popoverModelButton) {
      pickModelFromPopover(popoverModelButton.dataset.popoverModelId);
      return;
    }
  });
}

function openMobileSidebar() {
  els.sidebar.classList.add("open");
  els.overlay.hidden = false;
}

function closeMobileSidebar() {
  els.sidebar.classList.remove("open");
  els.overlay.hidden = true;
}

function setMode(mode) {
  activeMode = mode;
  if (mode === "image") {
    getActiveVisualSession();
  }
  saveState();
  render();
}

function setVisualMode(mode) {
  state.settings.visualMode = mode === "video" ? "video" : "image";
  activeMode = "image";
  const session = getActiveVisualSession();
  if (session) session.lastVisualMode = state.settings.visualMode;
  saveState();
  render();
}

function render() {
  renderHeader();
  renderModes();
  renderSessions();
  renderMessages();
  renderImages();
  renderControls();
  renderOutputOptions();
  renderDraftMediaTray();
  renderChatAttachments();
  renderVisualMeta();
  syncSettingsForm();
}

function renderHeader() {
  const isVisual = activeMode === "image";
  const visualMode = state.settings.visualMode;
  const model = isVisual
    ? visualMode === "video"
      ? state.settings.videoModel
      : state.settings.imageModel
    : state.settings.chatModel;
  if (els.sidebarModelName) {
    els.sidebarModelName.textContent = model || "未选择模型";
    els.sidebarModelName.title = model || "";
  }
  document.title = "DeepImage2-Video";
}

function renderModes() {
  const isVisual = activeMode === "image";
  const visualMode = state.settings.visualMode;
  if (els.workspace) els.workspace.classList.toggle("visual-workspace", isVisual);
  els.chatPanel.classList.toggle("active", !isVisual);
  els.imagePanel.classList.toggle("active", isVisual);
  if (els.sidebarRecords) els.sidebarRecords.hidden = false;
  if (els.sidebarRecordsTitle) els.sidebarRecordsTitle.textContent = isVisual ? "创作记录" : "对话记录";
  if (els.composerTitleRow) els.composerTitleRow.hidden = !isVisual;
  closeModelPopover();
  closeSettingsPopover();
  if (els.composerTitle && !isVisual) els.composerTitle.textContent = "语言模型";
  els.promptInput.placeholder = isVisual
    ? visualMode === "video"
      ? "描述要生成的视频镜头、主体、运动和氛围"
      : "描述要生成的画面；上传参考图可进行图生图"
    : "输入消息";
  els.sessionSearch.placeholder = isVisual ? "搜索创作记录" : "搜索对话记录";
  if (els.menuImageMode) {
    const menuStates = [
      [els.menuImageMode, isVisual && visualMode === "image"],
      [els.menuVideoMode, isVisual && visualMode === "video"],
      [els.menuChatMode, !isVisual],
    ];
    menuStates.forEach(([item, active]) => {
      item.classList.toggle("active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
  }
  renderConnectionStatus();
}

function renderConnectionStatus() {
  if (!els.connectionStatus) return;
  const raw = String(state.settings.baseUrl || "").trim();
  let host = "";
  try {
    host = new URL(raw).host;
  } catch {
    host = "";
  }
  const hasKey = Boolean(String(state.settings.apiKey || "").trim());
  els.connectionStatus.textContent = host
    ? `${host} · ${hasKey ? "已配置" : "未配置密钥"}`
    : "未配置 API 地址";
  els.connectionStatus.title = raw;
  els.connectionStatus.classList.toggle("is-ready", Boolean(host && hasKey));
}

function renderControls() {
  const isVisual = activeMode === "image";
  const visualMode = state.settings.visualMode;
  const grokVideoSelected = isVisual && visualMode === "video" && isGrokVideoModel(state.settings.videoModel);
  const klingVideoSelected = isVisual && visualMode === "video" && isKlingModel(state.settings.videoModel);
  const klingOmniSelected = klingVideoSelected && isKlingOmniModel(state.settings.videoModel);
  const documentedVeo31Selected = isVisual && visualMode === "video" && isDocumentedVeo31Model(state.settings.videoModel);
  const documentedVeo31ReferencesUnsupported = documentedVeo31Selected
    && (isDocumentedVeo31FastModel(state.settings.videoModel)
      || usesDeepRouterDocumentedVeo31Compatibility(state.settings.videoModel));
  els.visualToolbar.hidden = !isVisual;
  els.chatToolbar.hidden = isVisual;
  els.chatWebToggle.classList.toggle("active", !!state.settings.chatWeb);
  els.chatWebToggle.setAttribute("aria-pressed", String(!!state.settings.chatWeb));
  const contextEnabled = isVisualContextEnabled();
  els.visualContextToggle.classList.toggle("active", contextEnabled);
  els.visualContextToggle.setAttribute("aria-pressed", String(contextEnabled));
  els.visualContextToggle.title = contextEnabled ? "当前视觉会话会延续最近创作上下文" : "当前视觉会话不使用历史上下文";
  els.streamToggle.classList.toggle("active", state.settings.stream);
  els.streamToggle.setAttribute("aria-pressed", String(state.settings.stream));
  els.thinkingToggle.classList.toggle("active", state.settings.thinking);
  els.thinkingToggle.setAttribute("aria-pressed", String(state.settings.thinking));
  els.streamToggle.hidden = isVisual;
  els.thinkingToggle.hidden = isVisual;
  els.uploadImageRefButton.title = grokVideoSelected
    ? "上传一张参考图进行图生视频"
    : klingOmniSelected
      ? "上传最多三张 Kling Omni 参考图"
    : documentedVeo31Selected
      ? "上传 1-3 张主体或风格参考图"
    : visualMode === "video" ? "上传视频参考图" : "上传图片进行图生图";
  els.uploadImageRefButton.hidden = documentedVeo31ReferencesUnsupported || (klingVideoSelected && !klingOmniSelected);
  els.uploadFirstFrameButton.hidden = !isVisual || visualMode !== "video" || grokVideoSelected;
  els.uploadLastFrameButton.hidden = !isVisual
    || visualMode !== "video"
    || grokVideoSelected
    || (klingVideoSelected && !klingOmniSelected)
    || usesDeepRouterDocumentedVeo31Compatibility(state.settings.videoModel);
  els.uploadVideoRefButton.hidden = !isVisual || visualMode !== "video" || grokVideoSelected || klingVideoSelected || documentedVeo31Selected;
  els.uploadAudioButton.hidden = !isVisual || visualMode !== "video" || grokVideoSelected || klingVideoSelected || documentedVeo31Selected;
  fillQuickModelSelect();
  const selectedModel = activeMode === "image"
    ? state.settings.visualMode === "video"
      ? state.settings.videoModel
      : state.settings.imageModel
    : state.settings.chatModel;
  const selectedProfile = getModelProfile(selectedModel);
  const displayName = selectedProfile?.label && selectedProfile.label !== selectedModel
    ? selectedProfile.label
    : selectedModel;
  els.quickModelLabel.textContent = displayName || "未选择模型";
  els.quickModelLabel.title = selectedModel || "";
  const vendorName = selectedProfile?.vendor || "";
  els.quickModelVendor.textContent = vendorName ? vendorName.charAt(0).toUpperCase() : "✦";
  els.quickModelVendor.title = vendorName;
  if (!abortController) {
    els.sendButton.disabled = false;
    els.stopButton.hidden = !(isVisual && visualMode === "image" && activeImageRequests.size);
    els.stopButton.title = activeImageRequests.size ? `停止 ${activeImageRequests.size} 个图片任务` : "停止";
    els.sendButton.textContent = isVisual ? (visualMode === "video" ? "立即生成视频" : "立即生成图片") : "发送";
  }
}

function fillQuickModelSelect() {
  const isVisual = activeMode === "image";
  const visualMode = state.settings.visualMode;
  const current = isVisual
    ? visualMode === "video"
      ? state.settings.videoModel
      : state.settings.imageModel
    : state.settings.chatModel;
  if (isVisual) {
    fillGroupedModelSelect(els.quickModel, visualMode, current);
  } else {
    fillGroupedModelSelect(els.quickModel, "chat", current);
  }
  els.quickModel.value = current || "";
}

const BOOL_SETTING_OPTIONS = [
  { value: "true", label: "开启" },
  { value: "false", label: "关闭" },
];

const VIDEO_AUDIO_OPTIONS = [
  { value: "true", label: "含音频" },
  { value: "false", label: "静音" },
];

const COUNT_SETTING_OPTIONS = Array.from({ length: 4 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

// Canonical tier names for size/resolution档位 (BoostMax style: 标清/高清/超清).
const SIZE_TIER_NAMES = {
  "0.5k": "标清",
  "480p": "标清",
  "1k": "标清",
  "720p": "高清",
  "2k": "高清",
  "1080p": "超清",
  "4k": "超清",
};

function tierNameForOption(option) {
  const byValue = SIZE_TIER_NAMES[String(option.value || "").toLowerCase()];
  if (byValue) return byValue;
  const byLabel = SIZE_TIER_NAMES[String(option.label || "").toLowerCase()];
  return byLabel || "";
}

function renderOutputOptions() {
  const isVideo = state.settings.visualMode === "video";
  const usesPixelSize = usesPixelVideoSizeOptions(state.settings.videoModel);
  const grokImageSelected = isGrokImagineImageModel(state.settings.imageModel);
  applySettingsPopoverVisibility();
  els.imageOutputSettings.hidden = isVideo;
  els.videoOutputSettings.hidden = !isVideo;
  const isDallE3 = state.settings.imageModel === "dall-e-3";

  const imageSizeRow = els.imageSizeGroup.closest(".setting-row");
  const imageStyleRow = els.imageStyleGroup.closest(".setting-row");
  const imageQualityRow = els.imageQualityGroup.closest(".setting-row");
  const seedreamSelected = isSeedreamModel(state.settings.imageModel);
  const gptImageSelected = isGptImageModel(state.settings.imageModel);
  if (imageSizeRow) imageSizeRow.hidden = grokImageSelected;
  if (imageStyleRow) imageStyleRow.hidden = grokImageSelected || gptImageSelected || seedreamSelected;
  if (imageQualityRow) imageQualityRow.hidden = seedreamSelected;
  const imageBackgroundRow = els.imageBackgroundGroup?.closest(".setting-row");
  const imageFormatRow = els.imageFormatGroup?.closest(".setting-row");
  if (imageBackgroundRow) imageBackgroundRow.hidden = !gptImageSelected;
  if (imageFormatRow) imageFormatRow.hidden = !gptImageSelected;
  const imageWatermarkRow = els.imageWatermarkGroup?.closest(".setting-row");
  const imageSequentialRow = els.imageSequentialGroup?.closest(".setting-row");
  if (imageWatermarkRow) imageWatermarkRow.hidden = !seedreamSelected;
  if (imageSequentialRow) imageSequentialRow.hidden = !seedreamSelected;
  renderTileGroup(els.imageAspectGroup, "imageAspectRatio", imageAspectOptionsForModel(), effectiveImageAspectRatio());
  renderOptionGroup(els.imageSizeGroup, "imageSize", imageSizeOptionsForModel(), effectiveImageOutputSize(), { tiered: true });
  renderOptionGroup(
    els.imageQualityGroup,
    "imageQuality",
    imageQualityOptionsForModel(),
    grokImageSelected ? grokImageResolution() : state.settings.imageQuality
  );
  renderOptionGroup(els.imageStyleGroup, "imageStyle", imageStyleOptionsForModel(), state.settings.imageStyle);
  if (els.imageBackgroundGroup) {
    renderOptionGroup(els.imageBackgroundGroup, "imageBackground", GPT_IMAGE_BACKGROUND_OPTIONS, gptImageBackgroundValue());
  }
  if (els.imageFormatGroup) {
    renderOptionGroup(els.imageFormatGroup, "imageOutputFormat", GPT_IMAGE_FORMAT_OPTIONS, gptImageOutputFormatValue());
  }
  renderOptionGroup(els.imageWatermarkGroup, "imageWatermark", BOOL_SETTING_OPTIONS, String(!!state.settings.imageWatermark));
  renderOptionGroup(els.imageSequentialGroup, "imageSequential", BOOL_SETTING_OPTIONS, String(!!state.settings.imageSequential));
  renderOptionGroup(els.imageCountGroup, "imageCount", COUNT_SETTING_OPTIONS, String(isDallE3 ? 1 : state.settings.imageCount), {
    disabled: isDallE3,
  });
  els.imageCountGroup.title = isDallE3 ? "DALL-E 3 每次仅生成 1 张" : "";
  renderTileGroup(els.videoAspectGroup, "videoAspectRatio", videoAspectOptionsForModel(), effectiveVideoAspectRatio());
  const videoAspectRow = els.videoAspectGroup.closest(".setting-row");
  const videoResolutionRow = els.videoResolutionGroup.closest(".setting-row");
  const videoCountRow = els.videoCountGroup.closest(".setting-row");
  const videoStyleRow = els.videoStyleGroup.closest(".setting-row");
  const videoAudioRow = els.videoAudioGroup.closest(".setting-row");
  const usesOfficialGrokRequest = isGrokVideoModel(state.settings.videoModel);
  const videoAspectLabel = videoAspectRow?.querySelector(":scope > span");
  if (videoAspectLabel) videoAspectLabel.textContent = usesPixelSize ? "尺寸" : "视频比例";
  if (videoResolutionRow) videoResolutionRow.hidden = usesPixelSize;
  if (videoCountRow) videoCountRow.hidden = !isSeedanceModel(state.settings.videoModel);
  const documentedVeo31 = isDocumentedVeo31Model(state.settings.videoModel);
  if (videoStyleRow) videoStyleRow.hidden = false;
  if (videoAudioRow) videoAudioRow.hidden = usesOfficialGrokRequest || documentedVeo31;
  renderOptionGroup(els.videoResolutionGroup, "videoResolution", videoResolutionOptionsForModel(), effectiveVideoResolution(), { tiered: true });
  renderDurationSlider(els.videoDurationGroup, "videoDuration", videoDurationOptionsForModel(), String(effectiveVideoDuration()));
  renderOptionGroup(els.videoCountGroup, "videoCount", COUNT_SETTING_OPTIONS, String(effectiveVideoCount()));
  renderOptionGroup(els.videoStyleGroup, "videoStyle", VIDEO_STYLE_OPTIONS, state.settings.videoStyle);
  renderOptionGroup(els.videoAudioGroup, "videoAudio", VIDEO_AUDIO_OPTIONS, String(effectiveVideoAudio()), {
    disabled: isVeoModel(state.settings.videoModel),
  });
  els.videoAudioGroup.title = isVeo2Model(state.settings.videoModel)
    ? "Veo 2 仅生成静音视频"
    : isVeoModel(state.settings.videoModel) ? "Veo 3 系列始终生成音频" : "";
  updateSettingsSummary();
}

function renderOptionGroup(container, key, options, currentValue, config = {}) {
  container.innerHTML = options
    .map((option) => {
      const active = String(option.value) === String(currentValue) ? " active" : "";
      const tier = config.tiered ? tierNameForOption(option) : "";
      const tierHtml = tier ? `<span class="pill-tier">${escapeHtml(tier)}</span>` : "";
      const disabled = config.disabled ? " disabled" : "";
      return `<button class="option-button pill-option${active}" type="button" data-setting-key="${escapeAttr(key)}" data-value="${escapeAttr(option.value)}"${disabled}>${tierHtml}<span class="pill-label">${escapeHtml(option.label)}</span><span class="option-check" aria-hidden="true">✓</span></button>`;
    })
    .join("");
}

function ratioGlyphForValue(value) {
  const text = String(value || "");
  let width = 0;
  let height = 0;
  const colon = text.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  const pixels = text.match(/^(\d+)x(\d+)$/);
  if (colon) {
    width = Number(colon[1]);
    height = Number(colon[2]);
  } else if (pixels) {
    width = Number(pixels[1]);
    height = Number(pixels[2]);
  }
  if (!width || !height) {
    return `<span class="ratio-glyph"><i class="ratio-glyph-box is-adaptive" style="width:20px;height:20px"></i></span>`;
  }
  const scale = 22 / Math.max(width, height);
  const boxWidth = Math.max(5, Math.round(width * scale));
  const boxHeight = Math.max(5, Math.round(height * scale));
  return `<span class="ratio-glyph"><i class="ratio-glyph-box" style="width:${boxWidth}px;height:${boxHeight}px"></i></span>`;
}

function renderTileGroup(container, key, options, currentValue) {
  container.innerHTML = options
    .map((option) => {
      const active = String(option.value) === String(currentValue) ? " active" : "";
      return `<button class="ratio-tile${active}" type="button" data-setting-key="${escapeAttr(key)}" data-value="${escapeAttr(option.value)}">${ratioGlyphForValue(option.value)}<span class="ratio-label">${escapeHtml(option.label)}</span><span class="option-check" aria-hidden="true">✓</span></button>`;
    })
    .join("");
}

function renderDurationSlider(container, key, options, currentValue) {
  const currentIndex = Math.max(0, options.findIndex((option) => String(option.value) === String(currentValue)));
  const current = options[currentIndex] || { value: currentValue, label: currentValue };
  const first = options[0] || current;
  container.innerHTML = `
    <span class="duration-min">${escapeHtml(first.label)}</span>
    <input class="duration-slider" type="range" min="0" max="${Math.max(0, options.length - 1)}" step="1" value="${currentIndex}"
      data-duration-key="${escapeAttr(key)}" aria-label="时长" ${options.length <= 1 ? "disabled" : ""} />
    <span class="duration-value">${escapeHtml(current.label)}</span>
  `;
}

function optionLabelForValue(options, value) {
  const found = options.find((option) => String(option.value) === String(value));
  return found ? found.label : String(value);
}

function updateSettingsSummary() {
  if (!els.settingsSummaryBlock) return;
  const isVisual = activeMode === "image";
  els.settingsSummaryBlock.hidden = !isVisual;
  if (!isVisual) return;
  const isVideo = state.settings.visualMode === "video";
  els.settingsSummaryLabel.textContent = isVideo ? "视频设置" : "图片设置";
  if (isVideo) {
    const duration = effectiveVideoDuration();
    const parts = [
      optionLabelForValue(videoAspectOptionsForModel(), effectiveVideoAspectRatio()),
      optionLabelForValue(videoResolutionOptionsForModel(), effectiveVideoResolution()),
      duration === -1 ? "自动" : `${duration}s`,
    ];
    els.settingsSummaryText.textContent = parts.join(" · ");
  } else {
    const parts = [
      optionLabelForValue(imageAspectOptionsForModel(), effectiveImageAspectRatio()),
      optionLabelForValue(imageSizeOptionsForModel(), effectiveImageOutputSize()),
    ];
    if (isGptImageModel(state.settings.imageModel)) {
      parts.push(gptImageOutputFormatValue().toUpperCase());
    }
    els.settingsSummaryText.textContent = parts.join(" · ");
  }
}

function applySettingsPopoverVisibility() {
  if (els.visualSettingsCard) {
    els.visualSettingsCard.hidden = activeMode !== "image" || !settingsPopoverOpen;
  }
  if (els.settingsSummaryBlock) {
    els.settingsSummaryBlock.classList.toggle("open", settingsPopoverOpen);
    els.settingsSummaryBlock.setAttribute("aria-expanded", String(settingsPopoverOpen));
  }
}

function openSettingsPopover() {
  if (activeMode !== "image") return;
  closeModelPopover();
  settingsPopoverOpen = true;
  applySettingsPopoverVisibility();
}

function closeSettingsPopover() {
  if (!settingsPopoverOpen) return;
  settingsPopoverOpen = false;
  applySettingsPopoverVisibility();
}

function toggleSettingsPopover() {
  if (activeMode !== "image") return;
  if (settingsPopoverOpen) closeSettingsPopover();
  else openSettingsPopover();
}

function imageSizeOptionsForModel() {
  const model = getModelProfile(state.settings.imageModel);
  if (isGrokImagineImageModel(model?.id)) {
    return [
      { value: "1k", label: "1K" },
      { value: "2k", label: "2K" },
    ];
  }
  if (model?.id === "dall-e-3") {
    return IMAGE_SIZE_OPTIONS.filter((option) => ["1024x1024", "1024x1792", "1792x1024"].includes(option.value));
  }
  if (isSeedreamModel(model?.id)) {
    return SEEDREAM_SIZE_OPTIONS;
  }
  if (isGptImage2Model(model?.id)) {
    return [
      { value: "auto", label: "自动" },
      { value: "1024x1024", label: "1024²" },
      { value: "1536x1024", label: "1536×1024" },
      { value: "1024x1536", label: "1024×1536" },
      { value: "2048x2048", label: "2K 方形" },
      { value: "2048x1152", label: "2K 横向" },
      { value: "3840x2160", label: "4K 横向" },
      { value: "2160x3840", label: "4K 竖向" },
    ];
  }
  if (isGptImageModel(model?.id)) {
    return [
      { value: "auto", label: "自动" },
      { value: "1024x1024", label: "1024²" },
      { value: "1536x1024", label: "横向" },
      { value: "1024x1536", label: "竖向" },
    ];
  }
  if (model?.provider === "gemini") {
    const id = String(model.id || "").toLowerCase();
    const automatic = [{ value: "auto", label: "自动" }];
    if (isLegacyGeminiImageModel(id)) return automatic;
    if (/gemini-3\.1-flash-lite-image/.test(id)) return [...automatic, { value: "1K", label: "1K" }];
    if (/gemini-2\.0/.test(id)) return [...automatic, { value: "1K", label: "1K" }];
    const sizes = [
      { value: "1K", label: "1K" },
      { value: "2K", label: "2K" },
      { value: "4K", label: "4K" },
    ];
    return /gemini-3\.1-flash-image/.test(id)
      ? [...automatic, { value: "0.5K", label: "0.5K" }, ...sizes]
      : [...automatic, ...sizes];
  }
  return IMAGE_SIZE_OPTIONS;
}

function imageAspectOptionsForModel(modelId = state.settings.imageModel) {
  if (isGrokImagineImageModel(modelId)) {
    return ["9:16", "16:9", "2:3", "3:2", "1:1"].map((value) => ({ value, label: value }));
  }
  if (supportsGeminiNativeImageConfig(modelId)) {
    const id = String(modelId || "").toLowerCase();
    const ratios = /gemini-3\.1-flash-image|nano[-_.]?banana[-_.]?2/.test(id)
      ? ["1:1", "1:4", "1:8", "2:3", "3:2", "3:4", "4:1", "4:3", "4:5", "5:4", "8:1", "9:16", "16:9", "21:9"]
      : ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];
    return ratios.map((value) => ({ value, label: value }));
  }
  if (isGptImageModel(modelId)) {
    return ["1:1", "3:2", "2:3", "4:3", "3:4", "16:9", "9:16", "21:9"].map((value) => ({ value, label: value }));
  }
  return IMAGE_ASPECT_OPTIONS;
}

function effectiveImageAspectRatio(modelId = state.settings.imageModel) {
  const ratio = state.settings.imageAspectRatio;
  const supported = imageAspectOptionsForModel(modelId).map((option) => option.value);
  return supported.includes(ratio) ? ratio : "1:1";
}

function imageQualityOptionsForModel() {
  const model = getModelProfile(state.settings.imageModel);
  if (isGrokImagineImageModel(model?.id)) {
    return [
      { value: "1k", label: "1K" },
      { value: "2k", label: "2K" },
    ];
  }
  if (model?.id === "dall-e-3") {
    return IMAGE_QUALITY_OPTIONS.filter((option) => ["standard", "hd"].includes(option.value));
  }
  if (isGptImageModel(model?.id)) {
    const values = ["auto", "low", "medium", "high"];
    if (isGptImage25PlusModel(model?.id)) values.push("xhigh", "max");
    return values.map((value) => ({ value, label: GPT_IMAGE_QUALITY_LABELS[value] }));
  }
  if (model?.provider === "openai") {
    const values = ["auto", "low", "medium", "high"];
    return IMAGE_QUALITY_OPTIONS.filter((option) => values.includes(option.value));
  }
  if (model?.provider === "gemini") {
    return IMAGE_QUALITY_OPTIONS;
  }
  return IMAGE_QUALITY_OPTIONS.filter((option) => ["auto", "standard", "high"].includes(option.value));
}

function videoResolutionOptionsForModel() {
  const modelId = state.settings.videoModel;
  if (isKlingModel(modelId)) {
    return VIDEO_RESOLUTION_OPTIONS.filter((option) => ["720p", "1080p"].includes(option.value));
  }
  if (isMuseVideoModel(modelId)) {
    return VIDEO_RESOLUTION_OPTIONS.filter((option) => MUSE_VIDEO_RESOLUTION_OPTIONS.includes(option.value));
  }
  if (isSeedance25Model(modelId)) {
    return VIDEO_RESOLUTION_OPTIONS.filter((option) => ["480p", "720p", "1080p"].includes(option.value));
  }
  if (isSeedance2FastModel(modelId)) {
    return VIDEO_RESOLUTION_OPTIONS.filter((option) => ["480p", "720p"].includes(option.value));
  }
  if (isSeedance2Model(modelId)) {
    return VIDEO_RESOLUTION_OPTIONS.filter((option) => ["480p", "720p", "1080p", "4k"].includes(option.value));
  }
  if (isGrokVideoModel(modelId)) {
    const supported = ["480p", "720p"];
    return VIDEO_RESOLUTION_OPTIONS.filter((option) => supported.includes(option.value));
  }
  if (isDocumentedVeo31Model(modelId)) {
    return VIDEO_RESOLUTION_OPTIONS.filter((option) => ["720p", "1080p"].includes(option.value));
  }
  if (isVeoModel(modelId)) {
    let supported = ["720p", "1080p"];
    if (isVeo2Model(modelId) || isVeo31LiteModel(modelId)) supported = ["720p"];
    else if (isVeo31Model(modelId)) supported = ["720p", "1080p", "4k"];
    return VIDEO_RESOLUTION_OPTIONS.filter((option) => supported.includes(option.value));
  }
  return VIDEO_RESOLUTION_OPTIONS;
}

function videoAspectOptionsForModel() {
  const modelId = state.settings.videoModel;
  if (isKlingModel(modelId)) {
    return VIDEO_ASPECT_OPTIONS.filter((option) => ["16:9", "9:16"].includes(option.value));
  }
  if (isMuseVideoModel(modelId)) {
    return MUSE_VIDEO_ASPECT_OPTIONS.map((value) => ({ value, label: value }));
  }
  if (isSora2Model(modelId)) {
    return [{ value: "1280x720", label: "1280x720" }];
  }
  if (usesDeepRouterVeoCompatibility(modelId)) {
    return ["1920x1080", "1080x1920"].map((value) => ({ value, label: value }));
  }
  if (isSeedance2Model(modelId) || isSeedance25Model(modelId)) {
    return ["adaptive", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16"]
      .map((value) => ({ value, label: value === "adaptive" ? "自适应" : value }));
  }
  if (isSeedanceModel(modelId)) {
    return VIDEO_ASPECT_OPTIONS.filter((option) => ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"].includes(option.value));
  }
  if (isGrokVideoModel(modelId)) {
    if (isGrokImagineVideoModel(modelId)) {
      return ["1:1", "16:9", "9:16"].map((value) => ({ value, label: value }));
    }
    return ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"].map((value) => ({ value, label: value }));
  }
  if (isDocumentedVeo31ReferenceMode(modelId)) {
    return [{ value: "16:9", label: "16:9" }];
  }
  if (isVeoModel(modelId)) {
    return VIDEO_ASPECT_OPTIONS.filter((option) => ["16:9", "9:16"].includes(option.value));
  }
  return VIDEO_ASPECT_OPTIONS;
}

function videoDurationOptionsForModel() {
  const modelId = state.settings.videoModel;
  if (isMuseVideoModel(modelId)) {
    return MUSE_VIDEO_DURATION_OPTIONS.map((seconds) => ({ value: String(seconds), label: `${seconds}s` }));
  }
  if (isKlingModel(modelId)) {
    return Array.from({ length: 13 }, (_, index) => {
      const seconds = String(index + 3);
      return { value: seconds, label: `${seconds}s` };
    });
  }
  if (isSora2Model(modelId)) {
    return [{ value: "12", label: "12s" }];
  }
  if (isGrokVideoModel(modelId)) {
    return GROK_VIDEO_DURATIONS.map((seconds) => ({ value: String(seconds), label: `${seconds}s` }));
  }
  if (usesDeepRouterVeoCompatibility(modelId)) {
    return [{ value: "8", label: "8s" }];
  }
  if (isDocumentedVeo31Model(modelId) && requiresEightSecondVeo31Duration(modelId)) {
    return [{ value: "8", label: "8s" }];
  }
  if (isVeoModel(modelId)) {
    const durations = isVeo2Model(modelId) ? [5, 6, 8] : [4, 6, 8];
    return durations.map((seconds) => ({ value: String(seconds), label: `${seconds}s` }));
  }
  if (isSeedance25Model(modelId)) {
    const options = Array.from({ length: 27 }, (_, index) => {
      const seconds = String(index + 4);
      return { value: seconds, label: `${seconds}s` };
    });
    return [{ value: "-1", label: "自动" }, ...options];
  }
  if (!isSeedance2Model(modelId)) return VIDEO_DURATION_OPTIONS;
  const options = Array.from({ length: 12 }, (_, index) => {
    const seconds = String(index + 4);
    return { value: seconds, label: `${seconds}s` };
  });
  return [{ value: "-1", label: "自动" }, ...options];
}

function isSeedanceModel(modelId) {
  return /seedance/i.test(String(modelId || ""));
}

function isSeedance2Model(modelId) {
  return /seedance.*2[-_.]?0/i.test(String(modelId || ""));
}

function isSeedance25Model(modelId) {
  return /seedance.*2[-_.]?5/i.test(String(modelId || ""));
}

function isSeedance2FastModel(modelId) {
  return /seedance.*2[-_.]?0.*(?:fast|mini)/i.test(String(modelId || ""));
}

function isSeedance20UnifiedModel(modelId) {
  return /^doubao[-_.]seedance[-_.]2[-_.]0$/i.test(String(modelId || ""));
}

function usesNewApiSeedance20Task(modelId = state.settings.videoModel) {
  return isSeedance20UnifiedModel(modelId) && isDeepRouterBaseUrl();
}

function isGrokImagineVideoModel(modelId) {
  return /grok[-_.]?imagine[-_.]?video/i.test(String(modelId || ""));
}

function isGrokImagineImageModel(modelId) {
  return /^grok[-_.]?imagine[-_.]?image(?:$|[-_.])/i.test(String(modelId || ""));
}

function isGrokVideoModel(modelId) {
  return /grok.*video|video.*grok/i.test(String(modelId || ""));
}

function isThirdPartyGrokVideoModel(modelId) {
  return /^grok[-_.]video[-_.]3(?:$|[-_.](?:max|pro)$)/i.test(String(modelId || ""));
}

function isGrokImagine15Model(modelId) {
  return /grok[-_.]?imagine[-_.]?video[-_.]?1(?:[-_.]?5|\.5)/i.test(String(modelId || ""));
}

function isVeoModel(modelId) {
  return /(?:^|[-_.])veo(?:[-_.]|\d|$)/i.test(String(modelId || ""));
}

function isKlingModel(modelId) {
  return /^kling[-_.]3[-_.]0(?:$|[-_.]omni$)/i.test(String(modelId || ""));
}

function isKlingOmniModel(modelId) {
  return /^kling[-_.]3[-_.]0[-_.]omni$/i.test(String(modelId || ""));
}

function isVeo2Model(modelId) {
  return /veo[-_.]?2(?:$|[-_.])/i.test(String(modelId || ""));
}

function isVeo31Model(modelId) {
  return /veo[-_.]?3(?:[-_.]?1|\.1)/i.test(String(modelId || ""));
}

function isDocumentedVeo31Model(modelId) {
  return /^veo[-_.]3[-_.]1(?:[-_.]fast)?[-_.]generate[-_.]preview$/i.test(String(modelId || ""));
}

function isDocumentedVeo31FastModel(modelId) {
  return /^veo[-_.]3[-_.]1[-_.]fast[-_.]generate[-_.]preview$/i.test(String(modelId || ""));
}

function isVeo31LiteModel(modelId) {
  return isVeo31Model(modelId) && /lite/i.test(String(modelId || ""));
}

function isSora2Model(modelId) {
  return /(?:^|[-_.])sora[-_.]?2(?:$|[-_.])/i.test(String(modelId || "")) && !isSora2ProModel(modelId);
}

function isSora2ProModel(modelId) {
  return /(?:^|[-_.])sora[-_.]?2[-_.]?pro(?:$|[-_.])/i.test(String(modelId || ""));
}

function isDeepRouterBaseUrl() {
  return /^https?:\/\/(?:www\.)?deeprouter\.top(?:\/|$)/i.test(String(state.settings.baseUrl || ""));
}

function isLinkMeshBaseUrl() {
  try {
    return LINKMESH_API_HOSTS.has(new URL(String(state.settings.baseUrl || "")).hostname.toLowerCase());
  } catch {
    return false;
  }
}

function isSub2ApiBaseUrl() {
  try {
    return /sub2api/i.test(new URL(String(state.settings.baseUrl || "")).hostname);
  } catch {
    return /sub2api/i.test(String(state.settings.baseUrl || ""));
  }
}

function usesOfficialXaiVideoApi() {
  return isLinkMeshBaseUrl()
    || isDeepRouterBaseUrl()
    || /^https?:\/\/(?:api\.)?x\.ai(?:\/|$)/i.test(String(state.settings.baseUrl || ""));
}

function usesDeepRouterVeoCompatibility(modelId = state.settings.videoModel) {
  const compactId = String(modelId || "").toLowerCase().replace(/[-_.]/g, "");
  return isDeepRouterBaseUrl() && /^veo31fast(?:preview)?$/.test(compactId);
}

function usesDeepRouterDocumentedVeo31Compatibility(modelId = state.settings.videoModel) {
  return isDeepRouterBaseUrl() && isDocumentedVeo31Model(modelId);
}

function usesNewApiVeoTask(modelId = state.settings.videoModel) {
  return isVeoModel(modelId)
    && isDeepRouterBaseUrl()
    && !usesDeepRouterVeoCompatibility(modelId)
    && !isDocumentedVeo31Model(modelId);
}

function usesPixelVideoSizeOptions(modelId = state.settings.videoModel) {
  return isSora2Model(modelId) || usesDeepRouterVeoCompatibility(modelId);
}

function effectiveVideoAspectRatio(modelId = state.settings.videoModel) {
  const ratio = state.settings.videoAspectRatio;
  if (isMuseVideoModel(modelId)) return MUSE_VIDEO_ASPECT_OPTIONS.includes(ratio) ? ratio : "16:9";
  if (isKlingModel(modelId)) return ["16:9", "9:16"].includes(ratio) ? ratio : "16:9";
  if (isSora2Model(modelId)) {
    return "1280x720";
  }
  if (usesDeepRouterVeoCompatibility(modelId)) {
    if (["1920x1080", "1080x1920"].includes(ratio)) return ratio;
    return ratio === "9:16" ? "1080x1920" : "1920x1080";
  }
  if (isSeedance25Model(modelId) && hasSeedance25MediaInputs()) return "adaptive";
  if (isSeedance2Model(modelId) || isSeedance25Model(modelId)) {
    return ["adaptive", "21:9", "16:9", "4:3", "1:1", "3:4", "9:16"].includes(ratio) ? ratio : "16:9";
  }
  if (isSeedanceModel(modelId)) {
    return ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"].includes(ratio) ? ratio : "16:9";
  }
  if (isGrokVideoModel(modelId)) {
    if (isGrokImagineVideoModel(modelId)) {
      return ["1:1", "16:9", "9:16"].includes(ratio) ? ratio : "16:9";
    }
    return ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"].includes(ratio) ? ratio : "16:9";
  }
  if (isDocumentedVeo31ReferenceMode(modelId)) return "16:9";
  if (isVeoModel(modelId)) return ["16:9", "9:16"].includes(ratio) ? ratio : "16:9";
  return ratio;
}

function effectiveVideoResolution(modelId = state.settings.videoModel) {
  const resolution = state.settings.videoResolution;
  if (isMuseVideoModel(modelId)) return MUSE_VIDEO_RESOLUTION_OPTIONS.includes(resolution) ? resolution : "720p";
  if (isKlingModel(modelId)) return ["720p", "1080p"].includes(resolution) ? resolution : "720p";
  if (isSeedance25Model(modelId)) return ["480p", "720p", "1080p"].includes(resolution) ? resolution : "720p";
  if (isSeedance2FastModel(modelId)) return ["480p", "720p"].includes(resolution) ? resolution : "720p";
  if (isSeedance2Model(modelId)) return ["480p", "720p", "1080p", "4k"].includes(resolution) ? resolution : "720p";
  if (isGrokVideoModel(modelId)) {
    return ["480p", "720p"].includes(resolution) ? resolution : "720p";
  }
  if (isDocumentedVeo31Model(modelId)) return ["720p", "1080p"].includes(resolution) ? resolution : "720p";
  if (isVeo2Model(modelId) || isVeo31LiteModel(modelId)) return "720p";
  if (isVeo31Model(modelId)) return ["720p", "1080p", "4k"].includes(resolution) ? resolution : "720p";
  if (isVeoModel(modelId)) return ["720p", "1080p"].includes(resolution) ? resolution : "720p";
  return resolution;
}

function normalizeSeedDanceDuration(value, modelId = state.settings.videoModel) {
  const duration = Number(value);
  const seedance25 = isSeedance25Model(modelId);
  if ((isSeedance2Model(modelId) || seedance25) && duration === -1) return -1;
  const fallback = seedance25 ? 4 : isSeedance2Model(modelId) ? 5 : 4;
  const minimum = seedance25 || isSeedance2Model(modelId) ? 4 : 1;
  const maximum = seedance25 ? 30 : isSeedance2Model(modelId) ? 15 : 30;
  return Math.min(maximum, Math.max(minimum, Number.isFinite(duration) ? Math.round(duration) : fallback));
}

function normalizeMuseDuration(value) {
  const duration = Number(value);
  if (!Number.isFinite(duration)) return MUSE_VIDEO_DURATION_OPTIONS[0];
  return MUSE_VIDEO_DURATION_OPTIONS.reduce(
    (closest, option) => (Math.abs(option - duration) < Math.abs(closest - duration) ? option : closest),
    MUSE_VIDEO_DURATION_OPTIONS[0]
  );
}

function effectiveVideoDuration(modelId = state.settings.videoModel) {
  const profile = getModelProfile(modelId);
  if (isMuseVideoModel(modelId)) return normalizeMuseDuration(state.settings.videoDuration);
  if (isKlingModel(modelId)) return normalizeKlingDuration(state.settings.videoDuration);
  if (profile?.provider === "seedance") {
    if (isSeedance25Model(modelId) && draftMedia.videoReferences.length) return -1;
    return normalizeSeedDanceDuration(state.settings.videoDuration, modelId);
  }
  if (isSora2Model(modelId)) return normalizeSora2Duration(state.settings.videoDuration, modelId);
  if (isGrokVideoModel(modelId)) return normalizeGrokVideoDuration(state.settings.videoDuration, modelId);
  if (isVeoModel(modelId)) return normalizeVeoDuration(state.settings.videoDuration, modelId);
  return clampNumber(state.settings.videoDuration, 1, 30, 5);
}

function effectiveVideoCount(modelId = state.settings.videoModel) {
  return isSeedanceModel(modelId)
    ? clampNumber(state.settings.videoCount, 1, 4, 1)
    : 1;
}

function normalizeGrokVideoDuration(value, modelId = state.settings.videoModel) {
  const duration = Number(value);
  return Math.min(15, Math.max(1, Number.isFinite(duration) ? Math.round(duration) : 8));
}

function normalizeKlingDuration(value) {
  const duration = Number(value);
  return Math.min(15, Math.max(3, Number.isFinite(duration) ? Math.round(duration) : 5));
}

function normalizeSora2Duration(value, modelId = state.settings.videoModel) {
  return 12;
}

function normalizeVeoDuration(value, modelId = state.settings.videoModel) {
  const allowed = isVeo2Model(modelId) ? [5, 6, 8] : [4, 6, 8];
  const duration = Number(value);
  if (usesDeepRouterVeoCompatibility(modelId)) return 8;
  if (isDocumentedVeo31Model(modelId)) {
    if (requiresEightSecondVeo31Duration(modelId)) return 8;
    if (!Number.isFinite(duration)) return 8;
    return allowed.reduce((closest, option) => Math.abs(option - duration) < Math.abs(closest - duration) ? option : closest, 8);
  }
  const usesReferences = isVeo31Model(modelId) && !isVeo31LiteModel(modelId) && hasVeoReferenceImages();
  if (["1080p", "4k"].includes(effectiveVideoResolution(modelId)) || usesReferences) return 8;
  if (!Number.isFinite(duration)) return allowed[0];
  return allowed.reduce((closest, option) => Math.abs(option - duration) < Math.abs(closest - duration) ? option : closest, allowed[0]);
}

function hasVeoReferenceImages() {
  return draftMedia.firstFrame ? draftMedia.videoImages.length > 0 : draftMedia.videoImages.length > 1;
}

function isDocumentedVeo31ReferenceMode(modelId = state.settings.videoModel) {
  return isDocumentedVeo31Model(modelId)
    && !usesDeepRouterDocumentedVeo31Compatibility(modelId)
    && !isDocumentedVeo31FastModel(modelId)
    && !draftMedia.firstFrame
    && !draftMedia.lastFrame
    && draftMedia.videoImages.length > 0;
}

function requiresEightSecondVeo31Duration(modelId = state.settings.videoModel) {
  return isDocumentedVeo31Model(modelId)
    && (isDocumentedVeo31ReferenceMode(modelId) || Boolean(draftMedia.firstFrame && draftMedia.lastFrame));
}

function normalizeDocumentedVeo31DraftForModel(modelId = state.settings.videoModel) {
  if (!isDocumentedVeo31Model(modelId)) return;
  draftMedia.videoReferences = [];
  draftMedia.audio = null;
  if (isDocumentedVeo31FastModel(modelId) || usesDeepRouterDocumentedVeo31Compatibility(modelId)) {
    draftMedia.videoImages = [];
    draftMedia.lastFrame = null;
  }
  else draftMedia.videoImages = draftMedia.videoImages.slice(0, 3);
}

function effectiveVideoAudio(modelId = state.settings.videoModel) {
  if (isVeo2Model(modelId)) return false;
  if (isVeoModel(modelId)) return true;
  return !!state.settings.videoAudio;
}

function imageStyleOptionsForModel() {
  const model = getModelProfile(state.settings.imageModel);
  if (model?.id === "dall-e-3") {
    return IMAGE_STYLE_OPTIONS.filter((option) => ["vivid", "natural"].includes(option.value));
  }
  if (isGptImageModel(model?.id)) return [];
  return IMAGE_STYLE_OPTIONS;
}

function setVisualOption(key, value) {
  if (!Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, key)) return;
  if (key === "videoDuration") state.settings[key] = effectiveVideoDurationForValue(value);
  else if (key === "videoCount" || key === "imageCount") state.settings[key] = clampNumber(value, 1, 4, 1);
  else if (key === "videoAudio" || key === "imageWatermark" || key === "imageSequential") state.settings[key] = value === "true";
  else if (key === "imageQuality") state.settings[key] = normalizeImageQualityForModel(state.settings.imageModel, value);
  else state.settings[key] = value;
  saveState();
  renderOutputOptions();
  renderVisualMeta();
}

function effectiveVideoDurationForValue(value) {
  const modelId = state.settings.videoModel;
  const profile = getModelProfile(modelId);
  if (isKlingModel(modelId)) return normalizeKlingDuration(value);
  if (profile?.provider === "seedance") return normalizeSeedDanceDuration(value, modelId);
  if (isSora2Model(modelId)) return normalizeSora2Duration(value, modelId);
  if (isGrokVideoModel(modelId)) return normalizeGrokVideoDuration(value, modelId);
  if (isVeoModel(modelId)) return normalizeVeoDuration(value, modelId);
  return clampNumber(value, 1, 30, 5);
}

function renderSessions() {
  const query = els.sessionSearch.value.trim().toLowerCase();
  const isVisual = activeMode === "image";
  const source = isVisual ? state.visualSessions : state.sessions;
  const sessions = source
    .filter((session) => {
      if (!query) return true;
      const inTitle = (session.title || "").toLowerCase().includes(query);
      if (isVisual) {
        const inTasks = state.visualTasks.some(
          (task) => task.sessionId === session.id && (task.prompt || "").toLowerCase().includes(query)
        );
        return inTitle || inTasks;
      }
      return inTitle || (session.messages || []).some((message) => (message.content || "").toLowerCase().includes(query));
    })
    .sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });

  if (els.sidebarRecordsCount) els.sidebarRecordsCount.textContent = String(source.length);
  const groups = groupSessions(sessions);
  els.sessionList.innerHTML = "";
  Object.entries(groups).forEach(([label, items]) => {
    if (!items.length) return;
    const heading = document.createElement("div");
    heading.className = "session-group-label";
    heading.textContent = label;
    els.sessionList.appendChild(heading);
    items.forEach((session) => els.sessionList.appendChild(isVisual ? renderVisualSessionItem(session) : renderSessionItem(session)));
  });

  if (!sessions.length) {
    const empty = document.createElement("div");
    empty.className = "session-group-label";
    empty.textContent = isVisual ? "没有匹配的创作记录" : "没有匹配的对话";
    els.sessionList.appendChild(empty);
  }
}

function renderVisualSessionItem(session) {
  const item = document.createElement("div");
  item.className = `session-item${session.id === activeVisualSessionId && activeMode === "image" ? " active" : ""}`;
  item.setAttribute("role", "button");
  item.setAttribute("tabindex", "0");
  item.setAttribute("aria-label", session.title || "新的视觉创作");

  const selectSession = () => {
    activeMode = "image";
    activeVisualSessionId = session.id;
    if (session.lastVisualMode) state.settings.visualMode = session.lastVisualMode;
    closeMobileSidebar();
    saveState();
    render();
  };
  item.addEventListener("click", selectSession);
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectSession();
    }
  });

  const taskCount = state.visualTasks.filter((task) => task.sessionId === session.id).length;
  const lastType = session.lastVisualMode === "video" ? "video" : "image";
  const text = rowTextBlock(
    session.title || "新的视觉创作",
    `${taskCount} 件作品 · ${formatTime(session.updatedAt)}`
  );
  item.classList.add("has-thumb");
  item.appendChild(rowThumb(lastType === "video" ? "▶" : "▦"));

  const actions = document.createElement("div");
  actions.className = "session-actions";
  actions.appendChild(tinyButton(session.pinned ? "★" : "☆", session.pinned ? "取消置顶" : "置顶", (event) => {
    event.stopPropagation();
    session.pinned = !session.pinned;
    session.updatedAt = Date.now();
    saveState();
    renderSessions();
  }));
  actions.appendChild(tinyButton("✎", "重命名", (event) => {
    event.stopPropagation();
    renameVisualSession(session);
  }));
  actions.appendChild(tinyButton("×", "删除", (event) => {
    event.stopPropagation();
    deleteVisualSession(session.id);
  }));

  item.appendChild(text);
  item.appendChild(sessionActionsMenu(actions));
  return item;
}

// Shared row pieces: the same 40px thumb + title/meta text block is used by
// records, the generation queue and the chat quick-jump directory.
function rowThumb(content) {
  const thumb = document.createElement("span");
  thumb.className = "row-thumb";
  thumb.setAttribute("aria-hidden", "true");
  if (content instanceof Node) thumb.appendChild(content);
  else thumb.textContent = content;
  return thumb;
}

function rowTextBlock(title, meta) {
  const block = document.createElement("div");
  block.className = "row-text";
  const titleNode = document.createElement("div");
  titleNode.className = "session-title row-title";
  titleNode.textContent = title;
  const metaNode = document.createElement("div");
  metaNode.className = "row-meta";
  metaNode.textContent = meta;
  block.appendChild(titleNode);
  block.appendChild(metaNode);
  return block;
}

function groupSessions(sessions) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;
  const previous7 = today - 7 * 86400000;
  return sessions.reduce(
    (acc, session) => {
      if (session.pinned) acc["置顶"].push(session);
      else if ((session.updatedAt || 0) >= today) acc["今天"].push(session);
      else if ((session.updatedAt || 0) >= yesterday) acc["昨天"].push(session);
      else if ((session.updatedAt || 0) >= previous7) acc["过去 7 天"].push(session);
      else acc["更早"].push(session);
      return acc;
    },
    { "置顶": [], "今天": [], "昨天": [], "过去 7 天": [], "更早": [] }
  );
}

function renderSessionItem(session) {
  const button = document.createElement("div");
  button.className = `session-item${session.id === activeSessionId && activeMode === "chat" ? " active" : ""}`;
  button.setAttribute("role", "button");
  button.setAttribute("tabindex", "0");
  button.setAttribute("aria-label", session.title || "新的会话");

  const selectSession = () => {
    activeMode = "chat";
    activeSessionId = session.id;
    closeMobileSidebar();
    saveState();
    render();
  };

  button.addEventListener("click", selectSession);
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectSession();
    }
  });

  const text = rowTextBlock(
    session.title || "新的会话",
    `${(session.messages || []).length} 条消息 · ${formatTime(session.updatedAt)}`
  );
  button.classList.add("has-thumb");
  button.appendChild(rowThumb("✦"));

  const actions = document.createElement("div");
  actions.className = "session-actions";
  actions.appendChild(tinyButton(session.pinned ? "★" : "☆", session.pinned ? "取消置顶" : "置顶", (event) => {
    event.stopPropagation();
    session.pinned = !session.pinned;
    if (session.pinned) session.pinnedAt = Date.now();
    updateSession(session);
    renderSessions();
  }));
  actions.appendChild(tinyButton("✎", "重命名", (event) => {
    event.stopPropagation();
    renameSession(session);
  }));
  actions.appendChild(tinyButton(deleteArmed === session.id ? "!" : "×", deleteArmed === session.id ? "再次点击删除" : "删除", (event) => {
    event.stopPropagation();
    deleteSession(session.id);
  }));

  button.appendChild(text);
  button.appendChild(sessionActionsMenu(actions));
  return button;
}

function sessionActionsMenu(actions) {
  const menu = document.createElement("details");
  menu.className = "session-menu";
  menu.addEventListener("click", (event) => event.stopPropagation());
  menu.addEventListener("toggle", () => {
    menu.closest(".session-item")?.classList.toggle("menu-open", menu.open);
  });
  const summary = document.createElement("summary");
  summary.textContent = "···";
  summary.title = "更多操作";
  summary.setAttribute("aria-label", "更多操作");
  menu.appendChild(summary);
  menu.appendChild(actions);
  return menu;
}

function tinyButton(text, title, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "tiny-action";
  button.textContent = text;
  button.title = title;
  button.setAttribute("aria-label", title);
  button.addEventListener("click", onClick);
  return button;
}

function renameSession(session) {
  const next = window.prompt("会话名称", session.title || "新的会话");
  if (next === null) return;
  session.title = next.trim() || "新的会话";
  updateSession(session);
  renderSessions();
}

function deleteSession(id) {
  if (deleteArmed !== id) {
    deleteArmed = id;
    renderSessions();
    setTimeout(() => {
      if (deleteArmed === id) {
        deleteArmed = null;
        renderSessions();
      }
    }, 2400);
    return;
  }
  state.sessions = state.sessions.filter((session) => session.id !== id);
  if (!state.sessions.length) createSession();
  if (activeSessionId === id) activeSessionId = state.sessions[0].id;
  deleteArmed = null;
  saveState();
  render();
}

function renameVisualSession(session) {
  const next = window.prompt("视觉创作名称", session.title || "新的视觉创作");
  if (next === null) return;
  session.title = next.trim() || "新的视觉创作";
  session.updatedAt = Date.now();
  saveState();
  render();
}

function deleteVisualSession(id) {
  const session = state.visualSessions.find((item) => item.id === id);
  if (!session || !window.confirm(`确认删除视觉创作“${session.title || "新的视觉创作"}”？`)) return;
  const removedTaskIds = state.visualTasks.filter((task) => task.sessionId === id).map((task) => task.id);
  removedTaskIds.forEach(cancelImageRequest);
  state.visualSessions = state.visualSessions.filter((session) => session.id !== id);
  state.visualTasks = state.visualTasks.filter((task) => task.sessionId !== id);
  removedTaskIds.forEach((taskId) => void deleteVisualMediaCacheForTask(taskId));
  deleteArmed = null;
  if (!state.visualSessions.length) {
    createVisualSession();
    return;
  }
  if (activeVisualSessionId === id) activeVisualSessionId = state.visualSessions[0].id;
  saveState();
  render();
}

function renderMessages() {
  const session = getActiveSession();
  const messages = session.messages || [];
  els.messages.innerHTML = "";
  els.emptyChat.hidden = messages.length > 0;
  messages.forEach((message, index) => {
    els.messages.appendChild(renderMessage(message, index));
  });
  renderChatJumpList(messages);
  requestAnimationFrame(() => {
    els.messages.scrollTop = els.messages.scrollHeight;
  });
}

// Quick-jump directory: one entry per user turn of the active chat session.
function buildChatJumpItems(messages) {
  const items = [];
  (messages || []).forEach((message, index) => {
    if (message?.role !== "user") return;
    const text = String(message.content || "").replace(/\s+/g, " ").trim();
    items.push({
      index,
      turn: items.length + 1,
      title: text ? (text.length > 40 ? `${text.slice(0, 40)}…` : text) : "（附件消息）",
    });
  });
  return items;
}

function renderChatJumpList(messages) {
  if (!els.chatJumpList) return;
  const items = buildChatJumpItems(messages);
  els.chatJumpList.innerHTML = "";
  if (els.chatJumpCount) els.chatJumpCount.textContent = `${items.length} 轮`;
  if (els.chatJumpEmpty) els.chatJumpEmpty.hidden = items.length > 0;
  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "panel-row chat-jump-item";
    button.dataset.messageIndex = String(item.index);
    button.appendChild(rowThumb(String(item.turn)));
    button.appendChild(rowTextBlock(item.title, `第 ${item.turn} 轮`));
    button.addEventListener("click", () => jumpToChatMessage(item.index));
    els.chatJumpList.appendChild(button);
  });
}

function jumpToChatMessage(index) {
  const node = els.messages.querySelector(`[data-message-index="${index}"]`);
  if (!node) return;
  if (typeof node.scrollIntoView === "function") node.scrollIntoView({ behavior: "smooth", block: "center" });
  flashHighlight(node);
}

function flashHighlight(node) {
  node.classList.add("jump-highlight");
  setTimeout(() => node.classList.remove("jump-highlight"), 1200);
}

function renderMessage(message, index) {
  const wrap = document.createElement("article");
  wrap.className = `message ${message.role}${message.error ? " error" : ""}`;
  wrap.dataset.messageIndex = String(index);

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = message.content || "";

  if (Array.isArray(message.attachments) && message.attachments.length) {
    const attachments = document.createElement("div");
    attachments.className = "message-attachments";
    attachments.innerHTML = message.attachments
      .map((item) => `<span>${escapeHtml(fileTypeLabel(item.mime || ""))} · ${escapeHtml(item.name || "文件")}</span>`)
      .join("");
    bubble.appendChild(attachments);
  }
  if (message.webSearch) {
    const web = document.createElement("div");
    web.className = "message-web-badge";
    web.textContent = message.webSearchModel ? `已联网 · ${message.webSearchModel}` : "已启用联网";
    bubble.appendChild(web);
  }

  if (message.role === "assistant") {
    const tools = document.createElement("div");
    tools.className = "message-tools";
    tools.appendChild(messageTool("复制", () => copyText(message.content || "")));
    tools.appendChild(messageTool("重试", () => regenerateFrom(index)));
    bubble.appendChild(tools);
  }

  wrap.appendChild(bubble);
  return wrap;
}

function messageTool(text, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = text === "复制" ? "copy-message" : "retry-message";
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

function isWebSearchModel(modelId) {
  return /(?:^|[-_.])search-preview(?:$|[-_.])/i.test(String(modelId || ""));
}

function resolveWebSearchModel(currentModel) {
  if (isWebSearchModel(currentModel)) return currentModel;
  const available = unique([
    ...(state.modelRecords || []).map((model) => model.id),
    ...(state.modelOptions || []),
  ]);
  const preferred = ["gpt-4o-search-preview", "gpt-4o-mini-search-preview"];
  return preferred.find((model) => available.includes(model))
    || available.find((model) => isWebSearchModel(model))
    || "gpt-4o-search-preview";
}

function submitComposer() {
  if (typeof els.composer.requestSubmit === "function") {
    els.composer.requestSubmit();
    return;
  }
  const event = new Event("submit", { bubbles: true, cancelable: true });
  els.composer.dispatchEvent(event);
}

async function onSubmit(event) {
  event.preventDefault();
  let prompt = els.promptInput.value.trim();
  if (!prompt && activeMode === "chat" && chatAttachments.length) prompt = "请分析上传的文件。";
  if (!prompt || abortController) return;
  if (!ensureApiReady()) return;
  if (activeMode === "image") {
    if (state.settings.visualMode === "video") await generateVideo(prompt);
    else await generateImage(prompt);
  } else {
    await sendChat(prompt);
  }
}

async function sendChat(prompt, retryMessages = null) {
  const settings = state.settings;
  if (!settings.chatModel) return showMissingSetting("请选择聊天模型");
  if (!settings.apiKey) return showMissingSetting("请先填写 API Key");

  const session = getActiveSession();
  const requestAttachments = retryMessages ? [] : [...chatAttachments];
  const retryUserMessage = retryMessages ? [...retryMessages].reverse().find((message) => message.role === "user") : null;
  const webSearchEnabled = retryMessages ? Boolean(retryUserMessage?.webSearch) : Boolean(settings.chatWeb);
  const requestModel = webSearchEnabled
    ? retryUserMessage?.webSearchModel || resolveWebSearchModel(settings.chatModel)
    : settings.chatModel;
  if (!retryMessages) {
    session.messages.push({
      id: generateId(),
      role: "user",
      content: prompt,
      createdAt: Date.now(),
      attachments: requestAttachments.map((item) => mediaMeta(item)),
      webSearch: webSearchEnabled,
      webSearchModel: webSearchEnabled ? requestModel : "",
    });
    chatAttachments = [];
    renderChatAttachments();
    els.promptInput.value = "";
    autoResizePrompt();
  } else {
    session.messages = retryMessages;
  }

  const assistant = { id: generateId(), role: "assistant", content: "", createdAt: Date.now() };
  session.messages.push(assistant);
  updateSession(session);
  renderMessages();
  setLoading(true);

  abortController = new AbortController();

  const requestMessages = buildChatMessages(session.messages, requestAttachments);
  const request = buildChatRequest(requestModel, requestMessages, settings, webSearchEnabled);

  try {
    const response = await fetch(apiUrl(request.endpoint), {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(request.payload),
      signal: abortController.signal,
    });

    if (!response.ok) throw new Error(await responseError(response));
    if (request.stream && response.body) await readChatStream(response, assistant, request.protocol);
    else {
      const data = await response.json();
      assistant.content = extractChatText(data) || "";
    }
    if (!assistant.content.trim()) assistant.content = "(空响应)";
  } catch (error) {
    if (error.name === "AbortError") {
      assistant.content = assistant.content || "已停止";
    } else {
      assistant.error = true;
      assistant.content = normalizeError(error);
      showToast(assistant.content, true);
    }
  } finally {
    abortController = null;
    updateSession(session);
    setLoading(false);
    renderMessages();
    renderSessions();
  }
}

function buildChatMessages(messages, attachments = []) {
  const result = [];
  const systemPrompt = state.settings.systemPrompt.trim();
  if (systemPrompt) result.push({ role: "system", content: systemPrompt });
  const compact = messages
    .filter((message) => ["user", "assistant"].includes(message.role) && message.content && !message.error)
    .slice(-Math.max(2, Number(state.settings.contextTurns || 10) * 2));
  const lastUserIndex = compact.map((message) => message.role).lastIndexOf("user");
  compact.forEach((message, index) => {
    const content = index === lastUserIndex && attachments.length ? buildChatAttachmentContent(message.content, attachments) : message.content;
    result.push({ role: message.role, content });
  });
  return result;
}

function isBananaRouterBaseUrl(baseUrl = state.settings.baseUrl) {
  try {
    return /(^|\.)bananarouter\.com$/i.test(new URL(String(baseUrl || "")).hostname);
  } catch {
    return /bananarouter\.com/i.test(String(baseUrl || ""));
  }
}

function resolveChatProtocol(modelId, baseUrl = state.settings.baseUrl) {
  if (!isBananaRouterBaseUrl(baseUrl)) return "openai";
  const id = String(modelId || "").toLowerCase();
  if (/claude|anthropic/.test(id)) return "anthropic";
  if (/gemini/.test(id)) return "gemini";
  return "openai";
}

function buildChatRequest(modelId, messages, settings, webSearchEnabled = false) {
  const protocol = resolveChatProtocol(modelId, settings.baseUrl);
  if (protocol === "anthropic") return buildAnthropicChatRequest(modelId, messages, settings);
  if (protocol === "gemini") return buildGeminiChatRequest(modelId, messages, settings);
  const payload = { model: modelId, messages };
  if (webSearchEnabled) {
    payload.stream = false;
    payload.web_search_options = {};
  } else {
    payload.temperature = clampNumber(settings.temperature, 0, 2, 0.7);
    payload.stream = !!settings.stream;
    if (settings.thinking) payload.enable_thinking = true;
  }
  return { protocol: "openai", endpoint: "/v1/chat/completions", payload, stream: Boolean(payload.stream) };
}

function buildAnthropicChatRequest(modelId, messages, settings) {
  const system = messages.filter((message) => message.role === "system").map((message) => chatContentText(message.content)).filter(Boolean).join("\n\n");
  const payload = {
    model: modelId,
    max_tokens: 4096,
    messages: messages
      .filter((message) => message.role === "user" || message.role === "assistant")
      .map((message) => ({ role: message.role, content: toAnthropicContent(message.content) })),
    temperature: clampNumber(settings.temperature, 0, 1, 0.7),
    stream: !!settings.stream,
  };
  if (system) payload.system = system;
  return { protocol: "anthropic", endpoint: "/v1/messages", payload, stream: payload.stream };
}

function buildGeminiChatRequest(modelId, messages, settings) {
  const system = messages.filter((message) => message.role === "system").map((message) => chatContentText(message.content)).filter(Boolean).join("\n\n");
  const payload = {
    contents: messages
      .filter((message) => message.role === "user" || message.role === "assistant")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: toGeminiParts(message.content),
      })),
    generationConfig: {
      temperature: clampNumber(settings.temperature, 0, 2, 0.7),
      maxOutputTokens: 4096,
    },
  };
  if (system) payload.systemInstruction = { parts: [{ text: system }] };
  const action = settings.stream ? "streamGenerateContent?alt=sse" : "generateContent";
  return {
    protocol: "gemini",
    endpoint: `/v1beta/models/${encodeURIComponent(String(modelId).replace(/^models\//, ""))}:${action}`,
    payload,
    stream: !!settings.stream,
  };
}

function chatContentText(content) {
  if (typeof content === "string") return content;
  return (Array.isArray(content) ? content : [])
    .map((part) => part?.text || "")
    .filter(Boolean)
    .join("\n");
}

function toAnthropicContent(content) {
  if (typeof content === "string") return content;
  const blocks = [];
  (Array.isArray(content) ? content : []).forEach((part) => {
    if (part?.type === "text" && part.text) {
      blocks.push({ type: "text", text: part.text });
      return;
    }
    if (part?.type === "image_url") {
      const url = typeof part.image_url === "string" ? part.image_url : part.image_url?.url;
      const inline = parseInlineDataUrl(url);
      blocks.push({
        type: "image",
        source: inline
          ? { type: "base64", media_type: inline.mime, data: inline.data }
          : { type: "url", url },
      });
      return;
    }
    if (part?.type === "file" && part.file?.file_data) {
      const inline = parseInlineDataUrl(part.file.file_data);
      if (inline) blocks.push({ type: "document", source: { type: "base64", media_type: inline.mime, data: inline.data } });
    }
  });
  return blocks.length ? blocks : "";
}

function toGeminiParts(content) {
  if (typeof content === "string") return [{ text: content }];
  const parts = [];
  (Array.isArray(content) ? content : []).forEach((part) => {
    if (part?.type === "text" && part.text) {
      parts.push({ text: part.text });
      return;
    }
    const source = part?.type === "image_url"
      ? (typeof part.image_url === "string" ? part.image_url : part.image_url?.url)
      : part?.type === "file" ? part.file?.file_data : "";
    if (!source) return;
    const inline = parseInlineDataUrl(source);
    if (inline) parts.push({ inlineData: { mimeType: inline.mime, data: inline.data } });
    else if (/^https?:\/\//i.test(source)) parts.push({ fileData: { fileUri: source } });
  });
  return parts.length ? parts : [{ text: "" }];
}

function parseInlineDataUrl(value) {
  const match = String(value || "").match(/^data:([^;,]+);base64,([\s\S]+)$/i);
  return match ? { mime: match[1], data: match[2].replace(/\s/g, "") } : null;
}

function buildChatAttachmentContent(prompt, attachments) {
  let text = prompt;
  const parts = [];
  attachments.forEach((attachment) => {
    if (attachment.text) {
      text += `\n\n文件：${attachment.name}\n---\n${attachment.text.slice(0, 120000)}\n---`;
    }
  });
  parts.push({ type: "text", text });
  attachments.forEach((attachment) => {
    if (attachment.mime.startsWith("image/")) {
      parts.push({ type: "image_url", image_url: { url: attachment.dataUrl } });
    } else if (!attachment.text) {
      parts.push({
        type: "file",
        file: {
          filename: attachment.name,
          file_data: attachment.dataUrl,
        },
      });
    }
  });
  return parts;
}

async function readChatStream(response, assistant, protocol = "openai") {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        const content = extractChatStreamText(json, protocol);
        if (content) {
          assistant.content += content;
          patchLastAssistant(assistant.content);
        }
      } catch {
        // Ignore malformed heartbeat lines.
      }
    }
  }
}

function extractChatStreamText(data, protocol = "openai") {
  if (protocol === "anthropic") {
    return data?.type === "content_block_delta" ? data?.delta?.text || "" : "";
  }
  if (protocol === "gemini") {
    return (data?.candidates?.[0]?.content?.parts || []).map((part) => part?.text || "").join("");
  }
  const delta = data?.choices?.[0]?.delta || {};
  return delta.content || delta.reasoning_content || data?.choices?.[0]?.text || "";
}

function patchLastAssistant(content) {
  const bubbles = els.messages.querySelectorAll(".message.assistant .bubble");
  const bubble = bubbles[bubbles.length - 1];
  if (!bubble) return;
  const tools = bubble.querySelector(".message-tools");
  bubble.textContent = content;
  if (tools) bubble.appendChild(tools);
  els.messages.scrollTop = els.messages.scrollHeight;
}

function extractChatText(data) {
  return (
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    data?.output_text ||
    (data?.content || []).map?.((part) => part?.text || "").join("") ||
    (data?.candidates?.[0]?.content?.parts || []).map((part) => part?.text || "").join("") ||
    ""
  );
}

async function regenerateFrom(index) {
  const session = getActiveSession();
  const messages = session.messages.slice(0, index);
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  if (!lastUser) return;
  await sendChat(lastUser.content, messages);
}

async function generateImage(prompt) {
  const settings = state.settings;
  if (!settings.imageModel) return showMissingSetting("请选择图像模型");
  if (!settings.apiKey) return showMissingSetting("请先填写 API Key");

  const references = draftMedia.imageReferences;
  const requestPrompt = buildVisualContextPrompt(prompt);
  const isEdit = imageGenerationModeForReferences(references) === "image-to-image";
  syncImageModeFromReferences(references);

  els.promptInput.value = "";
  autoResizePrompt();

  const task = {
    id: generateId(),
    type: "image",
    sessionId: activeVisualSessionId,
    prompt,
    contextApplied: requestPrompt !== prompt,
    model: settings.imageModel,
    provider: getModelProfile(settings.imageModel)?.provider || "custom",
    createdAt: Date.now(),
    status: "running",
    media: [],
    params: imageTaskParams(isEdit),
    references: references.map((item) => mediaMeta(item)),
  };
  const controller = new AbortController();
  activeImageRequests.set(task.id, controller);
  state.visualTasks.unshift(task);
  updateVisualSession(getActiveVisualSession(), prompt);
  saveState();
  renderImages();
  renderSessions();
  syncImageRequestControls();

  try {
    const requestReferences = await prepareGrokImageReferences(references, settings.imageModel);
    const request = buildImageRequest(requestPrompt, requestReferences, isEdit);
    task.requestMode = request.label;
    const response = await fetchImageRequestWithRetry(request, task, controller.signal);
    if (task.retryCount) task.rawStatus = "自动重试后已连接上游";
    const data = await readImageGenerationResponse(response, task);
    task.media = unique([...(task.media || []), ...extractCompletedImageUrls(data)]);
    task.jobId = extractImageJobId(data);
    task.rawStatus = extractTaskStatus(data) || task.rawStatus;
    task.responseKeys = responseFieldSummary(data);
    if (task.media.length) {
      task.status = "done";
      await cacheVisualTaskMedia(task);
      showToast(`已生成 ${task.media.length} 张图片`);
    } else {
      task.status = "empty";
      const taskHint = task.jobId ? `，仅返回了任务 ID ${task.jobId}` : "";
      throw new Error(`图片接口已结束，但没有返回可显示的图片${taskHint}。响应字段：${task.responseKeys || "无"}`);
    }
  } catch (error) {
    task.status = error.name === "AbortError" ? "stopped" : "error";
    task.error = error.name === "AbortError" ? "已停止" : normalizeError(error);
    if (error.name !== "AbortError") showToast(task.error, true);
  } finally {
    activeImageRequests.delete(task.id);
    saveState();
    syncImageRequestControls();
    renderImages();
    renderVisualMeta();
  }
}

function imageTaskParams(isEdit) {
  const settings = state.settings;
  return {
    mode: isEdit ? "图生图" : "文生图",
    size: effectiveImageOutputSize(settings.imageModel),
    aspectRatio: effectiveImageAspectRatio(settings.imageModel),
    quality: normalizeImageQualityForModel(settings.imageModel, settings.imageQuality),
    style: settings.imageStyle,
    count: clampNumber(settings.imageCount, 1, 4, 1),
  };
}

async function prepareGrokImageReferences(references, modelId = state.settings.imageModel) {
  if (!isGrokImagineImageModel(modelId) || references.length !== 1) return references;
  const targetRatio = parseAspectRatio(effectiveImageAspectRatio(modelId));
  const reference = references[0];
  if (!targetRatio || !reference?.dataUrl?.startsWith("data:image/")) return references;
  try {
    const image = await loadImageForCanvas(reference.dataUrl);
    const sourceRatio = image.naturalWidth / image.naturalHeight;
    if (Math.abs(sourceRatio - targetRatio) < 0.01) return references;
    const longestSide = Math.min(2048, Math.max(image.naturalWidth, image.naturalHeight));
    const width = targetRatio >= 1 ? longestSide : Math.max(1, Math.round(longestSide * targetRatio));
    const height = targetRatio >= 1 ? Math.max(1, Math.round(longestSide / targetRatio)) : longestSide;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return references;
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = Math.round(image.naturalWidth * scale);
    const drawHeight = Math.round(image.naturalHeight * scale);
    context.drawImage(image, Math.round((width - drawWidth) / 2), Math.round((height - drawHeight) / 2), drawWidth, drawHeight);
    const blob = await canvasToBlob(canvas, "image/png");
    if (!blob) return references;
    const name = `${String(reference.name || "reference").replace(/\.[^.]+$/, "")}-${effectiveImageAspectRatio(modelId).replace(":", "x")}.png`;
    return [await readMediaFile(new File([blob], name, { type: "image/png" }))];
  } catch {
    return references;
  }
}

function parseAspectRatio(value) {
  const match = String(value || "").match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (!match) return 0;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return width > 0 && height > 0 ? width / height : 0;
}

function loadImageForCanvas(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("无法读取参考图片尺寸"));
    image.src = source;
  });
}

function canvasToBlob(canvas, type) {
  return new Promise((resolve) => canvas.toBlob(resolve, type));
}

function buildImageRequest(prompt, references, isEdit) {
  const settings = state.settings;
  const model = getModelProfile(settings.imageModel);
  if (isGrokImagineImageModel(settings.imageModel)) {
    return buildGrokImageRequest(prompt, references, isEdit, model);
  }
  if (isSeedreamModel(settings.imageModel)) {
    return buildSeedreamImageRequest(prompt, references, model);
  }
  const style = resolveImageApiStyle(model);
  if (style === "gemini") {
    return buildGeminiImageRequest(prompt, references, model);
  }
  if (isEdit && references.length) {
    return buildOpenAIImageEditRequest(prompt, references);
  }
  return buildOpenAIImageGenerationRequest(prompt, model);
}

function seedreamSizeFromTier(tier, aspect) {
  const target = { "1K": 1024, "2K": 2048, "4K": 4096 }[tier] || 2048;
  const [aspectWidth, aspectHeight] = String(aspect || "1:1").split(":").map(Number);
  const ratio = aspectWidth > 0 && aspectHeight > 0 ? aspectWidth / aspectHeight : 1;
  const area = target * target;
  const align = (value) => Math.max(64, Math.round(value / 16) * 16);
  const width = align(Math.sqrt(area * ratio));
  const height = align(area / width);
  return `${width}x${height}`;
}

function buildSeedreamImageRequest(prompt, references, model) {
  const settings = state.settings;
  const tier = SEEDREAM_SIZE_OPTIONS.some((option) => option.value === settings.imageSize)
    ? settings.imageSize
    : "2K";
  const count = clampNumber(settings.imageCount, 1, 4, 1);
  const payload = {
    model: settings.imageModel,
    prompt: imagePromptWithSelectedStyle(prompt, settings.imageModel),
    size: seedreamSizeFromTier(tier, effectiveImageAspectRatio(settings.imageModel)),
    n: count,
    response_format: "url",
    watermark: !!settings.imageWatermark,
    sequential_image_generation: settings.imageSequential ? "auto" : "disabled",
  };
  if (settings.imageSequential) {
    payload.sequential_image_generation_options = { max_images: count };
  }
  if (references.length) {
    payload.image = references.map((reference) => reference.dataUrl);
  }
  return {
    label: `${model?.vendor || "Doubao"} Seedream 图片${references.length ? "编辑" : "生成"}`,
    endpoint: settings.imageEndpoint || DEFAULT_SETTINGS.imageEndpoint,
    headers: authHeaders(),
    body: JSON.stringify(payload),
  };
}

function buildGrokImageRequest(prompt, references, isEdit, model) {
  const settings = state.settings;
  const editing = isEdit && references.length > 0;
  const payload = {
    model: settings.imageModel,
    prompt,
    n: clampNumber(settings.imageCount, 1, 4, 1),
    aspect_ratio: effectiveImageAspectRatio(settings.imageModel),
    resolution: grokImageResolution(),
    response_format: "url",
  };
  if (editing) {
    const images = references.slice(0, 8).map((reference) => ({ url: reference.dataUrl }));
    if (images.length === 1) payload.image = images[0];
    else payload.images = images;
  }
  return {
    label: `${model?.vendor || "xAI"} 图片${editing ? "编辑" : "生成"}`,
    endpoint: editing
      ? settings.imageEditEndpoint || DEFAULT_SETTINGS.imageEditEndpoint
      : settings.imageEndpoint || DEFAULT_SETTINGS.imageEndpoint,
    headers: authHeaders(),
    body: JSON.stringify(payload),
  };
}

function grokImageResolution() {
  const quality = String(state.settings.imageQuality || "").toLowerCase();
  if (["1k", "2k"].includes(quality)) return quality;
  const size = String(state.settings.imageSize || "").toLowerCase();
  return size === "2k" ? "2k" : "1k";
}

function buildOpenAIImageGenerationRequest(prompt, model) {
  const settings = state.settings;
  const isGptImage = isGptImageModel(settings.imageModel);
  const payload = {
    model: settings.imageModel,
    prompt: imagePromptWithSelectedStyle(prompt, settings.imageModel),
    size: imageRequestSize(settings.imageModel),
    n: model?.id === "dall-e-3" ? 1 : clampNumber(settings.imageCount, 1, 4, 1),
  };
  if (!isGptImage) payload.response_format = "url";
  applyImageTuning(payload, model, "openai");
  return {
    label: "OpenAI 兼容图片生成",
    endpoint: settings.imageEndpoint || DEFAULT_SETTINGS.imageEndpoint,
    headers: authHeaders(),
    body: JSON.stringify(payload),
  };
}

async function fetchImageRequestWithRetry(request, task, signal) {
  const retryableModel = /^gpt-image(?:$|[-_.])/i.test(String(task?.model || ""));
  const maxAttempts = retryableModel ? 2 : 1;
  let lastError = "";
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await fetch(apiUrl(request.endpoint), {
      method: "POST",
      headers: request.headers,
      body: request.body,
      signal,
    });
    if (response.ok) return response;
    const message = await responseError(response);
    lastError = message;
    if (attempt + 1 >= maxAttempts || !isRetryableImageError(response.status, message)) {
      throw new Error(attempt > 0 ? `${message}（已自动重试 1 次）` : message);
    }
    task.retryCount = attempt + 1;
    task.rawStatus = "上游通道暂时不可用，正在自动重试 1/1";
    saveState();
    renderImages();
    const retryAfter = Number(response.headers.get("retry-after"));
    await waitWithSignal(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1000, 5000) : 1600, signal);
  }
  throw new Error(lastError || "图片生成请求失败");
}

function isRetryableImageError(status, message = "") {
  return status === 429
    || status >= 500
    || /upstream model service error|try again later|temporar(?:y|ily) unavailable|service unavailable/i.test(String(message));
}

function waitWithSignal(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}

async function readImageGenerationResponse(response, task) {
  const contentType = String(response.headers.get("content-type") || "").toLowerCase();
  if (!isGptImageModel(task?.model) && contentType.includes("text/event-stream") && response.body?.getReader) {
    return readImageEventStream(response.body, task);
  }
  const text = await response.text();
  return parseImageResponseText(text);
}

async function readImageEventStream(stream, task) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const events = [];
  let buffer = "";

  const consume = (flush = false) => {
    buffer = buffer.replace(/\r\n/g, "\n");
    const frames = buffer.split("\n\n");
    const tail = frames.pop() || "";
    if (flush) {
      if (tail) frames.push(tail);
      buffer = "";
    } else {
      buffer = tail;
    }
    frames.forEach((frame) => {
      const payloadText = frame
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n")
        .trim();
      if (!payloadText || payloadText === "[DONE]") return;
      const payload = parseJsonPayload(payloadText);
      if (!payload) return;
      const message = extractErrorMessage(payload);
      if (/^(?:error|upstream_error)$/i.test(String(payload.type || "")) || payload.error) {
        throw new Error(message || "图片生成流返回错误");
      }
      events.push(payload);
      const media = extractImageUrls(payload);
      if (media.length) {
        const isPartial = /partial/i.test(String(payload.type || ""));
        task.media = isPartial || task.previewingPartial ? media : unique([...(task.media || []), ...media]);
        task.previewingPartial = isPartial;
        if (!isPartial) {
          task.status = "done";
          saveState();
        }
        task.rawStatus = payload.type || payload.status || "正在接收图片";
        renderImages();
      }
    });
  };

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    consume(done);
    if (done) break;
  }
  return { events };
}

function extractCompletedImageUrls(data) {
  if (!Array.isArray(data?.events)) return extractImageUrls(data);
  const completedEvents = data.events.filter((event) => !/partial/i.test(String(event?.type || "")));
  const completed = extractImageUrls(completedEvents);
  return completed.length ? completed : extractImageUrls(data.events);
}

function parseImageResponseText(text) {
  const value = String(text || "").trim();
  if (!value) throw new Error("图片接口返回了空响应");
  const json = parseJsonPayload(value);
  if (json) return json;
  const events = [];
  value.split(/\r?\n/).forEach((line) => {
    const payloadText = line.replace(/^data:\s*/, "").trim();
    if (!payloadText || payloadText === "[DONE]") return;
    const payload = parseJsonPayload(payloadText);
    if (payload) events.push(payload);
  });
  if (events.length) return { events };
  throw new Error(`无法解析图片接口响应：${value.slice(0, 160)}`);
}

function parseJsonPayload(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function responseFieldSummary(data) {
  if (Array.isArray(data)) return `数组(${data.length})`;
  if (!data || typeof data !== "object") return typeof data;
  const keys = Object.keys(data);
  if (Array.isArray(data.events)) return `${keys.join(", ")} / 事件(${data.events.length})`;
  return keys.join(", ");
}

function buildOpenAIImageEditRequest(prompt, references) {
  const settings = state.settings;
  const model = getModelProfile(settings.imageModel);
  const form = new FormData();
  form.append("model", settings.imageModel);
  form.append("prompt", imagePromptWithSelectedStyle(prompt, settings.imageModel));
  form.append("size", imageRequestSize(settings.imageModel));
  form.append("n", String(model?.id === "dall-e-3" ? 1 : clampNumber(settings.imageCount, 1, 4, 1)));
  const quality = normalizeImageQualityForModel(settings.imageModel, settings.imageQuality);
  if (quality !== "auto") form.append("quality", normalizeQualityForModel(quality, model));
  if (isGptImageModel(settings.imageModel)) {
    const background = gptImageBackgroundValue();
    form.append("background", background);
    form.append("output_format", gptImageOutputFormatValue(background));
  }
  if (settings.imageStyle !== "auto" && !isGptImageModel(settings.imageModel)) form.append("style", settings.imageStyle);
  const imageField = isBananaRouterBaseUrl() ? "image[]" : "image";
  references.forEach((reference) => {
    form.append(imageField, reference.file, reference.name);
  });
  return {
    label: `${model?.vendor || "OpenAI"} 图片编辑`,
    endpoint: settings.imageEditEndpoint || DEFAULT_SETTINGS.imageEditEndpoint,
    headers: authHeaders(false),
    body: form,
  };
}

function buildGeminiImageRequest(prompt, references, model) {
  const route = resolveGeminiImageRoute(state.settings.imageModel);
  if (route === "native") {
    return buildGeminiNativeImageRequest(prompt, references, model);
  }
  return buildGeminiChatImageRequest(prompt, references, model);
}

function buildGeminiChatImageRequest(prompt, references, model) {
  const settings = state.settings;
  const content = [{ type: "text", text: imagePromptWithSelectedStyle(prompt, settings.imageModel) }];
  references.forEach((reference) => {
    content.push({
      type: "image_url",
      image_url: { url: reference.dataUrl },
    });
  });
  const payload = {
    max_tokens: 4096,
    model: settings.imageModel,
    messages: [{ role: "user", content }],
    stream: false,
  };
  return {
    label: `${model?.vendor || "Gemini"} Chat 图片${references.length ? "编辑" : "生成"}`,
    endpoint: "/v1/chat/completions",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  };
}

function buildGeminiNativeImageRequest(prompt, references, model) {
  const settings = state.settings;
  const modelId = String(settings.imageModel || "").replace(/^models\//, "");
  const parts = [{ text: imagePromptWithSelectedStyle(prompt, modelId) }];
  references.forEach((reference) => {
    const inline = geminiInlineImage(reference);
    parts.push(isBananaRouterBaseUrl()
      ? { inlineData: { mimeType: inline.mime, data: inline.data } }
      : { inline_data: { mime_type: inline.mime, data: inline.data } });
  });
  const generationConfig = {
    responseModalities: ["TEXT", "IMAGE"],
  };
  if (supportsGeminiNativeImageConfig(modelId)) {
    generationConfig.imageConfig = {
      aspectRatio: effectiveImageAspectRatio(modelId),
    };
    const imageSize = geminiNativeImageSize();
    if (imageSize) generationConfig.imageConfig.imageSize = imageSize;
  }
  const payload = {
    contents: [{ role: "user", parts }],
    generationConfig,
  };
  return {
    label: `${model?.vendor || "Gemini"} generateContent ${references.length ? "编辑" : "生成"}`,
    endpoint: `/v1beta/models/${encodeURIComponent(modelId)}:generateContent`,
    headers: authHeaders(),
    body: JSON.stringify(payload),
  };
}

function resolveGeminiImageRoute(modelId) {
  const id = String(modelId || "").replace(/^models\//, "").toLowerCase();
  if (isBananaRouterBaseUrl()) return "native";
  if (id === "gemini-3.1-flash-image-preview") return "chat";
  return isGemini3ProImageModel(id)
    || supportsGeminiNativeImageConfig(id)
    || /^gemini-2\.0-.*image-generation$/i.test(id)
    ? "native"
    : "chat";
}

function isGemini3ProImageModel(modelId) {
  return /^gemini-3(?:\.0)?-pro-image(?:-preview)?$/i.test(String(modelId || ""));
}

function supportsGeminiNativeImageConfig(modelId) {
  const id = String(modelId || "").toLowerCase();
  return /gemini-(?:2\.5|3(?:\.1)?)-.*image/.test(id) || /nano[-_.]?banana[-_.]?2(?:$|[-_.])/.test(id);
}

function geminiInlineImage(reference) {
  const dataUrl = String(reference?.dataUrl || "");
  const match = dataUrl.match(/^data:([^;,]+);base64,([\s\S]+)$/i);
  if (!match) throw new Error(`参考图 ${reference?.name || ""} 缺少有效的 Base64 数据`);
  return {
    mime: reference?.mime || match[1] || "image/png",
    data: match[2].replace(/\s/g, ""),
  };
}

function geminiNativeImageSize() {
  const modelId = String(state.settings.imageModel || "").toLowerCase();
  if (isLegacyGeminiImageModel(modelId)) return "";
  if (/gemini-2\.0|gemini-3\.1-flash-lite-image/.test(modelId)) return "1K";
  const selected = String(state.settings.imageSize || "").toUpperCase();
  const supported = /gemini-3\.1-flash-image/.test(modelId) ? ["0.5K", "1K", "2K", "4K"] : ["1K", "2K", "4K"];
  if (supported.includes(selected)) return selected;
  const quality = String(state.settings.imageQuality || "auto").toLowerCase();
  if (quality === "high" || quality === "hd") return "4K";
  if (quality === "medium") return "2K";
  if (quality === "low" || quality === "standard") return "1K";
  const dimensions = String(effectiveImageSize()).split("x").map(Number);
  return Math.max(...dimensions) > 1024 ? "2K" : "1K";
}

function gptImageBackgroundValue() {
  const value = String(state.settings.imageBackground || "auto").toLowerCase();
  return GPT_IMAGE_BACKGROUND_OPTIONS.some((option) => option.value === value) ? value : "auto";
}

function gptImageOutputFormatValue(background = gptImageBackgroundValue()) {
  const value = String(state.settings.imageOutputFormat || "png").toLowerCase();
  const format = GPT_IMAGE_FORMAT_OPTIONS.some((option) => option.value === value) ? value : "png";
  return background === "transparent" && format === "jpeg" ? "png" : format;
}

function applyImageTuning(payload, model, style) {
  const settings = state.settings;
  const quality = normalizeImageQualityForModel(settings.imageModel, settings.imageQuality);
  if (quality !== "auto") {
    payload.quality = normalizeQualityForModel(quality, model);
  }
  if (settings.imageStyle !== "auto") {
    if (style === "gemini") payload.style_preset = settings.imageStyle;
    else if (!isGptImageModel(settings.imageModel)) payload.style = settings.imageStyle;
  }
  if (isGptImageModel(settings.imageModel)) {
    payload.background = gptImageBackgroundValue();
    payload.output_format = gptImageOutputFormatValue(payload.background);
  }
  if (style !== "openai" || model?.provider !== "openai") {
    payload.aspect_ratio = effectiveImageAspectRatio(settings.imageModel);
  }
}

function imagePromptWithSelectedStyle(prompt, modelId = state.settings.imageModel) {
  const profile = getModelProfile(modelId);
  const isGemini = profile?.provider === "gemini" || /gemini|nano[-_.]?banana/i.test(String(modelId || ""));
  const stylePrompts = {
    natural: "自然真实，光线与材质表现克制",
    vivid: "色彩鲜明，视觉冲击力强",
    cinematic: "电影感构图、灯光与色彩分级",
    illustration: "精致插画风格，线条与层次清晰",
    photorealistic: "照片级写实，细节和物理质感可信",
  };
  const qualityPrompts = {
    low: "快速草稿质量，减少不必要的细节",
    standard: "标准质量，主体和构图清晰",
    medium: "均衡质量，细节完整且画面稳定",
    high: "高质量精细渲染，强化纹理、光影和边缘细节",
    hd: "高清精细渲染，强化纹理、光影和边缘细节",
  };
  const controls = [];
  const stylePrompt = stylePrompts[state.settings.imageStyle];
  if (stylePrompt && isGemini) controls.push(`风格：${stylePrompt}`);
  if (isGemini) {
    const qualityPrompt = qualityPrompts[normalizeImageQualityForModel(modelId, state.settings.imageQuality)];
    if (qualityPrompt) controls.push(`质量：${qualityPrompt}`);
    const size = geminiNativeImageSize();
    if (size) controls.push(`输出尺寸：${size}`);
    controls.push(`画面比例：${effectiveImageAspectRatio(modelId)}`);
  }
  return controls.length ? `${prompt}\n\n生成要求：${controls.join("；")}。` : prompt;
}

function videoPromptWithSelectedStyle(prompt, modelId = state.settings.videoModel) {
  if (state.settings.videoStyle === "auto") return prompt;
  const stylePrompts = {
    cinematic: "电影感构图、镜头运动、灯光与色彩分级",
    realistic: "真实自然的材质、光照、动作和物理表现",
    animation: "动画风格，动作连贯，造型稳定",
    commercial: "商业广告质感，主体突出，画面精致",
    documentary: "纪实摄影风格，自然镜头和环境氛围",
  };
  const style = stylePrompts[state.settings.videoStyle];
  return style ? `${prompt}\n\n视频风格要求：${style}。` : prompt;
}

async function generateVideo(prompt) {
  const settings = state.settings;
  if (!settings.videoModel) return showMissingSetting("请选择视频模型");
  if (!settings.apiKey) return showMissingSetting("请先填写 API Key");

  const requestPrompt = buildVisualContextPrompt(prompt);
  const count = effectiveVideoCount(settings.videoModel);
  els.promptInput.value = "";
  autoResizePrompt();
  setLoading(true);
  abortController = new AbortController();

  const profile = getModelProfile(settings.videoModel);
  const createdAt = Date.now();
  const tasks = Array.from({ length: count }, (_, index) => ({
    id: generateId(),
    type: "video",
    sessionId: activeVisualSessionId,
    prompt,
    contextApplied: requestPrompt !== prompt,
    model: settings.videoModel,
    provider: profile?.provider || "custom",
    createdAt: createdAt + index,
    status: "running",
    media: [],
    params: videoTaskParams(),
    references: videoReferenceMeta(),
    apiBaseUrl: settings.baseUrl,
  }));
  state.visualTasks.unshift(...tasks);
  updateVisualSession(getActiveVisualSession(), prompt);
  saveState();
  renderImages();
  renderSessions();

  try {
    await Promise.all(tasks.map((task) => submitVideoTask(task, requestPrompt, profile, abortController.signal)));
    const completed = tasks.filter((task) => task.status === "done").length;
    const submitted = tasks.filter((task) => task.status === "submitted").length;
    const failed = tasks.filter((task) => ["error", "stopped", "empty"].includes(task.status)).length;
    if (count === 1) {
      const task = tasks[0];
      if (task.status === "done") showToast(`已生成 ${task.media.length} 个视频`);
      else if (task.status === "submitted") showToast("视频任务已提交，正在轮询结果");
      else if (task.error) showToast(task.error, true);
    } else if (failed === count) {
      showToast(tasks.find((task) => task.error)?.error || "视频任务提交失败", true);
    } else {
      showToast(`已创建 ${completed + submitted}/${count} 个视频任务${failed ? `，${failed} 个失败` : ""}`, failed > 0);
    }
  } finally {
    abortController = null;
    saveState();
    setLoading(false);
    renderImages();
    renderVisualMeta();
  }
}

async function submitVideoTask(task, requestPrompt, profile, signal) {
  try {
    let request = buildVideoRequest(requestPrompt, profile);
    task.requestMode = request.label;
    task.requestEndpoint = request.endpoint;
    let response = await fetch(apiUrl(request.endpoint), {
      method: "POST",
      headers: request.headers,
      body: request.body,
      signal,
    });
    if (!response.ok) {
      const initialError = await responseError(response);
      const fallbackRequest = buildGrokVideoRouteFallbackRequest(requestPrompt, profile, request, initialError)
        || buildGrokTextVideoFallbackRequest(requestPrompt, profile, request, initialError);
      if (!fallbackRequest) throw new Error(initialError);
      request = fallbackRequest;
      task.requestMode = request.label;
      task.requestEndpoint = request.endpoint;
      task.rawStatus = "官方视频接口不可用，已切换兼容 Multipart 通道";
      response = await fetch(apiUrl(request.endpoint), {
        method: "POST",
        headers: request.headers,
        body: request.body,
        signal,
      });
      if (!response.ok) throw new Error(await responseError(response));
    }
    const data = await parseApiJsonResponse(response, "视频创建接口");
    task.jobId = extractJobId(data);
    task.rawStatus = extractTaskStatus(data) || task.rawStatus;
    const media = videoResultUrlsForTask(data, task);
    if (media.length) {
      task.media = await materializeVideoUrls(media, task);
      task.status = "done";
    } else if (task.jobId) {
      task.status = "submitted";
      pollVideoTask(task.id, { attempts: VIDEO_TASK_POLL_ATTEMPTS });
    } else {
      task.status = "empty";
      throw new Error("视频接口未返回视频或任务 ID。请检查端点返回格式。");
    }
  } catch (error) {
    task.status = error.name === "AbortError" ? "stopped" : "error";
    task.error = error.name === "AbortError" ? "已停止" : normalizeError(error);
  } finally {
    saveState();
    renderImages();
  }
}

function buildVideoRequest(prompt, profile) {
  const settings = state.settings;
  const apiStyle = resolveVideoApiStyle(profile);
  if (profile?.provider === "kling") return buildKlingVideoRequest(prompt, profile);
  if (profile?.provider === "xai") return buildGrokVideoRequest(prompt, profile);
  if (profile?.provider === "sora") return buildSoraVideoRequest(prompt, profile);
  if (profile?.provider === "seedance") return buildSeedDanceVideoRequest(prompt, profile);
  if (profile?.provider === "veo" && usesDeepRouterVeoCompatibility(settings.videoModel)) {
    return buildCompatibleMultipartVideoRequest(prompt, profile);
  }
  if (profile?.provider === "veo" && usesDeepRouterDocumentedVeo31Compatibility(settings.videoModel)) {
    return buildDeepRouterVeo31VideoRequest(prompt, profile);
  }
  if (profile?.provider === "veo" && isDocumentedVeo31Model(settings.videoModel)) {
    return buildVeoVideoRequest(prompt, profile);
  }
  if (profile?.provider === "veo" && usesNewApiVeoTask(settings.videoModel)) {
    return buildNewApiVeoVideoRequest(prompt, profile);
  }
  if (profile?.provider === "veo" && apiStyle === "gemini") return buildVeoVideoRequest(prompt, profile);
  if (profile?.provider === "muse") return buildMuseVideoRequest(prompt, profile);
  const references = buildVideoReferences();
  return {
    label: `${profile?.vendor || "通用"} 视频参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: authHeaders(),
    body: JSON.stringify({
      model: settings.videoModel,
      prompt,
      aspect_ratio: settings.videoAspectRatio,
      resolution: settings.videoResolution,
      duration: clampNumber(settings.videoDuration, 1, 30, 5),
      duration_seconds: clampNumber(settings.videoDuration, 1, 30, 5),
      style: settings.videoStyle === "auto" ? undefined : settings.videoStyle,
      audio: !!settings.videoAudio,
      generate_audio: !!settings.videoAudio,
      first_frame: draftMedia.firstFrame ? mediaPayload(draftMedia.firstFrame) : undefined,
      last_frame: draftMedia.lastFrame ? mediaPayload(draftMedia.lastFrame) : undefined,
      references,
      response_format: "url",
    }),
  };
}

function buildMuseVideoRequest(prompt, profile) {
  const settings = state.settings;
  const modelId = settings.videoModel;
  const duration = normalizeMuseDuration(settings.videoDuration);
  const references = buildVideoReferences();
  return {
    label: `${profile?.vendor || "Muse"} 视频参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: authHeaders(),
    body: JSON.stringify({
      model: modelId,
      prompt,
      aspect_ratio: effectiveVideoAspectRatio(modelId),
      resolution: effectiveVideoResolution(modelId),
      duration,
      duration_seconds: duration,
      style: settings.videoStyle === "auto" ? undefined : settings.videoStyle,
      audio: !!settings.videoAudio,
      generate_audio: !!settings.videoAudio,
      first_frame: draftMedia.firstFrame ? mediaPayload(draftMedia.firstFrame) : undefined,
      last_frame: draftMedia.lastFrame ? mediaPayload(draftMedia.lastFrame) : undefined,
      references,
      response_format: "url",
    }),
  };
}

function buildKlingVideoRequest(prompt, profile) {
  const modelId = state.settings.videoModel;
  const omni = isKlingOmniModel(modelId);
  const firstFrame = draftMedia.firstFrame || (!omni ? draftMedia.videoImages[0] : null);
  const referenceImages = omni ? draftMedia.videoImages : [];
  if (draftMedia.lastFrame && !draftMedia.firstFrame) {
    throw new Error("Kling 尾帧必须与首帧同时使用");
  }
  if (!omni && draftMedia.lastFrame) {
    throw new Error("kling-3.0 不支持尾帧，请使用 kling-3.0-omni");
  }
  if (!omni && (draftMedia.videoImages.length > 1 || (draftMedia.firstFrame && draftMedia.videoImages.length))) {
    throw new Error("kling-3.0 图生视频仅支持一张首帧图片");
  }
  if (draftMedia.videoReferences.length || draftMedia.audio) {
    throw new Error("Kling 3.0 当前仅支持图片输入和原生音频生成");
  }
  const maxReferences = draftMedia.firstFrame && draftMedia.lastFrame ? 2 : 3;
  if (omni && referenceImages.length > maxReferences) {
    throw new Error(`Kling Omni 当前组合最多支持 ${maxReferences} 张参考图`);
  }

  const styledPrompt = videoPromptWithSelectedStyle(prompt, modelId);
  const settings = {
    duration: effectiveVideoDuration(modelId),
    resolution: effectiveVideoResolution(modelId),
    audio: effectiveVideoAudio(modelId) ? "native" : "off",
  };
  const textToVideo = !omni && !firstFrame;
  if (textToVideo || omni) settings.aspect_ratio = effectiveVideoAspectRatio(modelId);
  const contents = [{ type: "prompt", text: styledPrompt }];
  if (firstFrame) contents.push(klingImageContent("first_frame", firstFrame, omni ? "first_frame_1" : ""));
  if (omni && draftMedia.lastFrame) {
    contents.push(klingImageContent("last_frame", draftMedia.lastFrame, "last_frame_1"));
  }
  if (omni) {
    referenceImages.forEach((item, index) => {
      contents.push(klingImageContent("refer_image", item, `image_${index + 1}`));
    });
  }

  if (!isBananaRouterBaseUrl()) {
    const duration = effectiveVideoDuration(modelId);
    const aspectRatio = effectiveVideoAspectRatio(modelId);
    const resolution = effectiveVideoResolution(modelId);
    return {
      label: `${profile?.vendor || "Kling"} NewAPI 兼容参数`,
      endpoint: "/v1/video/generations",
      headers: authHeaders(),
      body: JSON.stringify({
        model: modelId,
        prompt: styledPrompt,
        contents,
        settings,
        options: {},
        duration,
        duration_seconds: duration,
        seconds: String(duration),
        aspect_ratio: aspectRatio,
        ratio: aspectRatio,
        resolution,
        audio: settings.audio,
        generate_audio: settings.audio === "native",
      }),
    };
  }

  if (textToVideo) {
    return {
      label: `${profile?.vendor || "Kling"} 文生视频参数`,
      endpoint: "/text-to-video/kling-3.0",
      headers: authHeaders(),
      body: JSON.stringify({ prompt: styledPrompt, settings, options: {} }),
    };
  }

  return {
    label: `${profile?.vendor || "Kling"} ${omni ? "Omni" : "图生视频"}参数`,
    endpoint: omni ? "/omni-video/kling-3.0-omni" : "/image-to-video/kling-3.0",
    headers: authHeaders(),
    body: JSON.stringify({ contents, settings, options: {} }),
  };
}

function klingImageContent(type, item, id) {
  if (!item?.dataUrl) throw new Error("Kling 图片输入缺少有效数据");
  return { type, url: item.dataUrl, ...(id ? { id } : {}) };
}

function buildSeedDanceVideoRequest(prompt, profile) {
  const settings = state.settings;
  const modelId = settings.videoModel;
  const seedance25 = isSeedance25Model(modelId);
  const duration = effectiveVideoDuration(modelId);
  const automaticDuration = duration === -1;
  const ratio = effectiveVideoAspectRatio(modelId);
  const resolution = effectiveVideoResolution(modelId);
  const useNewApiTask = usesNewApiSeedance20Task(modelId);
  const content = seedance25 ? buildSeedance20Content(prompt) : null;
  const body = seedance25
    ? {
        model: modelId,
        prompt,
        content,
        duration,
        ratio,
        resolution,
        generate_audio: effectiveVideoAudio(modelId),
        watermark: false,
        metadata: {
          content,
          duration,
          ratio,
          resolution,
          generate_audio: effectiveVideoAudio(modelId),
          watermark: false,
        },
      }
    : useNewApiTask
    ? {
        model: modelId,
        prompt,
        duration: duration > 0 ? duration : undefined,
        seconds: duration > 0 ? String(duration) : undefined,
        duration_seconds: duration > 0 ? duration : undefined,
        ratio,
        resolution,
        generate_audio: effectiveVideoAudio(modelId),
        watermark: false,
        metadata: {
          content: buildSeedance20Content(prompt),
          generate_audio: effectiveVideoAudio(modelId),
          ratio,
          resolution,
          duration,
          seconds: automaticDuration ? undefined : duration,
          duration_seconds: automaticDuration ? undefined : duration,
          watermark: false,
        },
      }
    : isSeedance20UnifiedModel(modelId)
      ? {
          model: modelId,
          content: buildSeedance20Content(prompt),
          generate_audio: effectiveVideoAudio(modelId),
          ratio,
          resolution,
          duration,
          watermark: false,
        }
    : {
        model: modelId,
        prompt,
        duration: automaticDuration ? undefined : duration,
        duration_seconds: automaticDuration ? undefined : duration,
        seconds: automaticDuration ? undefined : String(duration),
        ratio,
        resolution,
        metadata: {
          ratio,
          resolution,
          duration,
          seconds: automaticDuration ? undefined : duration,
          duration_seconds: automaticDuration ? undefined : duration,
        },
      };
  const references = buildVideoReferences();
  if (!isSeedance20UnifiedModel(modelId) && !seedance25 && references.length) body.references = references;
  return {
    label: `${profile?.vendor || "SeedDance"} 视频参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: authHeaders(),
    body: JSON.stringify(body),
  };
}

function hasSeedance25MediaInputs() {
  return Boolean(
    draftMedia.firstFrame
      || draftMedia.lastFrame
      || draftMedia.videoImages.length
      || draftMedia.videoReferences.length
      || draftMedia.audio
  );
}

function buildSeedance20Content(prompt) {
  const content = [{ type: "text", text: prompt }];
  const addImage = (item, role) => {
    if (item?.dataUrl) content.push({ type: "image_url", image_url: { url: item.dataUrl }, role });
  };
  if (draftMedia.firstFrame || draftMedia.lastFrame) {
    addImage(draftMedia.firstFrame, "first_frame");
    addImage(draftMedia.lastFrame, "last_frame");
    return content;
  }
  draftMedia.videoImages.forEach((item) => addImage(item, "reference_image"));
  draftMedia.videoReferences.forEach((item) => {
    if (item?.dataUrl) content.push({ type: "video_url", video_url: { url: item.dataUrl }, role: "reference_video" });
  });
  if (draftMedia.audio) {
    if (!draftMedia.videoImages.length && !draftMedia.videoReferences.length) {
      throw new Error("Seedance 2.0 音频参考需要同时上传参考图片或参考视频");
    }
    content.push({
      type: "audio_url",
      audio_url: { url: draftMedia.audio.dataUrl },
      role: "reference_audio",
    });
  }
  return content;
}

function buildGrokVideoRequest(prompt, profile) {
  const endpoint = videoGenerationEndpoint(profile);
  const video = draftMedia.videoReferences[0];
  if (video?.dataUrl && isGrokJsonVideoEndpoint(endpoint)) return buildGrokVideoEditRequest(prompt, profile, video);
  return isGrokJsonVideoEndpoint(endpoint)
    ? buildGrokJsonVideoRequest(prompt, profile, endpoint)
    : buildGrokMultipartVideoRequest(prompt, profile, endpoint);
}

function buildGrokTextVideoFallbackRequest(prompt, profile, request, errorMessage) {
  const hasImage = Boolean(draftMedia.videoImages[0] || draftMedia.firstFrame || draftMedia.lastFrame);
  if (!isGrokImagine15Model(state.settings.videoModel) || hasImage) return null;
  if (isDeepRouterBaseUrl()) return null;
  if (isGrokJsonVideoEndpoint(request?.endpoint)) return null;
  if (!/requires? (?:a )?reference image|需要(?:上传)?参考图|必须(?:提供|上传).*图片/i.test(String(errorMessage || ""))) return null;
  return buildGrokJsonVideoRequest(prompt, profile, "/v1/videos/generations");
}

function buildGrokVideoRouteFallbackRequest(prompt, profile, request, errorMessage) {
  if (isDeepRouterBaseUrl()) return null;
  if (!isGrokImagineVideoModel(state.settings.videoModel) || !isGrokJsonVideoEndpoint(request?.endpoint)) return null;
  if (!/(?:invalid url|404|not found|cannot post|status\s*415|unsupported media type|upstream returned status 415)/i.test(String(errorMessage || ""))) return null;
  return buildGrokMultipartVideoRequest(prompt, profile, "/v1/videos");
}

function isGrokJsonVideoEndpoint(endpoint) {
  return /\/videos\/generations(?:$|[?#])/i.test(String(endpoint || ""));
}

function buildGrokJsonVideoRequest(prompt, profile, endpoint) {
  const settings = state.settings;
  const body = {
    model: settings.videoModel,
    prompt: videoPromptWithSelectedStyle(prompt, settings.videoModel),
    duration: effectiveVideoDuration(settings.videoModel),
    aspect_ratio: effectiveVideoAspectRatio(settings.videoModel),
    resolution: effectiveVideoResolution(settings.videoModel),
  };
  const images = [draftMedia.firstFrame, ...draftMedia.videoImages, draftMedia.lastFrame].filter(Boolean);
  if (images.length === 1) body.image = { url: images[0].dataUrl };
  else if (images.length > 1) body.reference_images = images.slice(0, 4).map((item) => ({ url: item.dataUrl }));
  return {
    label: `${profile?.vendor || "xAI"} 官方视频生成`,
    endpoint,
    headers: authHeaders(),
    body: JSON.stringify(body),
  };
}

function buildGrokMultipartVideoRequest(prompt, profile, endpoint) {
  const settings = state.settings;
  const duration = effectiveVideoDuration(settings.videoModel);
  const form = new FormData();
  form.append("model", settings.videoModel);
  form.append("prompt", videoPromptWithSelectedStyle(prompt, settings.videoModel));
  form.append("size", isDeepRouterBaseUrl()
    ? effectiveVideoResolution(settings.videoModel)
    : effectiveVideoAspectRatio(settings.videoModel));
  form.append("seconds", String(duration));
  const reference = draftMedia.firstFrame
    || draftMedia.videoImages[0]
    || draftMedia.lastFrame
    || draftMedia.videoReferences[0];
  if (reference?.file) form.append("input_reference", reference.file, reference.name);
  else if (reference?.dataUrl) form.append("input_reference", reference.dataUrl);
  return {
    label: `${profile?.vendor || "Grok"} 第三方 Multipart 参数`,
    endpoint,
    headers: grokMultipartAuthHeaders(),
    body: form,
  };
}

function grokMultipartAuthHeaders() {
  return authHeaders(false);
}

function buildGrokVideoEditRequest(prompt, profile, video) {
  return {
    label: `${profile?.vendor || "xAI"} 官方视频编辑`,
    endpoint: "/v1/videos/edits",
    headers: authHeaders(),
    body: JSON.stringify({
      model: state.settings.videoModel,
      prompt: videoPromptWithSelectedStyle(prompt, state.settings.videoModel),
      video: { url: video.dataUrl },
    }),
  };
}

function buildSoraVideoRequest(prompt, profile) {
  const settings = state.settings;
  const duration = normalizeSora2Duration(settings.videoDuration, settings.videoModel);
  const size = effectiveVideoAspectRatio(settings.videoModel);
  const reference = draftMedia.firstFrame || draftMedia.videoImages[0] || draftMedia.lastFrame;
  const form = new FormData();
  form.append("model", settings.videoModel);
  form.append("prompt", prompt);
  form.append("seconds", String(duration));
  form.append("duration", String(duration));
  form.append("size", size);
  if (reference?.file) form.append("input_reference", reference.file, reference.name);
  else if (reference?.dataUrl) form.append("input_reference", reference.dataUrl);
  return {
    label: `${profile?.vendor || "OpenAI"} Sora Multipart 参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: authHeaders(false),
    body: form,
  };
}

function buildCompatibleMultipartVideoRequest(prompt, profile) {
  const settings = state.settings;
  const styledPrompt = videoPromptWithSelectedStyle(prompt, settings.videoModel);
  const form = new FormData();
  form.append("model", settings.videoModel);
  form.append("prompt", styledPrompt);
  form.append("size", effectiveVideoAspectRatio(settings.videoModel));
  const duration = effectiveVideoDuration(settings.videoModel);
  form.append("seconds", String(duration));
  form.append("duration", String(duration));
  const reference = draftMedia.firstFrame || draftMedia.videoImages[0] || draftMedia.lastFrame;
  if (reference?.file) form.append("input_reference", reference.file, reference.name);
  return {
    label: `${profile?.vendor || "兼容"} Multipart 视频参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: rawAuthHeaders(),
    body: form,
  };
}

function buildNewApiVeoVideoRequest(prompt, profile) {
  const settings = state.settings;
  const modelId = settings.videoModel;
  const duration = effectiveVideoDuration(modelId);
  const resolution = effectiveVideoResolution(modelId);
  const aspectRatio = effectiveVideoAspectRatio(modelId);
  const primaryImage = draftMedia.firstFrame || draftMedia.videoImages[0];
  return {
    label: `${profile?.vendor || "Google"} NewAPI Veo 参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: authHeaders(),
    body: JSON.stringify({
      model: modelId,
      prompt: videoPromptWithSelectedStyle(prompt, modelId),
      duration,
      seconds: String(duration),
      images: primaryImage?.dataUrl ? [primaryImage.dataUrl] : undefined,
      metadata: {
        durationSeconds: duration,
        aspectRatio,
        resolution,
        generateAudio: effectiveVideoAudio(modelId),
      },
    }),
  };
}

function buildDeepRouterVeo31VideoRequest(prompt, profile) {
  const modelId = state.settings.videoModel;
  const duration = effectiveVideoDuration(modelId);
  const resolution = effectiveVideoResolution(modelId);
  const aspectRatio = effectiveVideoAspectRatio(modelId);
  const size = veoCompatibleVideoSize(resolution, aspectRatio);
  if (draftMedia.lastFrame || draftMedia.videoImages.length) {
    throw new Error("DeepRouter 的 Veo 兼容接口仅支持文生视频或单张首帧图生视频");
  }
  const common = {
    model: modelId,
    prompt: videoPromptWithSelectedStyle(prompt, modelId),
    seconds: String(duration),
    size,
  };
  const firstFrame = draftMedia.firstFrame;
  if (!firstFrame) {
    return {
      label: `${profile?.vendor || "Google"} Veo OpenAI 兼容参数`,
      endpoint: "/v1/videos",
      headers: { ...rawAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        ...common,
        metadata: { durationSeconds: duration, resolution, aspectRatio },
      }),
    };
  }
  const form = new FormData();
  Object.entries(common).forEach(([key, value]) => form.append(key, value));
  form.append("resolution", resolution);
  form.append("aspectRatio", aspectRatio);
  if (firstFrame.file) form.append("input_reference", firstFrame.file, firstFrame.name);
  else form.append("input_reference", firstFrame.dataUrl);
  return {
    label: `${profile?.vendor || "Google"} Veo OpenAI 兼容参数`,
    endpoint: "/v1/videos",
    headers: rawAuthHeaders(),
    body: form,
  };
}

function veoCompatibleVideoSize(resolution, aspectRatio) {
  if (resolution === "1080p") return aspectRatio === "9:16" ? "1080x1920" : "1920x1080";
  return aspectRatio === "9:16" ? "720x1280" : "1280x720";
}

function buildVeoVideoRequest(prompt, profile) {
  const settings = state.settings;
  const modelId = settings.videoModel;
  const instance = { prompt: videoPromptWithSelectedStyle(prompt, modelId) };
  const documentedVeo31 = isDocumentedVeo31Model(modelId);
  const referenceMode = isDocumentedVeo31ReferenceMode(modelId);
  if (documentedVeo31 && draftMedia.lastFrame && !draftMedia.firstFrame) {
    throw new Error("Veo 3.1 尾帧必须与首帧同时使用");
  }
  if (documentedVeo31 && isDocumentedVeo31FastModel(modelId) && draftMedia.videoImages.length) {
    throw new Error("Veo 3.1 Fast 不支持参考图，请改用首帧上传");
  }
  if (documentedVeo31 && draftMedia.firstFrame && draftMedia.videoImages.length) {
    throw new Error("Veo 3.1 首帧/首尾帧不能与参考图同时使用");
  }
  const primaryImage = referenceMode ? null : draftMedia.firstFrame || draftMedia.videoImages[0];
  if (primaryImage) instance.image = geminiVideoImage(primaryImage);
  if (primaryImage && draftMedia.lastFrame) instance.lastFrame = geminiVideoImage(draftMedia.lastFrame);
  if (referenceMode) {
    instance.referenceImages = draftMedia.videoImages.slice(0, 3).map((item) => ({
      image: geminiVideoImage(item),
      referenceType: "asset",
    }));
  } else if (!documentedVeo31 && isVeo31Model(modelId) && !isVeo31LiteModel(modelId)) {
    const references = draftMedia.firstFrame ? draftMedia.videoImages : draftMedia.videoImages.slice(1);
    if (references.length) {
      instance.referenceImages = references.slice(0, 3).map((item) => ({
        image: geminiVideoImage(item),
        referenceType: "asset",
      }));
    }
  }
  const parameters = {
    aspectRatio: effectiveVideoAspectRatio(modelId),
    durationSeconds: effectiveVideoDuration(modelId),
  };
  if (!isVeo2Model(modelId)) parameters.resolution = effectiveVideoResolution(modelId);
  if (documentedVeo31) parameters.numberOfVideos = 1;
  const body = { instances: [instance], parameters };
  return {
    label: `${profile?.vendor || "Google"} Veo 原生参数`,
    endpoint: videoGenerationEndpoint(profile),
    headers: authHeaders(),
    body: JSON.stringify(body),
  };
}

function geminiVideoImage(item) {
  if (/^https?:\/\//i.test(String(item?.dataUrl || ""))) return { imageUri: item.dataUrl };
  const inline = parseInlineDataUrl(item?.dataUrl);
  if (!inline) throw new Error(`参考图 ${item?.name || ""} 缺少有效的 Base64 数据`);
  return { inlineData: { mimeType: inline.mime, data: inline.data } };
}

function videoGenerationEndpoint(profile) {
  const endpoint = state.settings.videoEndpoint || DEFAULT_SETTINGS.videoEndpoint;
  const defaultLike = !endpoint || endpoint === DEFAULT_SETTINGS.videoEndpoint;
  if (profile?.provider === "xai") {
    if (isDeepRouterBaseUrl() && isGrokVideoModel(state.settings.videoModel)) {
      return "/v1/videos/generations";
    }
    if (isThirdPartyGrokVideoModel(state.settings.videoModel)) return "/v1/videos";
    if (isGrokImagineVideoModel(state.settings.videoModel)) {
      if (state.settings.videoApiStyle === "generic" || isSub2ApiBaseUrl()) return "/v1/videos";
      if (usesOfficialXaiVideoApi()) return "/v1/videos/generations";
      if (defaultLike) return "/v1/videos";
      return endpoint;
    }
    if (usesOfficialXaiVideoApi()) return "/v1/videos/generations";
    if (isDeepRouterBaseUrl()) return "/v1/videos";
    if (defaultLike) return "/v1/videos";
    return endpoint;
  }
  if (profile?.provider === "sora" && defaultLike) return "/v1/videos";
  if (profile?.provider === "seedance" && isSeedance20UnifiedModel(state.settings.videoModel)
      && !usesNewApiSeedance20Task(state.settings.videoModel) && defaultLike) {
    return "/api/v3/contents/generations/tasks";
  }
  if (profile?.provider === "seedance" && defaultLike) return "/v1/video/generations";
  if (profile?.provider === "veo" && usesDeepRouterVeoCompatibility(state.settings.videoModel) && defaultLike) return "/v1/videos";
  if (profile?.provider === "veo" && usesDeepRouterDocumentedVeo31Compatibility(state.settings.videoModel)) {
    return "/v1/videos";
  }
  if (profile?.provider === "veo" && isDocumentedVeo31Model(state.settings.videoModel)) {
    const modelId = String(state.settings.videoModel || "").replace(/^models\//, "");
    return `/v1beta/models/${encodeURIComponent(modelId)}:predictLongRunning`;
  }
  if (profile?.provider === "veo" && usesNewApiVeoTask(state.settings.videoModel) && defaultLike) return "/v1/video/generations";
  if (profile?.provider === "veo" && resolveVideoApiStyle(profile) === "gemini" && defaultLike) {
    const modelId = String(state.settings.videoModel || "").replace(/^models\//, "");
    return `/v1beta/models/${encodeURIComponent(modelId)}:predictLongRunning`;
  }
  return endpoint;
}

function videoTaskParams() {
  const settings = state.settings;
  const duration = effectiveVideoDuration(settings.videoModel);
  if (isGrokVideoModel(settings.videoModel)) {
    return {
      aspectRatio: effectiveVideoAspectRatio(settings.videoModel),
      resolution: effectiveVideoResolution(settings.videoModel),
      duration: `${duration}s`,
      style: settings.videoStyle,
    };
  }
  return {
    aspectRatio: effectiveVideoAspectRatio(settings.videoModel),
    resolution: effectiveVideoResolution(settings.videoModel),
    duration: duration === -1 ? "自动" : `${duration}s`,
    count: isSeedanceModel(settings.videoModel)
      ? effectiveVideoCount(settings.videoModel)
      : undefined,
    style: settings.videoStyle,
    audio: effectiveVideoAudio(settings.videoModel) ? "开" : "关",
  };
}

function buildVideoReferences() {
  const refs = [];
  if (draftMedia.firstFrame) refs.push({ role: "first_frame", ...mediaPayload(draftMedia.firstFrame) });
  if (draftMedia.lastFrame) refs.push({ role: "last_frame", ...mediaPayload(draftMedia.lastFrame) });
  draftMedia.videoImages.forEach((item) => refs.push({ role: "reference_image", ...mediaPayload(item) }));
  draftMedia.videoReferences.forEach((item) => refs.push({ role: "reference_video", ...mediaPayload(item) }));
  if (draftMedia.audio) refs.push({ role: "audio", ...mediaPayload(draftMedia.audio) });
  return refs;
}

function videoReferenceMeta() {
  const refs = [];
  if (draftMedia.firstFrame) refs.push({ role: "首帧", ...mediaMeta(draftMedia.firstFrame) });
  if (draftMedia.lastFrame) refs.push({ role: "尾帧", ...mediaMeta(draftMedia.lastFrame) });
  draftMedia.videoImages.forEach((item) => refs.push({ role: "参考图", ...mediaMeta(item) }));
  draftMedia.videoReferences.forEach((item) => refs.push({ role: "参考视频", ...mediaMeta(item) }));
  if (draftMedia.audio) refs.push({ role: "音频", ...mediaMeta(draftMedia.audio) });
  return refs;
}

function buildVisualContextPrompt(prompt) {
  if (!isVisualContextEnabled()) return prompt;
  const turns = clampNumber(state.settings.visualContextTurns, 1, 10, 4);
  const previous = state.visualTasks
    .filter((task) => task.sessionId === activeVisualSessionId && task.prompt && task.status !== "error")
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
    .slice(-turns);
  if (!previous.length) return prompt;
  const history = previous
    .map((task, index) => `${index + 1}. [${task.type === "video" ? "视频" : "图片"}] ${task.prompt}`)
    .join("\n");
  return [
    "延续同一视觉创作会话，保持主体身份、场景设定、色彩和视觉风格的一致性。",
    "已有创作上下文：",
    history,
    "当前创作要求：",
    prompt,
  ].join("\n");
}

function isVisualContextEnabled() {
  const session = state.visualSessions?.find((item) => item.id === activeVisualSessionId);
  return session?.contextEnabled ?? !!state.settings.visualContext;
}

async function pollVideoTask(taskId, options = {}) {
  const task = state.visualTasks.find((item) => item.id === taskId);
  if (!task?.jobId) return;
  if (activeVideoPolls.has(taskId)) return;
  const attempts = clampNumber(options.attempts, 1, VIDEO_TASK_POLL_ATTEMPTS, VIDEO_TASK_POLL_ATTEMPTS);
  activeVideoPolls.add(taskId);
  try {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (!(options.immediate && attempt === 0)) await wait(attempt === 0 ? 3000 : 5000);
    const current = state.visualTasks.find((item) => item.id === taskId);
    if (!current || current.status === "done" || current.status === "error") return;
    const result = await refreshVideoTaskOnce(current);
    if (result !== "pending") return;
  }
  } finally {
    activeVideoPolls.delete(taskId);
  }
}

async function refreshVideoTaskOnce(task) {
  try {
    if (task.apiBaseUrl && !isSameApiGateway(task.apiBaseUrl, state.settings.baseUrl)) {
      task.lastPollError = `该任务由 ${apiGatewayLabel(task.apiBaseUrl)} 创建，请切回该 API 配置后刷新结果`;
      saveState();
      renderImages();
      return "paused";
    }
    const endpointTemplate = videoStatusEndpointForTask(task);
    const endpoint = endpointTemplate.replace("{id}", encodeVideoTaskId(task.jobId, task));
    const response = await fetchVideoTaskResource(apiUrlForBase(task.apiBaseUrl || state.settings.baseUrl, endpoint), task);
    task.lastCheckedAt = Date.now();
    if (!response.ok) {
      task.lastPollError = await responseError(response);
      if (failMissingVideoTaskAfterRetries(task, task.lastPollError)) return "failed";
      saveState();
      renderImages();
      return "pending";
    }
    const data = await parseApiJsonResponse(response, "视频任务查询接口");
    const payloadError = extractErrorMessage(data);
    if (failMissingVideoTaskAfterRetries(task, payloadError)) return "failed";
    task.missingTaskPolls = 0;
    const status = extractTaskStatus(data);
    const media = videoResultUrlsForTask(data, task);
    task.rawStatus = status || task.rawStatus;
    task.lastPollError = "";
    if (media.length) {
      task.media = await materializeVideoUrls(media, task);
      task.status = "done";
      saveState();
      renderImages();
      showToast("视频结果已返回");
      return "done";
    }
    const normalizedStatus = String(status || "").toLowerCase();
    if (["failed", "failure", "error", "cancelled", "canceled", "rejected"].includes(normalizedStatus)) {
      task.status = "error";
      task.error = extractErrorMessage(data) || "视频任务失败";
      saveState();
      renderImages();
      showToast(task.error, true);
      return "failed";
    }
    if (["succeeded", "success", "completed", "complete", "finished", "done"].includes(normalizedStatus)) {
      task.status = "empty";
      task.error = "视频任务已完成，但状态接口未返回可播放的视频链接。";
      saveState();
      renderImages();
      showToast(task.error, true);
      return "failed";
    }
    task.status = "submitted";
    saveState();
    renderImages();
    return "pending";
  } catch (error) {
    task.lastPollError = normalizeError(error);
    if (/artifact[_ ]gone|Artifact content is no longer available/i.test(String(error?.message || error))) {
      task.status = "error";
      task.error = "DeepRouter 已完成视频任务，但 New API 未保留或无法代理上游视频文件（artifact_gone）。请修复 DeepRouter 的 xAI 插件产物存储/相对 URL 代理，或改用 LinkMesh 直连。";
      saveState();
      renderImages();
      showToast(task.error, true);
      return "failed";
    }
    if (error?.code === "invalid_json_response") {
      task.status = "error";
      task.error = task.lastPollError;
      saveState();
      renderImages();
      showToast(task.error, true);
      return "failed";
    }
    saveState();
    renderImages();
    return "pending";
  }
}

function failMissingVideoTaskAfterRetries(task, message) {
  if (!/task[_ ]?not[_ ]?exist|任务不存在/i.test(String(message || ""))) return false;
  task.missingTaskPolls = (task.missingTaskPolls || 0) + 1;
  task.lastPollError = message;
  if (!shouldStopMissingVideoTaskPolling(task.missingTaskPolls)) return false;
  task.status = "error";
  task.error = "视频任务已创建，但 DeepRouter 查询接口未映射该任务 ID（task_not_exist）";
  saveState();
  renderImages();
  showToast(task.error, true);
  return true;
}

function shouldStopMissingVideoTaskPolling(attempts) {
  return Number(attempts) >= MISSING_VIDEO_TASK_RETRY_LIMIT;
}

function videoStatusEndpointForTask(task) {
  const endpoint = state.settings.videoStatusEndpoint || DEFAULT_SETTINGS.videoStatusEndpoint;
  const defaultLike = !endpoint || endpoint === DEFAULT_SETTINGS.videoStatusEndpoint || endpoint === "/v1/videos/{id}";
  if (task?.provider === "kling") {
    return task.requestEndpoint === "/v1/video/generations"
      ? "/v1/video/generations/{id}"
      : "/tasks?task_ids={id}";
  }
  if (task?.provider === "xai" && /^\/v1\/videos(?:\/generations)?$/i.test(String(task.requestEndpoint || ""))) {
    if (isDeepRouterBaseUrl()) return "/v1/videos/{id}";
    if (/\/videos\/generations$/i.test(String(task.requestEndpoint || ""))) return "/v1/videos/generations/{id}";
    return "/v1/videos/{id}";
  }
  if (task?.provider === "xai" && defaultLike) return "/v1/videos/{id}";
  if (task?.provider === "sora" && defaultLike) return "/v1/videos/{id}";
  if (task?.provider === "seedance" && task.requestEndpoint === "/api/v3/contents/generations/tasks" && defaultLike) {
    return "/api/v3/contents/generations/tasks/{id}";
  }
  if (task?.provider === "seedance" && defaultLike) return "/v1/video/generations/{id}";
  if (task?.provider === "veo" && task.requestEndpoint === "/v1/videos") return "/v1/videos/{id}";
  if (task?.provider === "veo" && task.requestEndpoint === "/v1/video/generations" && defaultLike) {
    return "/v1/video/generations/{id}";
  }
  if (task?.provider === "veo" && defaultLike) return "/v1beta/{id}";
  return endpoint;
}

function videoStatusHeadersForTask(task) {
  if (task?.provider === "xai") {
    return authHeaders();
  }
  if (task?.provider === "veo" && task.requestEndpoint === "/v1/videos") {
    return rawAuthHeaders();
  }
  return authHeaders(false);
}

async function fetchVideoTaskResource(url, task) {
  const initialHeaders = videoStatusHeadersForTask(task);
  let response = await fetch(url, { headers: initialHeaders });
  if (![401, 403].includes(response.status) || task?.provider !== "xai" || !isDeepRouterBaseUrl()) return response;
  const usesBearer = /^Bearer\s/i.test(String(initialHeaders.Authorization || ""));
  const fallbackHeaders = usesBearer
    ? { ...rawAuthHeaders(), "Content-Type": "application/json" }
    : authHeaders();
  response = await fetch(url, { headers: fallbackHeaders });
  return response;
}

function encodeVideoTaskId(jobId, task) {
  const value = String(jobId || "").replace(/^\/+/, "");
  if (task?.provider !== "veo") return encodeURIComponent(value);
  return value.replace(/^v1beta\//, "").split("/").map(encodeURIComponent).join("/");
}

function isSameApiGateway(left, right) {
  try {
    const normalize = (value) => {
      const url = new URL(normalizeApiBaseUrl(value));
      const host = url.hostname.toLowerCase().replace(/^www\./, "");
      const path = url.pathname.replace(/\/v1\/?$/i, "").replace(/\/+$/, "");
      return `${url.protocol}//${host}${path}`;
    };
    return normalize(left) === normalize(right);
  } catch {
    return normalizeApiBaseUrl(left) === normalizeApiBaseUrl(right);
  }
}

function apiGatewayLabel(value) {
  try {
    return new URL(normalizeApiBaseUrl(value)).host;
  } catch {
    return normalizeApiBaseUrl(value) || "原 API 网关";
  }
}

function resumeVideoPolling() {
  state.visualTasks
    .filter((task) => task.type === "video" && task.jobId && ["running", "submitted"].includes(task.status))
    .forEach((task) => pollVideoTask(task.id, { attempts: VIDEO_TASK_POLL_ATTEMPTS }));
}

function resumeImagePolling() {
  let changed = false;
  state.visualTasks
    .filter((task) => task.type === "image" && ["running", "submitted"].includes(task.status))
    .forEach((task) => {
      task.status = "error";
      task.error = "页面刷新中断了图片响应，请重新生成。";
      changed = true;
    });
  if (changed) {
    saveState();
    renderImages();
  }
}

function renderImages() {
  const visualMode = state.settings.visualMode;
  const tasks = state.visualTasks
    .filter((task) => task.sessionId === activeVisualSessionId)
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  const previousSessionId = els.imageGrid.dataset.sessionId || "";
  const previousTaskIds = new Set(
    Array.from(els.imageGrid.children, (node) => node.dataset.taskId).filter(Boolean)
  );
  const distanceFromBottom = els.visualCanvas.scrollHeight
    - els.visualCanvas.scrollTop
    - els.visualCanvas.clientHeight;
  const sessionChanged = previousSessionId !== String(activeVisualSessionId || "");
  const hasNewTask = tasks.some((task) => !previousTaskIds.has(String(task.id)));
  const shouldFollowNewTask = !sessionChanged && hasNewTask && distanceFromBottom < 96;
  const previousScrollTop = els.visualCanvas.scrollTop;

  if (els.queueWaitingCount) {
    els.queueWaitingCount.textContent = String(tasks.filter((task) => task.status === "submitted").length);
  }
  if (els.queueRunningCount) {
    els.queueRunningCount.textContent = String(tasks.filter((task) => task.status === "running").length);
  }
  els.imageEmpty.hidden = tasks.length > 0;
  els.visualEmptyText.textContent =
    visualMode === "video"
      ? isGrokVideoModel(state.settings.videoModel)
        ? "输入镜头描述生成视频，或上传参考图进行图生视频。"
        : "输入镜头描述，可上传首帧、尾帧、参考视频或音频。"
      : "输入画面描述，或上传参考图进行图生图。";

  reconcileVisualTaskNodes(els.imageGrid, tasks, renderVisualTask);
  renderQueuePanel(tasks, getActiveVisualSession()?.queueBatches);
  els.imageGrid.dataset.sessionId = String(activeVisualSessionId || "");
  requestAnimationFrame(() => {
    if (sessionChanged) {
      els.visualCanvas.scrollTop = 0;
      return;
    }
    if (shouldFollowNewTask) {
      els.visualCanvas.scrollTop = els.visualCanvas.scrollHeight;
      return;
    }
    const maximumScrollTop = Math.max(0, els.visualCanvas.scrollHeight - els.visualCanvas.clientHeight);
    els.visualCanvas.scrollTop = Math.min(previousScrollTop, maximumScrollTop);
  });
}

function reconcileVisualTaskNodes(container, tasks, renderer) {
  const existing = new Map(
    Array.from(container.children)
      .filter((node) => node.dataset.taskId)
      .map((node) => [node.dataset.taskId, node])
  );
  tasks.forEach((task, index) => {
    const taskId = String(task.id);
    const signature = visualTaskRenderSignature(task);
    let node = existing.get(taskId);
    const isNew = !node;
    if (!node || node.dataset.renderSignature !== signature) {
      const replacement = renderer(task);
      replacement.dataset.taskId = taskId;
      replacement.dataset.renderSignature = signature;
      if (replacement.classList.contains("visual-task")) replacement.classList.toggle("is-new", isNew);
      if (node) node.replaceWith(replacement);
      node = replacement;
    }
    const current = container.children[index];
    if (current !== node) container.insertBefore(node, current || null);
    existing.delete(taskId);
  });
  existing.forEach((node) => node.remove());
}

function visualTaskRenderSignature(task) {
  const media = (task.media || []).map((value) => {
    const source = String(value || "");
    return `${source.length}:${source.slice(0, 48)}:${source.slice(-24)}`;
  });
  return JSON.stringify([
    task.status,
    task.model,
    task.prompt,
    task.createdAt,
    task.requestMode,
    task.rawStatus,
    task.lastPollError,
    task.error,
    task.jobId,
    media,
    task.params,
    task.references,
    task.contextApplied,
  ]);
}

function renderVisualTask(task) {
  const card = document.createElement("article");
  card.className = `visual-task ${task.type} status-${task.status}`;
  const header = document.createElement("div");
  header.className = "visual-task-header";
  header.innerHTML = `
    <div>
      <div class="task-model">${escapeHtml(task.model || "")}</div>
      <div class="task-meta">${escapeHtml(statusLabel(task.status))} · ${escapeHtml(formatTime(task.createdAt))}</div>
    </div>
    <span class="task-type">${task.type === "video" ? "视频" : "图片"}</span>
  `;
  card.appendChild(header);

  const prompt = document.createElement("div");
  prompt.className = "task-prompt";
  prompt.textContent = task.prompt || "";
  card.appendChild(prompt);

  const mediaWrap = document.createElement("div");
  mediaWrap.className = "task-media-grid";
  if (task.status === "running" || task.status === "submitted") {
    mediaWrap.appendChild(renderLoadingMedia(task));
  } else if (task.status === "error" || task.status === "stopped" || task.status === "empty") {
    const error = document.createElement("div");
    error.className = "task-error";
    error.textContent = task.error || (task.status === "empty" ? "接口未返回媒体结果" : statusLabel(task.status));
    mediaWrap.appendChild(error);
  } else {
    (task.media || []).forEach((src) => mediaWrap.appendChild(task.type === "video" ? renderVideo(src, task) : renderImage(src, task)));
  }
  card.appendChild(mediaWrap);

  const params = document.createElement("div");
  params.className = "task-param-row";
  Object.entries(task.params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    const chip = document.createElement("span");
    chip.textContent = `${paramLabel(key)} ${value}`;
    params.appendChild(chip);
  });
  if (task.contextApplied) {
    const contextChip = document.createElement("span");
    contextChip.textContent = "已应用上下文";
    contextChip.className = "context-param";
    params.appendChild(contextChip);
  }
  card.appendChild(params);

  if (task.type === "video" && task.jobId && task.status !== "done") {
    const actions = document.createElement("div");
    actions.className = "task-actions";
    actions.innerHTML = `
      <button class="mini-button" type="button" data-refresh-video="${escapeAttr(task.id)}">刷新结果</button>
      <span>${escapeHtml(taskStatusDetail(task))}</span>
    `;
    card.appendChild(actions);
  }
  if (Array.isArray(task.references) && task.references.length) {
    const refs = document.createElement("div");
    refs.className = "task-references";
    refs.textContent = task.references.map((item) => `${item.role ? `${item.role}:` : ""}${item.name}`).join(" / ");
    card.appendChild(refs);
  }

  if (!["running", "submitted"].includes(task.status)) {
    const controls = document.createElement("div");
    controls.className = "task-command-row";

    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "mini-button";
    retry.textContent = "重试";
    retry.addEventListener("click", () => retryVisualTask(task.id));
    controls.appendChild(retry);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "mini-button task-delete";
    remove.textContent = "删除";
    remove.addEventListener("click", () => deleteVisualTask(task.id));
    controls.appendChild(remove);
    card.appendChild(controls);
  }

  return card;
}

function renderLoadingMedia(task) {
  const loading = document.createElement("div");
  loading.className = "task-loading";
  loading.innerHTML = `
    <div class="loader-dot"></div>
    <strong>${task.status === "submitted" ? "任务已提交" : "生成中"}</strong>
    <span>${escapeHtml(task.requestMode || task.model || "")}</span>
    <small>${escapeHtml(taskStatusDetail(task))}</small>
  `;
  return loading;
}

function renderImage(src, task) {
  const wrap = document.createElement("div");
  wrap.className = "generated-media-item";
  const link = document.createElement("button");
  link.type = "button";
  link.className = "generated-media generated-image";
  const img = document.createElement("img");
  img.src = src;
  img.alt = task.prompt || "生成图片";
  link.appendChild(img);
  link.addEventListener("click", () => openMediaViewer(src, "image", task));
  wrap.appendChild(link);
  wrap.appendChild(renderContinueButton(src, "image", task));
  wrap.appendChild(renderImageToVideoButton(src, task));
  return wrap;
}

function renderVideo(src, task) {
  const wrap = document.createElement("div");
  wrap.className = "generated-media generated-video";
  const video = document.createElement("video");
  video.src = src;
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.title = task.prompt || "生成视频";
  wrap.appendChild(video);
  const open = document.createElement("button");
  open.type = "button";
  open.className = "media-open";
  open.textContent = "放大";
  open.addEventListener("click", () => openMediaViewer(src, "video", task));
  wrap.appendChild(open);
  wrap.appendChild(renderContinueButton(src, "video", task));
  return wrap;
}

function renderContinueButton(src, type, task) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "media-continue";
  button.textContent = "继续创作";
  button.title = type === "image" ? "将此图片追加到下一次创作的参考图" : "将此视频作为下一次创作的参考视频";
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    continueFromVisualResult(task.id, src, type);
  });
  return button;
}

function renderImageToVideoButton(src, task) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "media-to-video";
  button.textContent = "生成视频";
  button.title = "将此图片作为视频生成的参考图";
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    continueFromImageToVideo(task.id, src);
  });
  return button;
}

function openMediaViewer(src, type, task) {
  viewerZoom = 1;
  els.viewerTitle.textContent = task?.prompt || (type === "video" ? "视频预览" : "图片预览");
  els.viewerDownload.href = src;
  els.viewerDownload.download = `${type}-${task?.id || Date.now()}`;
  els.viewerImage.hidden = type !== "image";
  els.viewerVideo.hidden = type !== "video";
  if (type === "image") {
    els.viewerImage.src = src;
    els.viewerVideo.removeAttribute("src");
  } else {
    els.viewerVideo.src = src;
    els.viewerImage.removeAttribute("src");
  }
  setViewerZoom(1);
  if (typeof els.mediaViewer.showModal === "function") els.mediaViewer.showModal();
  else els.mediaViewer.setAttribute("open", "");
}

function closeMediaViewer() {
  els.viewerVideo.pause();
  els.viewerVideo.removeAttribute("src");
  if (typeof els.mediaViewer.close === "function") els.mediaViewer.close();
  else els.mediaViewer.removeAttribute("open");
}

function setViewerZoom(value) {
  viewerZoom = clampNumber(value, 0.5, 4, 1);
  const transform = `scale(${viewerZoom})`;
  els.viewerImage.style.transform = transform;
  els.viewerVideo.style.transform = transform;
  els.viewerZoomLabel.textContent = `${Math.round(viewerZoom * 100)}%`;
}

// Group tasks into queue batches. A "+ 新建队列" marker (at = timestamp) opens a
// new batch: tasks created at/after it belong to it. Returned newest batch first,
// tasks newest first inside each batch.
function buildQueueGroups(tasks, batches) {
  const markers = [...(Array.isArray(batches) ? batches : [])].sort((a, b) => (a.at || 0) - (b.at || 0));
  const groups = [{ index: 0, marker: null, tasks: [] }];
  markers.forEach((marker, i) => groups.push({ index: i + 1, marker, tasks: [] }));
  [...tasks]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .forEach((task) => {
      let idx = 0;
      markers.forEach((marker, i) => {
        if ((task.createdAt || 0) >= (marker.at || 0)) idx = i + 1;
      });
      groups[idx].tasks.push(task);
    });
  const hasMarkers = markers.length > 0;
  return groups
    .filter((group) => group.tasks.length || group.marker)
    .reverse()
    .map((group) => ({ ...group, showDivider: hasMarkers }));
}

function renderQueuePanel(tasks, batches) {
  const container = els.imageHistory;
  if (!container) return;
  const groups = buildQueueGroups(tasks, batches);
  const signature = groups
    .map((group) => `${group.index}:${group.marker?.id || ""}:${group.tasks.map((task) => `${task.id}/${visualTaskRenderSignature(task)}`).join(",")}`)
    .join("|") + `@${activeVisualSessionId}`;
  if (container.dataset.queueSignature === signature) return;
  container.dataset.queueSignature = signature;
  container.innerHTML = "";
  if (!tasks.length && !groups.length) {
    const empty = document.createElement("p");
    empty.className = "panel-empty";
    empty.textContent = "还没有任务，提交生成后会出现在这里。";
    container.appendChild(empty);
    return;
  }
  groups.forEach((group) => {
    if (group.showDivider) {
      const divider = document.createElement("div");
      divider.className = "queue-batch-divider";
      divider.dataset.batchIndex = String(group.index);
      divider.textContent = group.marker
        ? `批次 ${group.index + 1} · ${formatTime(group.marker.at)}`
        : "批次 1";
      container.appendChild(divider);
    }
    group.tasks.forEach((task) => container.appendChild(renderHistoryItem(task)));
  });
}

function renderHistoryItem(task) {
  const item = document.createElement("button");
  item.type = "button";
  item.className = `history-item panel-row status-${task.status}`;
  item.dataset.taskId = String(task.id);
  item.appendChild(rowThumb(task.type === "video" ? "▶" : "▦"));
  item.appendChild(
    rowTextBlock(
      task.prompt || "（无提示词）",
      `${statusLabel(task.status)} · ${task.type === "video" ? "视频" : "图片"} · ${formatTime(task.createdAt)}`
    )
  );
  item.addEventListener("click", () => locateVisualTask(task.id));
  return item;
}

// Scroll the canvas to a task's work and flash it. If the work is not in the
// canvas DOM (e.g. the screen was cleared) it is re-rendered from session data.
function locateVisualTask(taskId) {
  const task = state.visualTasks.find((item) => String(item.id) === String(taskId));
  if (!task) return null;
  let switched = false;
  if (task.sessionId && task.sessionId !== activeVisualSessionId) {
    switched = true;
    activeMode = "image";
    activeVisualSessionId = task.sessionId;
    saveState();
    render();
  }
  const findNode = () =>
    Array.from(els.imageGrid.children).find((node) => node.dataset.taskId === String(task.id));
  let node = findNode();
  if (!node) {
    node = renderVisualTask(task);
    node.dataset.taskId = String(task.id);
    node.dataset.renderSignature = visualTaskRenderSignature(task);
    const later = state.visualTasks
      .filter((item) => item.sessionId === task.sessionId && (item.createdAt || 0) > (task.createdAt || 0))
      .map((item) => findNodeById(els.imageGrid, item.id))
      .filter(Boolean);
    els.imageGrid.insertBefore(node, later.length ? later[later.length - 1] : null);
    if (els.imageEmpty) els.imageEmpty.hidden = true;
  }
  const reveal = () => {
    if (typeof node.scrollIntoView === "function") node.scrollIntoView({ behavior: "smooth", block: "center" });
    flashHighlight(node);
    const narrow = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
    if (narrow) {
      const preview = els.visualCanvas?.closest(".visual-preview, .canvas-card, .visual-main") || els.visualCanvas;
      if (preview && typeof preview.scrollIntoView === "function") preview.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  // renderImages resets scroll on session change in a rAF; reveal after it.
  if (switched && typeof requestAnimationFrame === "function") requestAnimationFrame(reveal);
  else reveal();
  return node;
}

function findNodeById(container, id) {
  return Array.from(container.children).find((node) => node.dataset.taskId === String(id));
}

async function retryVisualTask(taskId) {
  if (abortController) {
    showToast("当前任务完成后再重试", true);
    return;
  }
  const task = state.visualTasks.find((item) => item.id === taskId);
  if (!task) return;
  if (!ensureApiReady()) return;

  activeMode = "image";
  activeVisualSessionId = task.sessionId || activeVisualSessionId;
  applyVisualTaskSettings(task);
  els.promptInput.value = task.prompt || "";
  autoResizePrompt();
  saveState();
  render();

  const needsReferences = Array.isArray(task.references) && task.references.length > 0;
  const hasReferences = task.type === "image" ? draftMedia.imageReferences.length > 0 : videoDraftReferenceCount() > 0;
  if (needsReferences && !hasReferences) {
    showToast("原任务使用了参考素材，请重新添加后再生成", true);
    els.promptInput.focus();
    return;
  }

  if (task.type === "video") await generateVideo(task.prompt || "");
  else await generateImage(task.prompt || "");
}

function applyVisualTaskSettings(task) {
  const params = task.params || {};
  state.settings.visualMode = task.type === "video" ? "video" : "image";
  if (task.type === "video") {
    if (task.model) state.settings.videoModel = task.model;
    if (params.aspectRatio) state.settings.videoAspectRatio = params.aspectRatio;
    if (params.resolution) state.settings.videoResolution = params.resolution;
    if (params.duration) {
      state.settings.videoDuration = params.duration === "自动"
        ? -1
        : clampNumber(parseInt(params.duration, 10), 1, 30, state.settings.videoDuration);
    }
    if (params.count) state.settings.videoCount = clampNumber(params.count, 1, 4, state.settings.videoCount);
    if (params.style) state.settings.videoStyle = params.style;
    if (params.audio) state.settings.videoAudio = params.audio === "开" || params.audio === true;
  } else {
    if (task.model) state.settings.imageModel = task.model;
    if (params.aspectRatio) state.settings.imageAspectRatio = params.aspectRatio;
    if (params.size) state.settings.imageSize = params.size;
    if (params.quality) state.settings.imageQuality = params.quality;
    if (params.style) state.settings.imageStyle = params.style;
    if (params.count) state.settings.imageCount = clampNumber(params.count, 1, 4, state.settings.imageCount);
  }
  if (task.model) state.modelOptions = unique([task.model, ...state.modelOptions]);
}

function videoDraftReferenceCount() {
  return (
    draftMedia.videoImages.length +
    draftMedia.videoReferences.length +
    Number(Boolean(draftMedia.firstFrame)) +
    Number(Boolean(draftMedia.lastFrame)) +
    Number(Boolean(draftMedia.audio))
  );
}

async function continueFromVisualResult(taskId, src, type) {
  if (abortController) {
    showToast("当前任务完成后再继续创作", true);
    return;
  }
  const task = state.visualTasks.find((item) => item.id === taskId);
  if (!task || !src) return;

  showToast("正在载入生成结果");
  try {
    const media = await generatedResultToMedia(src, type, task);
    activeMode = "image";
    activeVisualSessionId = task.sessionId || activeVisualSessionId;
    applyVisualTaskSettings(task);
    if (type === "video") {
      draftMedia = createEmptyDraftMedia();
      state.settings.visualMode = "video";
      draftMedia.videoReferences = [media];
    } else {
      state.settings.visualMode = "image";
      draftMedia.imageReferences = uniqueMedia([...draftMedia.imageReferences, media]).slice(0, 9);
      syncImageModeFromReferences();
    }
    saveState();
    render();
    els.promptInput.value = task.prompt || "";
    autoResizePrompt();
    els.promptInput.focus();
    showToast(type === "video" ? "已将结果加入参考视频" : `已加入参考图（${draftMedia.imageReferences.length}/9）`);
  } catch (error) {
    const message = error?.message === "Failed to fetch"
      ? "无法读取该结果，图片地址可能已过期或不允许跨域下载"
      : normalizeError(error);
    showToast(message, true);
  }
}

async function continueFromImageToVideo(taskId, src) {
  if (abortController) {
    showToast("当前任务完成后再生成视频", true);
    return;
  }
  const task = state.visualTasks.find((item) => item.id === taskId);
  if (!task || !src) return;

  showToast("正在载入图片参考");
  try {
    const media = await generatedResultToMedia(src, "image", task);
    activeMode = "image";
    activeVisualSessionId = task.sessionId || activeVisualSessionId;
    draftMedia = createEmptyDraftMedia();
    syncImageModeFromReferences();
    state.settings.visualMode = "video";
    draftMedia.videoImages = [media];
    saveState();
    render();
    els.promptInput.value = task.prompt || "";
    autoResizePrompt();
    els.promptInput.focus();
    showToast("已将图片加入视频参考图");
  } catch (error) {
    const message = error?.message === "Failed to fetch"
      ? "无法读取该图片，地址可能已过期或不允许跨域下载"
      : normalizeError(error);
    showToast(message, true);
  }
}

async function generatedResultToMedia(src, type, task) {
  let blob = await cachedGeneratedMediaBlob(src, task);
  if (!blob) {
    let response;
    try {
      response = await fetchGeneratedMediaResource(src, task);
    } catch (error) {
      const remoteMedia = generatedResultUrlMedia(src, type, task);
      if (remoteMedia) return remoteMedia;
      throw error;
    }
    if (!response.ok) throw new Error(`读取生成结果失败：${response.status}`);
    blob = await response.blob();
  }
  if (!blob.size) throw new Error("生成结果内容为空");
  if (blob.type === "text/html") throw new Error("生成结果地址已失效");
  if (blob.size > 100 * 1024 * 1024) throw new Error("生成结果超过 100MB，无法作为参考素材");
  const fallbackMime = type === "video" ? "video/mp4" : "image/png";
  const mime = blob.type || fallbackMime;
  const extension = mediaExtension(mime, type);
  const name = `${type === "video" ? "video" : "image"}-${String(task.id || Date.now()).slice(-8)}.${extension}`;
  const file = new File([blob], name, { type: mime });
  return readMediaFile(file);
}

function generatedResultUrlMedia(src, type, task) {
  if (isApiResourceUrl(src)) return null;
  try {
    const url = new URL(String(src || ""));
    if (!["http:", "https:"].includes(url.protocol)) return null;
    const mime = type === "video" ? "video/mp4" : "image/png";
    const extension = mediaExtension(mime, type);
    return {
      id: generateId(),
      name: `${type === "video" ? "video" : "image"}-${String(task?.id || Date.now()).slice(-8)}.${extension}`,
      mime,
      size: 0,
      dataUrl: url.href,
      sourceUrl: url.href,
    };
  } catch {
    return null;
  }
}

async function cachedGeneratedMediaBlob(src, task) {
  if (typeof indexedDB === "undefined" || !task?.id) return null;
  let index = (task.media || []).indexOf(src);
  if (index < 0) index = (task.mediaSourceUrls || []).indexOf(src);
  if (index < 0) return null;
  const key = task.mediaCacheKeys?.[index] || visualMediaCacheKey(task.id, index);
  try {
    return await getVisualMediaCache(key);
  } catch {
    return null;
  }
}

async function fetchGeneratedMediaResource(src, task) {
  if (task?.type === "video" && task?.provider === "xai" && isApiResourceUrl(src)) {
    return fetchVideoTaskResource(apiUrl(src), task);
  }
  const options = isApiResourceUrl(src) ? { headers: authHeaders(false) } : undefined;
  return fetch(src, options);
}

function isApiResourceUrl(value) {
  if (isLinkMeshProxyPath(value) || isDeepRouterProxyPath(value)) return true;
  try {
    const url = new URL(String(value || ""));
    const base = new URL(normalizeApiBaseUrl(state.settings.baseUrl) || DEFAULT_API_BASE_URL);
    const hostname = (host) => String(host || "").replace(/^www\./i, "").toLowerCase();
    return hostname(url.hostname) === hostname(base.hostname)
      && url.protocol === base.protocol
      && url.port === base.port;
  } catch {
    return false;
  }
}

function mediaExtension(mime, type) {
  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  };
  return extensions[String(mime || "").toLowerCase()] || (type === "video" ? "mp4" : "png");
}

function deleteVisualTask(taskId) {
  const task = state.visualTasks.find((item) => item.id === taskId);
  cancelImageRequest(taskId);
  state.visualTasks = state.visualTasks.filter((item) => item.id !== taskId);
  void deleteVisualMediaCacheForTask(taskId);
  const session = state.visualSessions.find((item) => item.id === task?.sessionId);
  if (session) session.updatedAt = Date.now();
  saveState();
  renderImages();
  renderSessions();
  showToast("视觉任务已删除");
}

function clearVisualTasks() {
  const removedTaskIds = state.visualTasks.filter((task) => task.sessionId === activeVisualSessionId).map((task) => task.id);
  removedTaskIds.forEach(cancelImageRequest);
  state.visualTasks = state.visualTasks.filter((task) => task.sessionId !== activeVisualSessionId);
  removedTaskIds.forEach((taskId) => void deleteVisualMediaCacheForTask(taskId));
  saveState();
  renderImages();
}

function renderVisualMeta() {
  const visualMode = state.settings.visualMode;
  els.visualPanelTitle.textContent = visualMode === "video" ? "视频生成" : "图片生成";
  if (els.settingsPopoverTitle) els.settingsPopoverTitle.textContent = visualMode === "video" ? "视频设置" : "图片设置";
  if (els.settingsPopoverSub) {
    els.settingsPopoverSub.textContent = visualMode === "video" ? state.settings.videoModel || "" : state.settings.imageModel || "";
  }
  if (els.composerTitle && activeMode === "image") {
    els.composerTitle.textContent = visualMode === "video" ? "视频生成" : "图片生成";
  }
}

async function handleReferenceFiles(event, kind) {
  const files = Array.from(event.target.files || []);
  event.target.value = "";
  if (!files.length) return;
  try {
    const items = await Promise.all(files.map((file) => readMediaFile(file)));
    if (kind === "image-reference") {
      if (state.settings.visualMode === "video") {
        if (isDocumentedVeo31FastModel(state.settings.videoModel)
            || usesDeepRouterDocumentedVeo31Compatibility(state.settings.videoModel)) {
          throw new Error("当前 Veo 3.1 接口不支持多参考图，请使用首帧功能");
        }
        if (isDocumentedVeo31Model(state.settings.videoModel)) {
          draftMedia.firstFrame = null;
          draftMedia.lastFrame = null;
          draftMedia.videoImages = uniqueMedia([...draftMedia.videoImages, ...items]).slice(0, 3);
        } else if (isKlingModel(state.settings.videoModel)) {
          const limit = isKlingOmniModel(state.settings.videoModel) ? 3 : 1;
          draftMedia.videoImages = uniqueMedia([...draftMedia.videoImages, ...items]).slice(0, limit);
        } else {
          draftMedia.videoImages = uniqueMedia([...draftMedia.videoImages, ...items]).slice(0, 6);
        }
      } else {
        draftMedia.imageReferences = uniqueMedia([...draftMedia.imageReferences, ...items]).slice(0, 9);
        syncImageModeFromReferences();
      }
    } else if (kind === "video-reference") {
      draftMedia.videoReferences = uniqueMedia([...draftMedia.videoReferences, ...items]).slice(0, 3);
      state.settings.visualMode = "video";
    } else if (kind === "first-frame") {
      if (isDocumentedVeo31Model(state.settings.videoModel)) draftMedia.videoImages = [];
      draftMedia.firstFrame = items[0];
      state.settings.visualMode = "video";
    } else if (kind === "last-frame") {
      draftMedia.lastFrame = items[0];
      state.settings.visualMode = "video";
    } else if (kind === "audio") {
      draftMedia.audio = items[0];
      state.settings.visualMode = "video";
    }
    activeMode = "image";
    saveState();
    render();
  } catch (error) {
    showToast(normalizeError(error), true);
  }
}

function readMediaFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: generateId(),
        name: file.name,
        mime: file.type || "application/octet-stream",
        size: file.size,
        dataUrl: String(reader.result || ""),
        file,
      });
    };
    reader.onerror = () => reject(new Error(`读取文件失败：${file.name}`));
    reader.readAsDataURL(file);
  });
}

async function handleChatAttachmentFiles(event) {
  const files = Array.from(event.target.files || []);
  event.target.value = "";
  if (!files.length) return;
  try {
    const oversized = files.find((file) => file.size > 25 * 1024 * 1024);
    if (oversized) throw new Error(`文件不能超过 25MB：${oversized.name}`);
    const items = await Promise.all(files.map((file) => readChatAttachment(file)));
    chatAttachments = uniqueMedia([...chatAttachments, ...items]).slice(0, 8);
    renderChatAttachments();
  } catch (error) {
    showToast(normalizeError(error), true);
  }
}

async function readChatAttachment(file) {
  const item = await readMediaFile(file);
  if (isTextAttachment(file)) {
    item.text = await file.text();
  }
  return item;
}

function isTextAttachment(file) {
  return (
    file.type.startsWith("text/") ||
    /\.(txt|md|csv|json|xml|yaml|yml|log|js|ts|jsx|tsx|css|html|py|go|rs|java|c|cpp|h|sql)$/i.test(file.name)
  );
}

function renderChatAttachments() {
  if (!els.chatAttachmentTray) return;
  els.chatAttachmentTray.hidden = activeMode === "image" || !chatAttachments.length;
  els.chatAttachmentTray.innerHTML = chatAttachments
    .map((item) => `
      <div class="draft-media chat-attachment">
        ${item.mime.startsWith("image/") ? `<img src="${escapeAttr(item.dataUrl)}" alt="">` : `<span class="draft-file-icon">${escapeHtml(fileTypeLabel(item.mime))}</span>`}
        <span>${escapeHtml(trimFileName(item.name))}</span>
        <button type="button" aria-label="移除" data-remove-chat-attachment="${escapeAttr(item.id)}">×</button>
      </div>
    `)
    .join("");
}

function renderDraftMediaTray() {
  const items = [];
  if (activeMode !== "image") {
    els.draftMediaTray.hidden = true;
    if (els.referencePanel) els.referencePanel.hidden = true;
    return;
  }
  const isVideoMode = state.settings.visualMode === "video";
  if (!isVideoMode) {
    draftMedia.imageReferences.forEach((item) => items.push({ key: "imageReferences", label: "参考图", item }));
  } else {
    if (draftMedia.firstFrame) items.push({ key: "firstFrame", label: "首帧", item: draftMedia.firstFrame });
    if (draftMedia.lastFrame) items.push({ key: "lastFrame", label: "尾帧", item: draftMedia.lastFrame });
    draftMedia.videoImages.forEach((item) => items.push({ key: "videoImages", label: "参考图", item }));
    draftMedia.videoReferences.forEach((item) => items.push({ key: "videoReferences", label: "参考视频", item }));
    if (draftMedia.audio) items.push({ key: "audio", label: "音频", item: draftMedia.audio });
  }
  const limit = isVideoMode ? 15 : 9;
  if (els.referencePanel) els.referencePanel.hidden = false;
  if (els.referenceCount) els.referenceCount.textContent = `${items.length} / ${limit}`;
  if (els.referenceSlotHint) els.referenceSlotHint.hidden = !isVideoMode;
  els.draftMediaTray.hidden = false;
  const mediaCells = items
    .map(({ key, label, item }) => {
      const isImage = item.mime.startsWith("image/");
      return `
        <div class="draft-media" title="${escapeAttr(`${label} · ${item.name}`)}">
          ${isImage ? `<img src="${escapeAttr(item.dataUrl)}" alt="">` : `<span class="draft-file-icon">${escapeHtml(fileTypeLabel(item.mime))}</span>`}
          <span class="draft-media-badge">${escapeHtml(label)}</span>
          <button type="button" aria-label="移除" data-remove-media="${escapeAttr(key)}" data-media-id="${escapeAttr(item.id)}">×</button>
        </div>
      `;
    })
    .join("");
  const addCell = items.length < limit
    ? `<button type="button" class="reference-add" data-add-media="${isVideoMode ? "video" : "image"}" aria-label="添加参考素材">＋</button>`
    : "";
  els.draftMediaTray.innerHTML = mediaCells + addCell;
}

function removeDraftMedia(key, id) {
  if (Array.isArray(draftMedia[key])) {
    draftMedia[key] = draftMedia[key].filter((item) => item.id !== id);
  } else if (draftMedia[key]?.id === id) {
    draftMedia[key] = null;
  }
  syncImageModeFromReferences();
  saveState();
  renderDraftMediaTray();
  renderOutputOptions();
  renderVisualMeta();
}

function imageGenerationModeForReferences(references = draftMedia.imageReferences) {
  return Array.isArray(references) && references.length ? "image-to-image" : "text-to-image";
}

function syncImageModeFromReferences(references = draftMedia.imageReferences) {
  state.settings.imageMode = imageGenerationModeForReferences(references);
  return state.settings.imageMode;
}

function stopRequest() {
  if (abortController) {
    abortController.abort();
    return;
  }
  if (activeMode !== "image" || state.settings.visualMode !== "image") return;
  const imageRequestCount = activeImageRequests.size;
  activeImageRequests.forEach((controller) => controller.abort());
  if (imageRequestCount) showToast(`已停止 ${imageRequestCount} 个图片任务`);
}

function setLoading(loading) {
  els.sendButton.disabled = loading;
  const imageRequestsVisible = activeMode === "image" && state.settings.visualMode === "image" && activeImageRequests.size > 0;
  els.stopButton.hidden = !loading && !imageRequestsVisible;
  els.stopButton.title = imageRequestsVisible ? `停止 ${activeImageRequests.size} 个图片任务` : "停止";
  els.sendButton.textContent = loading ? "发送中" : activeMode === "image" ? (state.settings.visualMode === "video" ? "立即生成视频" : "立即生成图片") : "发送";
}

function syncImageRequestControls() {
  if (abortController || activeMode !== "image" || state.settings.visualMode !== "image") return;
  setLoading(false);
}

function cancelImageRequest(taskId) {
  activeImageRequests.get(taskId)?.abort();
}

function openSettings(tab = "api") {
  closeMobileSidebar();
  const requestedTab = ["api", "models", "advanced"].includes(tab) ? tab : "api";
  if (els.settingsDialog.open) {
    setSettingsTab(requestedTab);
    return;
  }
  syncSettingsForm();
  settingsFormSnapshot = serializeSettingsForm();
  hideUnsavedSettingsPrompt();
  setSettingsTab(requestedTab);
  els.apiKey.type = "password";
  els.toggleApiKey.textContent = "显示";
  els.toggleApiKey.setAttribute("aria-pressed", "false");
  if (typeof els.settingsDialog.showModal === "function") els.settingsDialog.showModal();
  else els.settingsDialog.setAttribute("open", "");
}

function closeSettings(event) {
  event?.preventDefault();
  requestSettingsClose();
}

function requestSettingsClose() {
  if (!els.settingsDialog.open) return;
  if (serializeSettingsForm() !== settingsFormSnapshot) {
    els.unsavedSettingsPrompt.hidden = false;
    requestAnimationFrame(() => els.cancelSettingsClose.focus());
    return;
  }
  closeSettingsDirect();
}

function closeSettingsDirect() {
  hideUnsavedSettingsPrompt();
  if (typeof els.settingsDialog.close === "function") els.settingsDialog.close();
  else els.settingsDialog.removeAttribute("open");
}

function hideUnsavedSettingsPrompt() {
  if (els.unsavedSettingsPrompt) els.unsavedSettingsPrompt.hidden = true;
}

function setSettingsTab(tab) {
  activeSettingsTab = ["api", "models", "advanced"].includes(tab) ? tab : "api";
  els.settingsDialog.querySelectorAll("[data-settings-tab]").forEach((button) => {
    const active = button.dataset.settingsTab === activeSettingsTab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
  els.settingsDialog.querySelectorAll("[data-settings-section]").forEach((section) => {
    const active = section.dataset.settingsSection === activeSettingsTab;
    section.hidden = !active;
    section.classList.toggle("active", active);
  });
}

function toggleApiKeyVisibility() {
  const visible = els.apiKey.type === "text";
  els.apiKey.type = visible ? "password" : "text";
  els.toggleApiKey.textContent = visible ? "显示" : "隐藏";
  els.toggleApiKey.setAttribute("aria-pressed", String(!visible));
}

function settingsFormValues() {
  return {
    baseUrl: els.baseUrl.value,
    apiKey: els.apiKey.value,
    chatModel: els.chatModel.value,
    imageModel: els.imageModel.value,
    videoModel: els.videoModel.value,
    temperature: els.temperature.value,
    contextTurns: els.contextTurns.value,
    visualContextTurns: els.visualContextTurns.value,
    imageApiStyle: els.imageApiStyle.value,
    videoApiStyle: els.videoApiStyle.value,
    imageEndpoint: els.imageEndpoint.value,
    imageEditEndpoint: els.imageEditEndpoint.value,
    videoEndpoint: els.videoEndpoint.value,
    videoStatusEndpoint: els.videoStatusEndpoint.value,
    systemPrompt: els.systemPrompt.value,
  };
}

function serializeSettingsForm() {
  return JSON.stringify(settingsFormValues());
}

function syncSettingsForm() {
  const settings = state.settings;
  fillGroupedModelSelect(els.chatModel, "chat", settings.chatModel);
  fillGroupedModelSelect(els.imageModel, "image", settings.imageModel);
  fillGroupedModelSelect(els.videoModel, "video", settings.videoModel);
  els.baseUrl.value = settings.baseUrl || "";
  els.apiKey.value = settings.apiKey || "";
  els.chatModel.value = settings.chatModel || "";
  els.imageModel.value = settings.imageModel || "";
  els.videoModel.value = settings.videoModel || "";
  els.temperature.value = settings.temperature;
  els.contextTurns.value = settings.contextTurns;
  els.visualContextTurns.value = settings.visualContextTurns;
  els.imageApiStyle.value = settings.imageApiStyle || "auto";
  els.videoApiStyle.value = settings.videoApiStyle || "auto";
  els.imageEndpoint.value = settings.imageEndpoint || DEFAULT_SETTINGS.imageEndpoint;
  els.imageEditEndpoint.value = settings.imageEditEndpoint || DEFAULT_SETTINGS.imageEditEndpoint;
  els.videoEndpoint.value = settings.videoEndpoint || DEFAULT_SETTINGS.videoEndpoint;
  els.videoStatusEndpoint.value = settings.videoStatusEndpoint || DEFAULT_SETTINGS.videoStatusEndpoint;
  els.systemPrompt.value = settings.systemPrompt || "";
  els.modelOptions.innerHTML = unique(state.modelOptions).map((model) => `<option value="${escapeAttr(model)}"></option>`).join("");
}

function fillGroupedModelSelect(select, type, current) {
  const models = selectableModelRecords(type, current);
  const groups = groupBy(models, (item) => item.vendor || "其他");
  select.innerHTML = "";
  Object.entries(groups).forEach(([vendor, items]) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = `${vendor} · ${modelTypeLabel(type)}`;
    items.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.id;
      option.textContent = model.label && model.label !== model.id ? `${model.label} (${model.id})` : model.id;
      optgroup.appendChild(option);
    });
    select.appendChild(optgroup);
  });
  select.value = current || "";
}

function modelTypeLabel(type) {
  if (type === "video") return "视频";
  if (type === "image") return "图片";
  return "语言模型";
}

function toggleModelPopover() {
  if (modelPopoverOpen) closeModelPopover();
  else openModelPopover();
}

function openModelPopover() {
  closeSettingsPopover();
  modelPopoverType = activeMode === "image" ? state.settings.visualMode : "chat";
  renderModelPopover();
  modelPopoverOpen = true;
  els.modelPopover.hidden = false;
  els.quickModelButton.setAttribute("aria-expanded", "true");
}

function closeModelPopover() {
  modelPopoverOpen = false;
  if (els.modelPopover) els.modelPopover.hidden = true;
  if (els.quickModelButton) els.quickModelButton.setAttribute("aria-expanded", "false");
}

function renderModelPopover() {
  const current = currentModelForType(modelPopoverType);
  const records = selectableModelRecords(modelPopoverType, current).filter((item) => !isHiddenModel(item.id));
  els.modelPopoverList.innerHTML = records.length
    ? records
        .map((model) => {
          const active = model.id === current;
          const vendor = model.vendor || "";
          const initial = vendor ? vendor.charAt(0).toUpperCase() : "✦";
          const name = model.label && model.label !== model.id ? model.label : model.id;
          return `
          <button class="model-popover-item${active ? " active" : ""}" type="button" role="option" aria-selected="${active}" data-popover-model-id="${escapeAttr(model.id)}">
            <span class="vendor-icon" aria-hidden="true">${escapeHtml(initial)}</span>
            <span class="model-popover-text">
              <strong>${escapeHtml(name)}</strong>
              ${name !== model.id ? `<small>${escapeHtml(model.id)}</small>` : ""}
            </span>
            ${active ? '<span class="model-popover-check" aria-hidden="true">✓</span>' : ""}
          </button>`;
        })
        .join("")
    : '<div class="model-popover-empty">没有可选模型</div>';
}

function currentModelForType(type) {
  if (type === "video") return state.settings.videoModel;
  if (type === "image") return state.settings.imageModel;
  return state.settings.chatModel;
}

function applyModelSelection(type, modelId) {
  if (type === "video") {
    state.settings.videoModel = modelId;
    normalizeDocumentedVeo31DraftForModel();
  }
  else if (type === "image") {
    state.settings.imageModel = modelId;
    state.settings.imageQuality = normalizeImageQualityForModel(modelId, state.settings.imageQuality);
  }
  else state.settings.chatModel = modelId;
  state.modelOptions = unique([modelId, ...state.modelOptions.filter((id) => !isHiddenModel(id))]);
  saveState();
}

function pickModelFromPopover(modelId) {
  if (!modelId || isHiddenModel(modelId)) return;
  applyModelSelection(modelPopoverType, modelId);
  closeModelPopover();
  render();
}

function saveSettingsFromForm(options = {}) {
  const values = settingsFormValues();
  state.settings = {
    ...state.settings,
    baseUrl: normalizeApiBaseUrl(values.baseUrl) || DEFAULT_API_BASE_URL,
    apiKey: values.apiKey.trim(),
    chatModel: values.chatModel,
    imageModel: values.imageModel || state.settings.imageModel,
    videoModel: values.videoModel || state.settings.videoModel,
    temperature: clampNumber(values.temperature, 0, 2, 0.7),
    contextTurns: clampNumber(values.contextTurns, 1, 50, 10),
    visualContextTurns: clampNumber(values.visualContextTurns, 1, 10, 4),
    imageApiStyle: values.imageApiStyle,
    videoApiStyle: values.videoApiStyle,
    imageEndpoint: normalizeEndpoint(values.imageEndpoint, DEFAULT_SETTINGS.imageEndpoint),
    imageEditEndpoint: normalizeEndpoint(values.imageEditEndpoint, DEFAULT_SETTINGS.imageEditEndpoint),
    videoEndpoint: normalizeEndpoint(values.videoEndpoint, DEFAULT_SETTINGS.videoEndpoint),
    videoStatusEndpoint: normalizeEndpoint(values.videoStatusEndpoint, DEFAULT_SETTINGS.videoStatusEndpoint),
    systemPrompt: values.systemPrompt,
  };
  state.settings.imageQuality = normalizeImageQualityForModel(
    state.settings.imageModel,
    state.settings.imageQuality
  );
  state.modelOptions = unique([
    state.settings.chatModel,
    state.settings.imageModel,
    state.settings.videoModel,
    ...state.modelOptions,
  ]).filter(Boolean);
  saveState();
  render();
  settingsFormSnapshot = serializeSettingsForm();
  hideUnsavedSettingsPrompt();
  showToast("已保存");
  if (options.closeAfterSave) closeSettingsDirect();
}

function normalizeEndpoint(value, fallback) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return fallback;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

async function fetchModels() {
  const formOpen = Boolean(els.settingsDialog?.open);
  const draft = formOpen ? settingsFormValues() : null;
  const connection = settingsConnectionValues();
  if (!validateSettingsConnection(connection)) return;
  const trigger = formOpen ? els.reloadModels : null;
  setSettingsActionLoading(trigger, true, "获取中");
  setConnection("测试中", "", "正在通过 /v1/models 获取模型列表...");
  try {
    const response = await fetch(apiUrlForBase(connection.baseUrl, "/v1/models"), {
      headers: authHeadersForKey(connection.apiKey, false),
    });
    if (!response.ok) throw new Error(await responseError(response));
    const data = await response.json();
    const records = normalizeModelRecords(data.data || []);
    const models = records.map((item) => item.id);
    if (records.length) {
      state.modelRecords = records;
      state.modelOptions = unique([
        draft?.chatModel || state.settings.chatModel,
        draft?.imageModel || state.settings.imageModel,
        draft?.videoModel || state.settings.videoModel,
        ...models,
      ]);
      const selectedChat = records.find((item) => item.id === state.settings.chatModel);
      const selectedImage = records.find((item) => item.id === state.settings.imageModel);
      const selectedVideo = records.find((item) => item.id === state.settings.videoModel);
      if (!state.settings.chatModel || isHiddenModel(state.settings.chatModel) || (selectedChat && selectedChat.type !== "chat")) {
        state.settings.chatModel = records.find((item) => item.type === "chat")?.id || models[0];
      }
      if (!state.settings.imageModel || isHiddenModel(state.settings.imageModel) || (selectedImage && selectedImage.type !== "image")) {
        state.settings.imageModel = records.find((item) => item.type === "image")?.id || DEFAULT_SETTINGS.imageModel;
      }
      if (!state.settings.videoModel || isHiddenModel(state.settings.videoModel) || (selectedVideo && selectedVideo.type !== "video")) {
        state.settings.videoModel = records.find((item) => item.type === "video")?.id || DEFAULT_SETTINGS.videoModel;
      }
      saveState();
      renderControls();
      if (draft) refreshSettingsModelSelects(draft);
      else syncSettingsForm();
    }
    setConnection("连接成功", "ok", `已通过 /v1/models 获取 ${models.length || 0} 个模型。`);
    showToast("模型列表已更新");
  } catch (error) {
    const message = normalizeError(error);
    setConnection("连接失败", "error", message);
    showToast(message, true);
  } finally {
    setSettingsActionLoading(trigger, false);
  }
}

async function testConnection() {
  const connection = settingsConnectionValues();
  if (!validateSettingsConnection(connection)) return;
  setSettingsActionLoading(els.testConnection, true, "测试中");
  setConnection("测试中", "", "正在验证 /v1/models；不会调用推理模型...");
  try {
    const response = await fetch(apiUrlForBase(connection.baseUrl, "/v1/models"), {
      headers: authHeadersForKey(connection.apiKey, false),
    });
    if (!response.ok) throw new Error(await responseError(response));
    const data = await response.json();
    const count = Array.isArray(data?.data) ? data.data.length : 0;
    setConnection("连接成功", "ok", `服务响应正常，可读取 ${count} 个模型；本测试未调用任何推理模型。`);
  } catch (error) {
    setConnection("连接失败", "error", `${normalizeError(error)}；测试结果不影响保存，可在“模型设置”切换已有模型。`);
  } finally {
    setSettingsActionLoading(els.testConnection, false);
  }
}

function settingsConnectionValues() {
  if (els.settingsDialog?.open) {
    return {
      baseUrl: els.baseUrl.value.trim().replace(/\/+$/, ""),
      apiKey: els.apiKey.value.trim(),
    };
  }
  return {
    baseUrl: String(state.settings.baseUrl || "").trim().replace(/\/+$/, ""),
    apiKey: String(state.settings.apiKey || "").trim(),
  };
}

function validateSettingsConnection(connection) {
  if (connection.baseUrl && connection.apiKey) return true;
  const message = "请填写 API Base URL 和 API Key";
  setConnection("连接失败", "error", message);
  showToast(message, true);
  return false;
}

function refreshSettingsModelSelects(values) {
  const validModel = (modelId, type, fallback) => {
    const record = state.modelRecords.find((item) => item.id === modelId);
    return record && record.type !== type ? fallback : modelId;
  };
  const chatModel = validModel(values.chatModel, "chat", state.settings.chatModel);
  const imageModel = validModel(values.imageModel, "image", state.settings.imageModel);
  const videoModel = validModel(values.videoModel, "video", state.settings.videoModel);
  fillGroupedModelSelect(els.chatModel, "chat", chatModel);
  fillGroupedModelSelect(els.imageModel, "image", imageModel);
  fillGroupedModelSelect(els.videoModel, "video", videoModel);
  els.chatModel.value = chatModel;
  els.imageModel.value = imageModel;
  els.videoModel.value = videoModel;
}

function setSettingsActionLoading(button, loading, loadingText = "处理中") {
  if (!button) return;
  if (loading) {
    button.dataset.idleText = button.textContent;
    button.textContent = loadingText;
  } else {
    button.textContent = button.dataset.idleText || button.textContent;
    delete button.dataset.idleText;
  }
  button.disabled = loading;
  button.classList.toggle("is-loading", loading);
}

function setConnection(text, type = "", detail = "") {
  els.connectionState.textContent = text;
  els.connectionState.className = `status-pill ${type}`.trim();
  if (els.connectionDetail) {
    els.connectionDetail.textContent = detail;
    els.connectionDetail.className = `connection-detail ${type}`.trim();
    els.connectionDetail.hidden = !detail;
  }
}

function apiUrl(path) {
  return apiUrlForBase(state.settings.baseUrl, path);
}

function apiUrlForBase(baseUrl, path) {
  const base = normalizeApiBaseUrl(baseUrl);
  if (!base) throw new Error("API Base URL 不能为空");
  if (isLinkMeshProxyPath(path) || isDeeplinkProxyPath(path) || isDeepRouterProxyPath(path)) return path;
  let target = path;
  if (!/^https?:\/\//i.test(path)) {
    if (base.endsWith("/v1") && path.startsWith("/v1/")) target = `${base}${path.slice(3)}`;
    else if (base.endsWith("/v1") && path.startsWith("/v1beta/")) target = `${base.slice(0, -3)}${path}`;
    else target = `${base}${path}`;
  }
  // LinkMesh does not allow browser preflight requests, so its fixed
  // same-origin route remains enabled. Other gateways stay direct and must
  // provide CORS themselves; this is not an open proxy.
  if (isSameOriginUrl(target)) return target;
  return linkMeshProxyUrl(target) || deeplinkProxyUrl(target) || target;
}

function isSameOriginUrl(value) {
  try {
    if (typeof window === "undefined" || !window.location?.origin) return false;
    return new URL(String(value || ""), window.location.origin).origin === window.location.origin;
  } catch {
    return false;
  }
}

function deeplinkProxyUrl(value) {
  try {
    const url = new URL(String(value || ""));
    if (!DEEPLINK_API_HOSTS.has(url.hostname.toLowerCase())) return "";
    return `${DEEPLINK_PROXY_PREFIX}${url.pathname}${url.search}`;
  } catch {
    return "";
  }
}

function linkMeshProxyUrl(value) {
  try {
    const url = new URL(String(value || ""));
    const host = url.hostname.toLowerCase();
    if (!LINKMESH_API_HOSTS.has(host)) return "";
    const prefix = host === "api.linkmesh.org"
      ? LINKMESH_API_PROXY_PREFIX
      : host === "www.linkmesh.org" || host === "linkmesh.org"
        ? LINKMESH_WWW_PROXY_PREFIX
        : LINKMESH_PROXY_PREFIX;
    return `${prefix}${url.pathname}${url.search}`;
  } catch {
    return "";
  }
}

function isLinkMeshProxyPath(value) {
  return /^\/__linkmesh(?:-api|-www)?\//.test(String(value || ""));
}

function isDeeplinkProxyPath(value) {
  return String(value || "").startsWith(`${DEEPLINK_PROXY_PREFIX}/`);
}

function deepRouterApiProxyUrl(value) {
  try {
    const url = new URL(String(value || ""));
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host !== DEEPROUTER_API_HOST || !/^\/(?:v1|v1beta|api)(?:\/|$)/i.test(url.pathname)) return "";
    return `${DEEPROUTER_PROXY_PREFIX}${url.pathname}${url.search}`;
  } catch {
    return "";
  }
}

function isDeepRouterProxyPath(value) {
  return String(value || "").startsWith(`${DEEPROUTER_PROXY_PREFIX}/`);
}

function normalizeApiBaseUrl(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "");
}

function ensureApiReady() {
  if (!state.settings.baseUrl || !state.settings.apiKey) {
    showMissingSetting("请先填写 API Base URL 和 API Key");
    return false;
  }
  return true;
}

function showMissingSetting(message) {
  showToast(message, true);
  openSettings();
}

function authHeaders(includeContentType = true) {
  return authHeadersForKey(state.settings.apiKey, includeContentType);
}

function authHeadersForKey(apiKey, includeContentType = true) {
  const headers = {};
  headers.Accept = "application/json";
  if (includeContentType) headers["Content-Type"] = "application/json";
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  return headers;
}

function rawAuthHeaders() {
  const headers = { Accept: "application/json" };
  if (state.settings.apiKey) headers.Authorization = state.settings.apiKey;
  return headers;
}

async function responseError(response) {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return deepestApiErrorMessage(json) || `${response.status} ${response.statusText}`;
  } catch {
    return summarizeApiResponseText(text, response.status, response.statusText);
  }
}

async function parseApiJsonResponse(response, label = "API 接口") {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    const error = new Error(`${label}：${summarizeApiResponseText(text, response.status, response.statusText)}`);
    error.code = "invalid_json_response";
    throw error;
  }
}

function summarizeApiResponseText(text, status = 0, statusText = "") {
  const value = String(text || "").trim();
  if (/<html|<!doctype|_next\/static|This page could not be found/i.test(value)) {
    const statusLabel = status ? `HTTP ${status}` : "上游 404";
    if (isKlingModel(state.settings.videoModel)) {
      return `Kling 上游返回了网页而不是 JSON（${statusLabel}）。DeepRouter 当前渠道未映射 Kling 3.0 Omni 专用端点；渠道 API 地址应为 https://api.bananarouter.com，并需要服务端支持 Kling 3.0 Omni TaskAdaptor。`;
    }
    return `上游接口返回了网页而不是 JSON（${statusLabel}），请检查渠道 API 地址和端点映射。`;
  }
  if (!value) return status ? `${status} ${statusText}`.trim() : "接口返回了空响应";
  return value.length > 500 ? `${value.slice(0, 500)}...` : value;
}

function deepestApiErrorMessage(value, depth = 0) {
  if (value === null || value === undefined || depth > 6) return "";
  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return "";
    if (/<html|<!doctype|_next\/static|This page could not be found/i.test(text)) {
      return summarizeApiResponseText(text);
    }
    const embedded = parseJsonPayload(text);
    return embedded ? deepestApiErrorMessage(embedded, depth + 1) || text : text;
  }
  if (typeof value !== "object") return String(value);
  const candidates = [
    value.error?.message,
    value.error,
    value.message,
    value.data?.error?.message,
    value.data?.error,
    value.data?.message,
    value.reason,
  ];
  for (const candidate of candidates) {
    const message = deepestApiErrorMessage(candidate, depth + 1);
    if (message) return message;
  }
  return "";
}

function normalizeError(error) {
  const message = error?.message || String(error);
  if (isDeepRouterBaseUrl() && /(?:artifact[_ ]gone|Artifact content is no longer available)/i.test(message)) {
    return "DeepRouter 视频任务已完成，但 New API 未保留或无法代理上游视频文件（artifact_gone）。";
  }
  const invalidPlatform = String(message).match(/invalid[_ ]api[_ ]platform\s*:?\s*(\d+)/i);
  if (isGrokVideoModel(state.settings.videoModel) && invalidPlatform) {
    const model = state.settings.videoModel || "当前 Grok 视频模型";
    return `DeepRouter 的 ${model} 当前渠道返回 invalid api platform: ${invalidPlatform[1]}。该错误来自 /v1/videos Multipart 路由；当前客户端已改用验证成功的 /v1/videos/generations JSON 创建接口。`;
  }
  if (isDeepRouterBaseUrl()
      && isGrokVideoModel(state.settings.videoModel)
      && /plugin[_ ]usage[_ ]invalid|plugin usage enum is not an allowed value/i.test(message)) {
    const model = state.settings.videoModel || "当前 Grok 视频模型";
    return `DeepRouter 的 ${model} 渠道返回 plugin_usage_invalid。客户端已使用 /v1/videos/generations 的直接 JSON 请求格式；请确认服务端将该模型映射到 Sub2API 的 Grok 视频渠道，并且上游没有注入 plugin_usage 参数。`;
  }
  if (/Failed to fetch|NetworkError when attempting to fetch resource|Load failed/i.test(message)) {
    return "请求失败：请检查 API 地址、密钥、HTTPS 和 CORS 设置。";
  }
  return message;
}

function extractImageUrls(data) {
  const urls = [];
  const pushUrl = (value, mime = "image/png") => {
    if (!value) return;
    if (typeof value === "string") {
      urls.push(value.startsWith("data:") || value.startsWith("http") ? value : `data:${mime};base64,${value}`);
    }
  };
  const visit = (value, key = "") => {
    if (value === null || value === undefined) return;
    const lowerKey = String(key).toLowerCase();
    if (typeof value === "string") {
      const text = value.trim();
      if (!text) return;
      if ((text.startsWith("{") || text.startsWith("[")) && text.length < 200000) {
        try {
          visit(JSON.parse(text), key);
        } catch {
          // Continue parsing as plain text.
        }
      }
      if (text.startsWith("data:image/")) {
        pushUrl(text);
        return;
      }
      const dataUriMatches = text.match(/data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=\s]+/gi) || [];
      dataUriMatches.forEach((match) => pushUrl(match.replace(/\s/g, "")));
      const markdownMatches = [...text.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/gi)];
      markdownMatches.forEach((match) => pushUrl(match[1]));
      if (/(image|url|output|file|download|content|result|media|asset|source|src|data|response)/.test(lowerKey)) {
        const embeddedUrls = text.match(/https?:\/\/[^\s)"'<>]+/gi) || [];
        embeddedUrls.forEach((url) => pushUrl(url.replace(/[.,;]+$/, "")));
      }
      if (/^https?:\/\//i.test(text)) {
        if (/(image|url|output|file|download|content|result|media|asset|source|src|data|response)/.test(lowerKey) || /\.(png|jpe?g|webp|gif|avif)(?:[?#].*)?$/i.test(text)) {
          pushUrl(text);
        }
      } else if (/(base64|b64|b64_json|image_base64|inline.*data|^image$|image_data|^data$|^output$|^result$|bytes)/.test(lowerKey) && /^[A-Za-z0-9+/=\s]+$/.test(text) && text.length > 200) {
        pushUrl(text.replace(/\s/g, ""));
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, key));
      return;
    }
    if (typeof value === "object") {
      if (/^inline_?data$/i.test(String(key)) && typeof value.data === "string") {
        const mime = value.mimeType || value.mime_type || "image/png";
        if (String(mime).toLowerCase().startsWith("image/")) pushUrl(value.data.replace(/\s/g, ""), mime);
        return;
      }
      Object.entries(value).forEach(([childKey, childValue]) => visit(childValue, childKey));
    }
  };
  visit(data, "root");
  return unique(urls);
}

function extractVideoUrls(data) {
  const urls = [];
  const pushUrl = (value, mime = "video/mp4") => {
    if (!value) return;
    if (typeof value === "string") {
      if (value.startsWith("data:")) urls.push(value);
      else if (/^https?:\/\//i.test(value)) urls.push(apiUrl(value));
      else if (value.startsWith("/")) urls.push(apiUrl(value));
      else urls.push(`data:${mime};base64,${value}`);
    }
  };
  const visit = (value, key = "") => {
    if (value === null || value === undefined) return;
    const lowerKey = String(key).toLowerCase();
    if (/(?:^|_)(?:thumbnail|poster|cover)(?:$|_)/.test(lowerKey)) return;
    if (typeof value === "string") {
      const text = value.trim();
      if (!text) return;
      if ((text.startsWith("{") || text.startsWith("[")) && text.length < 200000) {
        const embedded = parseJsonPayload(text);
        if (embedded) {
          visit(embedded, key);
          return;
        }
      }
      if (text.startsWith("data:video/")) pushUrl(text);
      else if (/^https?:\/\//i.test(text)) {
        if (/\.(?:png|jpe?g|webp|gif|avif)(?:[?#].*)?$/i.test(text)) return;
        if (/(video|url|uri|output|file|download|content|result|media|asset|source|src)/.test(lowerKey) || /\.(mp4|webm|mov|m3u8)(?:[?#].*)?$/i.test(text)) {
          pushUrl(text);
        }
      } else if (text.startsWith("/") && /(video|url|uri|output|file|download|content|result|media|asset|source|src)/.test(lowerKey)) {
        pushUrl(text);
      } else if (/(base64|b64|video_base64|b64_json)/.test(lowerKey) && /^[A-Za-z0-9+/=\s]+$/.test(text) && text.length > 80) {
        pushUrl(text.replace(/\s/g, ""));
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, key));
      return;
    }
    if (typeof value === "object") {
      Object.entries(value).forEach(([childKey, childValue]) => visit(childValue, childKey));
    }
  };
  visit(data, "root");
  const candidates = unique(urls);
  const directlyPlayable = candidates.filter((url) => !isAuthenticatedVideoProxyUrl(url));
  return directlyPlayable.length ? directlyPlayable : candidates;
}

function videoResultUrlsForTask(data, task) {
  const media = extractVideoUrls(data);
  if (media.length) return media;
  const status = String(extractTaskStatus(data) || "").toLowerCase();
  const completed = ["succeeded", "success", "completed", "complete", "finished", "done"].includes(status);
  const supportsContentDownload = task?.provider === "xai"
    || (task?.provider === "veo" && task?.requestEndpoint === "/v1/videos");
  if (!completed || !supportsContentDownload || !task?.jobId) return [];
  const id = encodeVideoTaskId(task.jobId, task);
  return [apiUrl(`/v1/videos/${id}/content`)];
}

async function materializeVideoUrls(urls, task) {
  return Promise.all((urls || []).map(async (source, index) => {
    if (!isAuthenticatedVideoProxyUrl(source)) return source;
    const response = await fetchVideoTaskResource(apiUrl(source), task);
    if (!response.ok) throw new Error(`视频结果下载失败：${await responseError(response)}`);
    const contentType = String(response.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("application/json") || contentType.startsWith("text/")) {
      const text = await response.text();
      const payload = parseJsonPayload(text);
      throw new Error(`视频结果下载失败：${deepestApiErrorMessage(payload) || text || "接口未返回视频文件"}`);
    }
    const blob = await response.blob();
    if (!blob.size) throw new Error("视频结果下载失败：返回文件为空");
    const key = task?.mediaCacheKeys?.[index] || visualMediaCacheKey(task?.id || "video", index);
    if (typeof indexedDB !== "undefined") {
      try {
        await putVisualMediaCache(key, task?.id || "video", blob);
      } catch (error) {
        console.warn("Unable to cache authenticated video result", error);
      }
    }
    const oldUrl = cachedMediaObjectUrls.get(key);
    if (oldUrl) URL.revokeObjectURL(oldUrl);
    const objectUrl = URL.createObjectURL(blob);
    cachedMediaObjectUrls.set(key, objectUrl);
    if (task) {
      task.mediaCacheKeys = [...(task.mediaCacheKeys || [])];
      task.mediaCacheKeys[index] = key;
      task.mediaSourceUrls = [...(task.mediaSourceUrls || [])];
      task.mediaSourceUrls[index] = source;
    }
    return objectUrl;
  }));
}

function isAuthenticatedVideoProxyUrl(value) {
  if (isLinkMeshProxyPath(value)) {
    return /^\/__linkmesh(?:-api|-www)?\/v1\/videos\/[^/]+\/content\/?$/i.test(String(value));
  }
  if (isDeeplinkProxyPath(value)) {
    return /^\/__deeplink\/v1\/videos\/[^/]+\/content\/?$/i.test(String(value));
  }
  if (isDeepRouterProxyPath(value)) {
    return /^\/__deeprouter\/v1\/videos\/[^/]+\/content\/?$/i.test(String(value));
  }
  try {
    const url = new URL(String(value || ""));
    const base = new URL(normalizeApiBaseUrl(state.settings.baseUrl) || DEFAULT_API_BASE_URL);
    const hostname = (host) => String(host || "").replace(/^www\./i, "").toLowerCase();
    return hostname(url.hostname) === hostname(base.hostname)
      && url.protocol === base.protocol
      && url.port === base.port
      && /^\/v1\/videos\/[^/]+\/content\/?$/i.test(url.pathname);
  } catch {
    return false;
  }
}

function extractJobId(data) {
  const direct = data?.id || data?.task_id || data?.taskId || data?.job_id || data?.jobId || data?.request_id || data?.requestId || data?.name;
  if (direct) return direct;
  return findNestedValue(data, (key, value) => {
    const lowerKey = key.toLowerCase();
    return typeof value === "string" && /(task|job|request).*id|^(id)$/.test(lowerKey) && /^task_|^[A-Za-z0-9_-]{12,}$/.test(value);
  }) || "";
}

function extractImageJobId(data) {
  const explicit = data?.task_id || data?.taskId || data?.job_id || data?.jobId || data?.operation_id || data?.operationId;
  if (explicit) return String(explicit);
  const nested = findNestedValue(data, (key, value) => {
    return typeof value === "string" && /(task|job|operation).*id/i.test(key) && value.length >= 8;
  });
  if (nested) return String(nested);
  const status = extractTaskStatus(data);
  const id = data?.id;
  return isLikelyAsyncImageTask(id, status) ? String(id) : "";
}

function isLikelyAsyncImageTask(jobId, status = "") {
  const id = String(jobId || "").toLowerCase();
  const normalizedStatus = String(status || "").toLowerCase();
  if (!id) return false;
  if (/^(chatcmpl|resp|request|req)[-_]/.test(id)) return false;
  if (["queued", "pending", "processing", "running", "in_progress", "submitted"].includes(normalizedStatus)) return true;
  return /^(task|job|operation|img|image_task|img_task)[-_]/.test(id);
}

function extractTaskStatus(data) {
  if (data?.done === true) return data?.error ? "failed" : "done";
  if (data?.done === false) return "processing";
  return (
    data?.status ||
    data?.state ||
    data?.task_status ||
    data?.taskStatus ||
    data?.data?.status ||
    data?.data?.state ||
    findNestedValue(data, (key, value) => typeof value === "string" && /status|state|task_status/i.test(key)) ||
    ""
  );
}

function extractErrorMessage(data) {
  return deepestApiErrorMessage(data)
    || findNestedValue(data, (key, value) => typeof value === "string" && /error|message|reason/i.test(key))
    || "";
}

function findNestedValue(value, predicate) {
  const stack = [{ value, key: "" }];
  const seen = new Set();
  while (stack.length) {
    const item = stack.pop();
    if (!item || item.value === null || item.value === undefined) continue;
    if (typeof item.value !== "object") {
      if (typeof item.value === "string") {
        const text = item.value.trim();
        if ((text.startsWith("{") || text.startsWith("[")) && text.length < 200000) {
          const embedded = parseJsonPayload(text);
          if (embedded) stack.push({ value: embedded, key: item.key });
        }
      }
      if (predicate(item.key, item.value)) return item.value;
      continue;
    }
    if (seen.has(item.value)) continue;
    seen.add(item.value);
    if (Array.isArray(item.value)) {
      item.value.forEach((child) => stack.push({ value: child, key: item.key }));
    } else {
      Object.entries(item.value).forEach(([key, child]) => stack.push({ value: child, key }));
    }
  }
  return "";
}

function autoResizePrompt() {
  els.promptInput.style.height = "auto";
  els.promptInput.style.height = `${Math.min(220, Math.max(54, els.promptInput.scrollHeight))}px`;
}

function exportData() {
  const payload = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `deep-iamge2-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importData(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    state = normalizeState(parsed.state || parsed);
    activeMode = state.activeMode || "image";
    activeSessionId = state.activeSessionId || state.sessions[0]?.id;
    activeVisualSessionId = state.activeVisualSessionId || state.visualSessions[0]?.id;
    chatAttachments = [];
    saveState();
    render();
    if (els.settingsDialog?.open) settingsFormSnapshot = serializeSettingsForm();
    showToast("已导入");
  } catch {
    showToast("导入失败：JSON 格式无效", true);
  }
}

function clearAllData() {
  if (!window.confirm("确认清空本地配置、会话和视觉任务历史？")) return;
  void clearVisualMediaCache();
  state = createInitialState();
  activeMode = state.activeMode;
  activeSessionId = state.activeSessionId;
  activeVisualSessionId = state.activeVisualSessionId;
  draftMedia = createEmptyDraftMedia();
  chatAttachments = [];
  saveState();
  render();
  if (els.settingsDialog?.open) settingsFormSnapshot = serializeSettingsForm();
}

function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.toggle("error", isError);
  els.toast.hidden = false;
  toastTimer = setTimeout(() => {
    els.toast.hidden = true;
  }, isError ? 5200 : 2600);
}

async function copyText(text) {
  try {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        // HTTP deployments may expose Clipboard API but reject writes.
      }
    }
    if (!copied) {
      const input = document.createElement("textarea");
      input.value = String(text || "");
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      copied = document.execCommand("copy");
      input.remove();
      if (!copied) throw new Error("copy unavailable");
    }
    showToast("已复制");
  } catch {
    showToast("复制失败", true);
  }
}

function getModelProfile(modelId) {
  const fetched = state?.modelRecords?.find((item) => item.id === modelId);
  return fetched || MODEL_CATALOG.find((item) => item.id === modelId) || inferModelProfile(modelId);
}

function normalizeModelRecords(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      const raw = typeof item === "string" ? { id: item } : item || {};
      const id = raw.id || raw.name || raw.model || "";
      if (!id) return null;
      const inferred = inferModelProfile(id, raw);
      return {
        ...inferred,
        id,
        label: raw.display_name || raw.label || raw.name || inferred.label || id,
        vendor: classifyModelVendor(id, raw, inferred.vendor),
        type: normalizeModelType(raw.type, inferred.type),
        provider: inferred.provider,
        source: "api",
        raw,
      };
    })
    .filter((record) => record && !isHiddenModel(record.id));
}

function normalizeModelType(value, fallback = "chat") {
  const type = String(value || "").toLowerCase();
  if (fallback === "image" || fallback === "video") return fallback;
  if (!type || type === "model") return fallback;
  if (/video/.test(type)) return "video";
  if (/image|picture|photo/.test(type)) return "image";
  if (/chat|text|language/.test(type)) return "chat";
  return fallback;
}

function selectableModelRecords(type, current) {
  const byId = new Map();
  (state.modelRecords || []).forEach((record) => {
    if (record.type === type && !isHiddenModel(record.id)) byId.set(record.id, record);
  });
  state.modelOptions.forEach((id) => {
    if (isHiddenModel(id)) return;
    const profile = getModelProfile(id);
    if (profile?.type === type && !byId.has(id)) byId.set(id, { ...profile, source: "manual" });
  });
  if (current && !isHiddenModel(current) && !byId.has(current)) {
    const profile = getModelProfile(current);
    if (profile?.type === type) byId.set(current, { ...profile, source: "current" });
  }
  return [...byId.values()].sort((a, b) => {
    const vendor = String(a.vendor || "").localeCompare(String(b.vendor || ""), "zh-CN");
    if (vendor) return vendor;
    return String(a.id).localeCompare(String(b.id), "zh-CN");
  });
}

function inferModelProfile(modelId, raw = {}) {
  const id = String(modelId || "").toLowerCase();
  const owner = String(raw.owned_by || raw.vendor || raw.provider || "").toLowerCase();
  if (!id) return null;
  if (isKlingModel(id)) {
    return {
      id: modelId,
      label: modelId,
      vendor: "Kling",
      type: "video",
      provider: "kling",
      capabilities: ["文生视频", "图生视频"],
    };
  }
  if (isSora2Model(id)) return { id: modelId, label: modelId, vendor: "OpenAI", type: "video", provider: "sora", capabilities: ["视频"] };
  if (id.includes("veo")) return { id: modelId, label: modelId, vendor: "Google", type: "video", provider: "veo", capabilities: ["视频"] };
  if (id.includes("seedance")) return { id: modelId, label: modelId, vendor: "Doubao", type: "video", provider: "seedance", capabilities: ["视频"] };
  if (isMuseVideoModel(id)) {
    return { id: modelId, label: modelId, vendor: "Muse", type: "video", provider: "muse", capabilities: ["文生视频", "图生视频", "首帧", "参考图"] };
  }
  if (id.includes("grok") && id.includes("video")) {
    return { id: modelId, label: modelId, vendor: "xAI", type: "video", provider: "xai", capabilities: ["文生视频", "图生视频"] };
  }
  if (/(kling|runway|luma|hailuo|vidu|sora|wan-|video)/.test(id)) {
    return { id: modelId, label: modelId, vendor: inferVendor(id, owner), type: "video", provider: inferProvider(id, owner), capabilities: ["视频"] };
  }
  if (id.includes("seedream")) return { id: modelId, label: modelId, vendor: "Doubao", type: "image", provider: "seed", capabilities: ["图片"] };
  if (id.includes("imagen")) return { id: modelId, label: modelId, vendor: "Google", type: "image", provider: "gemini", capabilities: ["图片"] };
  if (/nano[-_. ]?banana|banana[-_. ]?(?:2|pro|image)/.test(id)) {
    return { id: modelId, label: modelId, vendor: "Gemini", type: "image", provider: "gemini", capabilities: ["图片"] };
  }
  if (id.includes("gemini") && /(image|vision|preview-image|generate-image)/.test(id)) {
    return { id: modelId, label: modelId, vendor: "Gemini", type: "image", provider: "gemini", capabilities: ["图片"] };
  }
  if (id.includes("gpt-image") || id.includes("dall-e")) return { id: modelId, label: modelId, vendor: "OpenAI", type: "image", provider: "openai", capabilities: ["图片"] };
  if (/(flux|stable-diffusion|sd-|image|photo|draw|paint)/.test(id)) {
    return { id: modelId, label: modelId, vendor: inferVendor(id, owner), type: "image", provider: inferProvider(id, owner), capabilities: ["图片"] };
  }
  return { id: modelId, label: modelId, vendor: inferVendor(id, owner), type: "chat", provider: inferProvider(id, owner), capabilities: ["文本"] };
}

function inferVendor(id, owner = "") {
  const modelVendor = inferVendorFromModelId(id);
  if (modelVendor) return modelVendor;
  const source = String(owner || "").toLowerCase();
  if (/aws|bedrock/.test(source)) return "AWS";
  if (/azure/.test(source)) return "Azure";
  if (/c-code|ccode/.test(source)) return "C-Code";
  if (/claude-max/.test(source)) return "Claude-Max";
  if (/codex/.test(source)) return "Codex";
  if (/vertex/.test(source)) return "Vertex";
  if (/vercel/.test(source)) return "Vercel";
  if (/anthropic|claude/.test(source)) return "Claude";
  if (/gemini/.test(source)) return "Gemini";
  if (/google/.test(source)) return "Google";
  if (/xai|grok/.test(source)) return "xAI";
  if (/deepseek/.test(source)) return "DeepSeek";
  if (/zhipu|glm/.test(source)) return "GLM";
  if (/moonshot|kimi/.test(source)) return "Kimi";
  if (/minimax/.test(source)) return "MiniMax";
  if (/qwen|aliyun|tongyi|dashscope/.test(source)) return "Qwen";
  if (/doubao|bytedance|volc/.test(source)) return "Doubao";
  if (/openai/.test(source)) return "OpenAI";
  return owner || "其他";
}

function inferVendorFromModelId(modelId) {
  const id = String(modelId || "").toLowerCase();
  if (!id) return "";
  if (/kling/.test(id)) return "Kling";
  if (/gemini|nano[-_. ]?banana/.test(id)) return "Gemini";
  if (/deepseek/.test(id)) return "DeepSeek";
  if (/(?:^|[-_.\/])(?:chat)?glm(?:[-_.\/]|$)|zhipu/.test(id)) return "GLM";
  if (/kimi|moonshot/.test(id)) return "Kimi";
  if (/minimax|(?:^|[-_.\/])abab(?:[-_.\/]|$)/.test(id)) return "MiniMax";
  if (/qwen|(?:^|[-_.\/])qwq(?:[-_.\/]|$)|(?:^|[-_.\/])qvq(?:[-_.\/]|$)|tongyi/.test(id)) return "Qwen";
  if (/doubao|seedream|seedance|jimeng/.test(id)) return "Doubao";
  if (/grok|(?:^|[-_.\/])xai(?:[-_.\/]|$)/.test(id)) return "xAI";
  if (/claude-max/.test(id)) return "Claude-Max";
  if (/anthropic|claude/.test(id)) return "Claude";
  if (/gpt|chatgpt|dall-e|openai|(?:^|[-_.\/])o[134](?:[-_.\/]|$)/.test(id)) return "OpenAI";
  if (/veo|imagen/.test(id)) return "Google";
  if (/aws|bedrock/.test(id)) return "AWS";
  if (/azure/.test(id)) return "Azure";
  if (/c-code|ccode/.test(id)) return "C-Code";
  if (/codex/.test(id)) return "Codex";
  if (/vertex/.test(id)) return "Vertex";
  if (/vercel/.test(id)) return "Vercel";
  return "";
}

function classifyModelVendor(modelId, raw, fallback) {
  const owner = String(raw.vendor || raw.provider || raw.owned_by || "").trim();
  const modelVendor = inferVendorFromModelId(modelId);
  if (modelVendor) return modelVendor;
  if (!owner || /^(system|unknown|other|default)$/i.test(owner)) return fallback || "其他";
  return inferVendor("", owner) || fallback || "其他";
}

function isHiddenModel(modelId) {
  const id = String(modelId || "").toLowerCase();
  return isSora2ProModel(id)
    || /midjourney|(^|[^a-z0-9])(mj|niji)([^a-z0-9]|$)|^(mj|niji)(?:[0-9]|[-_.\/])/.test(id);
}

function inferProvider(id, owner = "") {
  const model = String(id || "").toLowerCase();
  if (isMuseVideoModel(model)) return "muse";
  if (/kling/.test(model)) return "kling";
  if (isSora2Model(model)) return "sora";
  if (/seedance/.test(model)) return "seedance";
  if (/seedream|doubao|jimeng/.test(model)) return "seed";
  if (/xai|grok/.test(model)) return "xai";
  if (/veo/.test(model)) return "veo";
  if (/gemini|imagen|nano[-_. ]?banana/.test(model)) return "gemini";
  if (/openai|gpt|chatgpt|dall-e/.test(model)) return "openai";
  if (inferVendorFromModelId(model)) return "custom";
  const source = String(owner || "").toLowerCase();
  if (/bytedance|volc/.test(source)) return "seed";
  if (/xai|grok/.test(source)) return "xai";
  if (/google|gemini/.test(source)) return "gemini";
  if (/openai/.test(source)) return "openai";
  return "custom";
}

function resolveImageApiStyle(profile) {
  if (/gemini/i.test(String(profile?.id || ""))) return "gemini";
  if (profile?.provider === "gemini" && isBananaRouterBaseUrl()) return "gemini";
  if (state.settings.imageApiStyle === "openai") return "openai";
  if (state.settings.imageApiStyle === "gemini") return "gemini";
  if (profile?.provider === "gemini" && /googleapis\.com|generativelanguage/i.test(state.settings.baseUrl || "")) return "gemini";
  return "openai";
}

function resolveVideoApiStyle(profile) {
  if (state.settings.videoApiStyle === "generic") return "generic";
  if (state.settings.videoApiStyle === "gemini") return "gemini";
  if (profile?.provider === "veo") return "gemini";
  return "generic";
}

function imageModeLabel(profile) {
  const style = resolveImageApiStyle(profile);
  if (style === "gemini") {
    return resolveGeminiImageRoute(profile?.id) === "native" ? "Gemini generateContent" : "Gemini Chat 图片";
  }
  return "OpenAI 兼容";
}

function videoModeLabel(profile) {
  if (profile?.provider === "sora") return "NewAPI Sora 参数";
  if (profile?.provider === "kling") return "Kling 参数";
  if (profile?.provider === "veo" && usesDeepRouterVeoCompatibility(state.settings.videoModel)) return "Veo Multipart 参数";
  if (profile?.provider === "veo" && usesDeepRouterDocumentedVeo31Compatibility(state.settings.videoModel)) {
    return "Veo OpenAI 兼容参数";
  }
  if (profile?.provider === "veo" && usesNewApiVeoTask(state.settings.videoModel)) return "NewAPI Veo 参数";
  const style = resolveVideoApiStyle(profile);
  if (style === "gemini") return "Gemini/Veo 参数";
  if (profile?.provider === "seedance") return "SeedDance 参数";
  if (profile?.provider === "xai") return "Grok 参数";
  return "通用视频参数";
}

function effectiveImageSize() {
  if (state.settings.imageSize && state.settings.imageSize !== "auto") return state.settings.imageSize;
  return sizeFromAspect(state.settings.imageAspectRatio);
}

function effectiveImageOutputSize(modelId = state.settings.imageModel) {
  const profile = getModelProfile(modelId);
  if (isSeedreamModel(modelId)) {
    return SEEDREAM_SIZE_OPTIONS.some((option) => option.value === state.settings.imageSize)
      ? state.settings.imageSize
      : "2K";
  }
  if (profile?.provider === "gemini") return isLegacyGeminiImageModel(modelId) ? "auto" : geminiNativeImageSize();
  if (isGrokImagineImageModel(modelId)) return grokImageResolution();
  return imageRequestSize(modelId);
}

function imageRequestSize(modelId) {
  const size = isGptImage2Model(modelId) && state.settings.imageSize === "auto"
    ? gptImage2SizeFromAspect(state.settings.imageAspectRatio)
    : effectiveImageSize();
  if (isGptImage2Model(modelId)) return normalizeGptImageSize(size, state.settings.imageAspectRatio);
  if (isGptImageModel(modelId)) return normalizeLegacyGptImageSize(size, state.settings.imageAspectRatio);
  return size;
}

function gptImage2SizeFromAspect(aspect) {
  const map = {
    "1:1": "1024x1024",
    "3:2": "1536x1024",
    "2:3": "1024x1536",
    "4:3": "1360x1024",
    "3:4": "1024x1360",
    "16:9": "1792x1024",
    "9:16": "1024x1792",
    "21:9": "1792x768",
  };
  return map[aspect] || "1024x1024";
}

function isGptImageModel(modelId) {
  return /^gpt-image(?:$|[-_.])/i.test(String(modelId || ""));
}

function isGptImage2Model(modelId) {
  return /^gpt-image[-_.]?2(?:$|[-_.])/i.test(String(modelId || ""));
}

function isGptImage25PlusModel(modelId) {
  return /^gpt-image[-_.]?2\.[5-9](?:$|[-_.])/i.test(String(modelId || ""));
}

function isSeedreamModel(modelId) {
  return /seedream/i.test(String(modelId || ""));
}

function isLegacyGeminiImageModel(modelId) {
  return /^gemini-2\.5-flash-image(?:-preview)?$/i.test(String(modelId || "").trim());
}

function isMuseVideoModel(modelId) {
  const id = String(modelId || "").trim().toLowerCase();
  if (!id.includes("muse")) return false;
  if (/(image|imagen|dall|flux|banana|seedream|gpt-image|midjourney|mj)/.test(id)) return false;
  return true;
}

function normalizeLegacyGptImageSize(value, aspect = "1:1") {
  const size = String(value || "").toLowerCase();
  if (["1024x1024", "1536x1024", "1024x1536"].includes(size)) return size;
  if (["16:9", "4:3", "3:2", "21:9"].includes(aspect)) return "1536x1024";
  if (["9:16", "3:4", "2:3"].includes(aspect)) return "1024x1536";
  return "1024x1024";
}

function normalizeGptImageSize(value, aspect = "1:1") {
  const match = String(value || "").trim().match(/^(\d+)\s*[x×]\s*(\d+)$/i);
  if (!match) return sizeFromAspect(aspect);
  const alignNearest = (number) => Math.max(16, Math.min(3840, Math.round(number / 16) * 16));
  const alignUp = (number) => Math.max(16, Math.min(3840, Math.ceil(number / 16) * 16));
  const alignDown = (number) => Math.max(16, Math.min(3840, Math.floor(number / 16) * 16));
  let width = alignNearest(Number(match[1]));
  let height = alignNearest(Number(match[2]));

  if (Math.max(width, height) / Math.min(width, height) > 3) {
    if (width > height) height = alignUp(width / 3);
    else width = alignUp(height / 3);
  }

  const minPixels = 655360;
  const maxPixels = 8294400;
  if (width * height < minPixels) {
    const scale = Math.sqrt(minPixels / (width * height));
    width = alignUp(width * scale);
    height = alignUp(height * scale);
  }
  if (width * height > maxPixels) {
    const scale = Math.sqrt(maxPixels / (width * height));
    width = alignDown(width * scale);
    height = alignDown(height * scale);
  }
  return `${width}x${height}`;
}

function sizeFromAspect(aspect) {
  const map = {
    "1:1": "1024x1024",
    "4:3": "1536x1024",
    "3:4": "1024x1536",
    "16:9": "1792x1024",
    "9:16": "1024x1792",
    "21:9": "1792x768",
  };
  return map[aspect] || "1024x1024";
}

function aspectFromSize(size) {
  const map = {
    "1024x1024": "1:1",
    "1536x1024": "3:2",
    "1024x1536": "2:3",
    "1792x1024": "16:9",
    "1024x1792": "9:16",
  };
  return map[size] || "1:1";
}

function normalizeQualityForModel(quality, model) {
  if (model?.id === "dall-e-3" && !["standard", "hd"].includes(quality)) return "hd";
  return quality;
}

function normalizeImageQualityForModel(modelId, quality) {
  const value = String(quality || "").toLowerCase();
  if (isGptImageModel(modelId)) {
    const allowed = ["auto", "low", "medium", "high"];
    if (isGptImage25PlusModel(modelId)) allowed.push("xhigh", "max");
    if (allowed.includes(value)) return value;
    return isGptImage2Model(modelId) ? "medium" : "auto";
  }
  return quality || "auto";
}

function mediaPayload(item) {
  return {
    name: item.name,
    mime_type: item.mime,
    size: item.size,
    data_url: item.dataUrl,
  };
}

function mediaMeta(item) {
  return {
    name: item.name,
    mime: item.mime,
    size: item.size,
  };
}

function statusLabel(status) {
  const map = {
    running: "生成中",
    submitted: "已提交",
    done: "完成",
    error: "失败",
    stopped: "已停止",
    empty: "无结果",
  };
  return map[status] || status || "-";
}

function taskStatusDetail(task) {
  const parts = [];
  if (task.rawStatus) parts.push(`状态 ${task.rawStatus}`);
  if (task.jobId) parts.push(`任务 ${String(task.jobId).slice(0, 18)}`);
  if (task.lastCheckedAt) parts.push(`检查 ${formatTime(task.lastCheckedAt)}`);
  if (task.lastPollError) parts.push(`错误 ${task.lastPollError}`);
  if (parts.length) return parts.join(" · ");
  return task.type === "image" ? "正在等待图片生成响应" : "正在等待任务状态";
}

function paramLabel(key) {
  const map = {
    mode: "模式",
    size: "尺寸",
    aspectRatio: "比例",
    quality: "质量",
    style: "风格",
    count: "数量",
    resolution: "清晰度",
    duration: "时长",
    audio: "音频",
  };
  return map[key] || key;
}

function fileTypeLabel(mime) {
  if (mime.startsWith("video/")) return "视频";
  if (mime.startsWith("audio/")) return "音频";
  if (mime.startsWith("image/")) return "图片";
  return "文件";
}

function trimFileName(name) {
  const value = String(name || "");
  return value.length > 22 ? `${value.slice(0, 10)}...${value.slice(-8)}` : value;
}

function uniqueMedia(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.name}:${item.size}:${item.mime}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function groupBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    apiUrl,
    buildChatRequest,
    buildGrokTextVideoFallbackRequest,
    buildGrokVideoRouteFallbackRequest,
    buildVideoRequest,
    buildVideoReferences,
    buildImageRequest,
    apiUrlForBase,
    effectiveImageAspectRatio,
    effectiveVideoAspectRatio,
    effectiveVideoAudio,
    effectiveVideoCount,
    effectiveVideoDuration,
    effectiveVideoResolution,
    encodeVideoTaskId,
    extractImageUrls,
    extractErrorMessage,
    extractJobId,
    extractTaskStatus,
    extractVideoUrls,
    fetchVideoTaskResource,
    generatedResultToMedia,
    materializeVideoUrls,
    videoResultUrlsForTask,
    imageAspectOptionsForModel,
    imageSizeOptionsForModel,
    imageQualityOptionsForModel,
    imageStyleOptionsForModel,
    imagePromptWithSelectedStyle,
    imageGenerationModeForReferences,
    isGptImage2Model,
    isGrokImagineImageModel,
    isGrokImagine15Model,
    isGrokImagineVideoModel,
    isKlingModel,
    isKlingOmniModel,
    isSeedance2FastModel,
    isSeedance2Model,
    isSeedance25Model,
    isSeedance20UnifiedModel,
    MODEL_CATALOG,
    getModelProfile,
    inferModelProfile,
    isGptImageModel,
    isGptImage25PlusModel,
    isSeedreamModel,
    isLegacyGeminiImageModel,
    isMuseVideoModel,
    normalizeMuseDuration,
    seedreamSizeFromTier,
    gptImageBackgroundValue,
    gptImageOutputFormatValue,
    isSora2Model,
    isSora2ProModel,
    isVeoModel,
    isWebSearchModel,
    isBananaRouterBaseUrl,
    isRetryableImageError,
    isSameApiGateway,
    imageRequestSize,
    normalizeModelRecords,
    normalizeGptImageSize,
    normalizeKlingDuration,
    normalizeSeedDanceDuration,
    normalizeSora2Duration,
    normalizeVeoDuration,
    normalizeError,
    normalizeState,
    unifyVisualData,
    inferVisualTaskType,
    buildQueueGroups,
    buildChatJumpItems,
    parseApiJsonResponse,
    responseError,
    parseLinkedNewApiSettings,
    parseSub2ApiEmbedParams,
    selectSub2ApiKey,
    resolveWebSearchModel,
    resolveGeminiImageRoute,
    resolveChatProtocol,
    shouldStopMissingVideoTaskPolling,
    videoAspectOptionsForModel,
    videoDurationOptionsForModel,
    videoResolutionOptionsForModel,
    videoPromptWithSelectedStyle,
    videoStatusEndpointForTask,
    videoStatusHeadersForTask,
    setTestSettings(settings) {
      state.settings = { ...DEFAULT_SETTINGS, ...settings };
    },
    els,
    locateVisualTask,
    renderQueuePanel,
    renderChatJumpList,
    jumpToChatMessage,
    setTestVisualState(sessions, tasks, activeId) {
      state.visualSessions = sessions;
      state.visualTasks = tasks;
      activeVisualSessionId = activeId;
    },
    setTestDraftMedia(media) {
      draftMedia = { ...createEmptyDraftMedia(), ...media };
    },
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  initElements();
  const linkedSettingsApplied = applyLinkedNewApiSettings();
  bindEvents();
  if (!activeSessionId || !state.sessions.find((session) => session.id === activeSessionId)) {
    activeSessionId = state.sessions[0]?.id || createSession();
  }
  if (!activeVisualSessionId || !state.visualSessions.find((session) => session.id === activeVisualSessionId)) {
    activeVisualSessionId = state.visualSessions[0]?.id || createVisualSession();
  }
  try {
    await navigator.storage?.persist?.();
  } catch {
    // Storage persistence is optional; IndexedDB remains available without it.
  }
  await restoreCachedVisualMedia();
  render();
  autoResizePrompt();
  resumeVideoPolling();
  resumeImagePolling();
  if (linkedSettingsApplied) {
    setConnection("已导入 NewAPI 配置", "ok");
    setTimeout(() => fetchModels(), 0);
  } else if (parseSub2ApiEmbedParams(window.location)) {
    applySub2ApiEmbedSettings().then((applied) => {
      if (applied) {
        render();
        setConnection("已导入 Sub2API 配置", "ok");
        fetchModels();
      } else if (!state.settings.apiKey) {
        showMissingSetting("请先配置 API Key");
      }
    });
  } else if (!state.settings.apiKey) {
    setTimeout(() => {
      showMissingSetting("请先配置 API Key");
    }, 300);
  }
});
