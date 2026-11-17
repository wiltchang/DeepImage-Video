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
  parseLinkedNewApiSettings,
  parseSub2ApiEmbedParams,
  selectSub2ApiKey,
} = require("../app.js");

test("selectSub2ApiKey prefers the default group, case-insensitively", () => {
  const key = selectSub2ApiKey({
    items: [
      { key: "sk-vip", status: "active", group_id: 2, group: { name: "vip" } },
      { key: "sk-default", status: "active", group_id: 1, group: { name: "Default" } },
    ],
  });
  assert.equal(key, "sk-default");
});

test("selectSub2ApiKey falls back to an ungrouped key when no default group exists", () => {
  const key = selectSub2ApiKey({
    items: [
      { key: "sk-vip", status: "active", group_id: 2, group: { name: "vip" } },
      { key: "sk-plain", status: "active", group_id: null },
    ],
  });
  assert.equal(key, "sk-plain");
});

test("selectSub2ApiKey falls back to the first active key", () => {
  const key = selectSub2ApiKey({
    items: [
      { key: "sk-first", status: "active", group_id: 5, group: { name: "a" } },
      { key: "sk-second", status: "active", group_id: 6, group: { name: "b" } },
    ],
  });
  assert.equal(key, "sk-first");
});

test("selectSub2ApiKey skips inactive and empty keys", () => {
  assert.equal(
    selectSub2ApiKey({
      items: [
        { key: "", status: "active", group_id: null },
        { key: "sk-dead", status: "quota_exhausted", group_id: null },
        { key: "sk-off", status: "inactive", group_id: null, group: { name: "default" } },
      ],
    }),
    null
  );
  assert.equal(
    selectSub2ApiKey({
      items: [
        { key: "sk-expired", status: "expired", group_id: null },
        { key: "sk-live", status: "active", group_id: 7 },
      ],
    }),
    "sk-live"
  );
});

test("selectSub2ApiKey accepts items, data array, and data.items response shapes", () => {
  const item = { key: "sk-shaped", status: "active", group_id: null };
  assert.equal(selectSub2ApiKey({ items: [item] }), "sk-shaped");
  assert.equal(selectSub2ApiKey({ data: [item] }), "sk-shaped");
  assert.equal(selectSub2ApiKey({ data: { items: [item] } }), "sk-shaped");
});

test("selectSub2ApiKey returns null for empty or malformed payloads", () => {
  assert.equal(selectSub2ApiKey({ items: [] }), null);
  assert.equal(selectSub2ApiKey({}), null);
  assert.equal(selectSub2ApiKey(null), null);
  assert.equal(selectSub2ApiKey(undefined), null);
  assert.equal(selectSub2ApiKey({ items: "not-an-array" }), null);
  assert.equal(selectSub2ApiKey("junk"), null);
});

test("parseSub2ApiEmbedParams detects embed params in search, hash, and user_id-only URLs", () => {
  assert.deepEqual(
    parseSub2ApiEmbedParams({ search: "?user_id=123&token=jwt-search&ui_mode=embedded&theme=light&lang=zh" }),
    { jwt: "jwt-search", srcHost: "" }
  );
  assert.deepEqual(
    parseSub2ApiEmbedParams({ hash: "#/?token=jwt-hash&ui_mode=embedded" }),
    { jwt: "jwt-hash", srcHost: "" }
  );
  assert.deepEqual(
    parseSub2ApiEmbedParams({ search: "?token=jwt-userid-only&user_id=9" }),
    { jwt: "jwt-userid-only", srcHost: "" }
  );
});

test("parseSub2ApiEmbedParams ignores a bare token param without embed markers", () => {
  assert.equal(parseSub2ApiEmbedParams({ search: "?token=jwt-bare" }), null);
  assert.equal(parseSub2ApiEmbedParams({ search: "?ui_mode=embedded" }), null);
  assert.equal(parseSub2ApiEmbedParams({}), null);
});

test("the Sub2API login JWT is never imported as a direct API key", () => {
  const linked = parseLinkedNewApiSettings({
    search: "?user_id=123&token=eyJhbGciOiJIUzI1NiJ9.jwt-payload.signature&theme=light&lang=zh&ui_mode=embedded",
  });
  assert.equal(linked, null);
});

test("explicit direct params still win inside a Sub2API embed URL", () => {
  const linked = parseLinkedNewApiSettings({
    search: "?user_id=123&token=jwt-login&ui_mode=embedded&api_key=sk-explicit&base_url=https%3A%2F%2Fapi.example.com",
  });
  assert.deepEqual(linked, { key: "sk-explicit", url: "https://api.example.com" });
});

test("a bare token param outside an embed still imports as a key", () => {
  const linked = parseLinkedNewApiSettings({ search: "?token=sk-plain" });
  assert.deepEqual(linked, { key: "sk-plain", url: "" });
});

test("parseSub2ApiEmbedParams captures a valid src_host origin and rejects junk", () => {
  assert.deepEqual(
    parseSub2ApiEmbedParams({
      search: "?token=jwt-src&ui_mode=embedded&src_host=https%3A%2F%2Fconsole.example.com",
    }),
    { jwt: "jwt-src", srcHost: "https://console.example.com" }
  );
  assert.deepEqual(
    parseSub2ApiEmbedParams({
      search: "?token=jwt-src&ui_mode=embedded&src_host=javascript%3Aalert(1)",
    }),
    { jwt: "jwt-src", srcHost: "" }
  );
});
