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

const { apiUrl, buildVideoReferences, normalizeModelRecords, parseLinkedNewApiSettings, setTestDraftMedia, setTestSettings } = require("../app.js");

test("NewAPI hash settings support source-compatible address encoding", () => {
  const raw = parseLinkedNewApiSettings({
    hash: '#/?settings={"key":"sk-test","url":"https://newapi.example.com/v1"}',
  });
  const encoded = parseLinkedNewApiSettings({
    hash: `#/?settings=${encodeURIComponent(JSON.stringify({ key: "sk-encoded", url: "https://api.example.com" }))}`,
  });
  const sourceCompatible = parseLinkedNewApiSettings({
    hash: '#/?settings={"key":"sk-source","url":"https%3A%2F%2Fwww.deeprouter.top"}',
  });

  assert.deepEqual(raw, { key: "sk-test", url: "https://newapi.example.com/v1" });
  assert.deepEqual(encoded, { key: "sk-encoded", url: "https://api.example.com" });
  assert.deepEqual(sourceCompatible, { key: "sk-source", url: "https://www.deeprouter.top" });
});

test("linked settings prefer the default-group token from keys arrays", () => {
  const linked = parseLinkedNewApiSettings({
    hash: `#/?settings=${encodeURIComponent(JSON.stringify({
      url: "https://api.example.com",
      keys: [
        { key: "sk-vip", group: "vip" },
        { key: "sk-default", group: "default" },
        { key: "sk-other", group: "team" },
      ],
    }))}`,
  });
  assert.deepEqual(linked, { key: "sk-default", url: "https://api.example.com" });
});

test("linked settings fall back to the first usable token and accept tokens arrays", () => {
  const linked = parseLinkedNewApiSettings({
    search: `?settings=${encodeURIComponent(JSON.stringify({
      address: "https://api2.example.com",
      tokens: [{ token: "sk-first" }, { token: "sk-second" }],
    }))}`,
  });
  assert.deepEqual(linked, { key: "sk-first", url: "https://api2.example.com" });
});

test("linked settings accept field name variants", () => {
  const linked = parseLinkedNewApiSettings({
    hash: `#/?settings=${encodeURIComponent(JSON.stringify({ api_key: "sk-variant", base_url: "https://api3.example.com" }))}`,
  });
  assert.deepEqual(linked, { key: "sk-variant", url: "https://api3.example.com" });

  const camel = parseLinkedNewApiSettings({
    hash: `#/?settings=${encodeURIComponent(JSON.stringify({ apiKey: "sk-camel", server: "https://api4.example.com" }))}`,
  });
  assert.deepEqual(camel, { key: "sk-camel", url: "https://api4.example.com" });
});

test("sub2API style direct query params are imported from search and hash", () => {
  const fromSearch = parseLinkedNewApiSettings({
    search: "?api_key=sk-direct&base_url=https%3A%2F%2Fsub2api.example.com",
  });
  assert.deepEqual(fromSearch, { key: "sk-direct", url: "https://sub2api.example.com" });

  const fromHash = parseLinkedNewApiSettings({
    hash: "#/?apiKey=sk-hash&baseUrl=https%3A%2F%2Fsub2api2.example.com",
  });
  assert.deepEqual(fromHash, { key: "sk-hash", url: "https://sub2api2.example.com" });
});

test("www.deeprouter.top API requests use the configured gateway directly", () => {
  setTestSettings({ baseUrl: "https://www.deeprouter.top/", apiKey: "test-key" });
  assert.equal(apiUrl("/v1/images/generations"), "https://www.deeprouter.top/v1/images/generations");
});

test("DeepRouter Grok generations use the configured gateway directly", () => {
  setTestSettings({ baseUrl: "https://www.deeprouter.top", apiKey: "test-key" });
  assert.equal(apiUrl("/v1/videos/generations"), "https://www.deeprouter.top/v1/videos/generations");
});

test("MJ model records remain hidden", () => {
  const records = normalizeModelRecords([
    { id: "mj_imagine", type: "image" },
    { id: "niji-6", type: "image" },
    { id: "gpt-image-2", type: "image" },
  ]);

  assert.deepEqual(records.map((record) => record.id), ["gpt-image-2"]);
});

test("generated images become video reference images", () => {
  setTestDraftMedia({
    videoImages: [
      {
        name: "generated.png",
        mime: "image/png",
        size: 1024,
        dataUrl: "data:image/png;base64,YWJjZA==",
      },
    ],
  });

  assert.deepEqual(buildVideoReferences(), [
    {
      role: "reference_image",
      name: "generated.png",
      mime_type: "image/png",
      size: 1024,
      data_url: "data:image/png;base64,YWJjZA==",
    },
  ]);
});
