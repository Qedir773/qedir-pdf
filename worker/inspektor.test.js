import assert from "node:assert/strict";
import test from "node:test";
import worker from "./inspektor.js";

test("əsas saytın sorğularını statik fayllara ötürür", async () => {
  const request = new Request("https://qedir.com/editor");
  const response = new Response("pdf");
  const result = await worker.fetch(request, { ASSETS: { fetch: async (actual) => {
    assert.equal(actual, request);
    return response;
  } } });
  assert.equal(result, response);
});

test("inspektor sorğusunun yolunu, parametrini və gövdəsini saxlayır", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (request, options) => {
    assert.equal(request.url, "https://sandybrown-jellyfish-512142.hostingersite.com/inspektor/api/meta/regional-centers?x=1");
    assert.equal(request.method, "POST");
    assert.equal(request.headers.get("X-Forwarded-Host"), "qedir.com");
    assert.equal(await request.text(), "nümunə");
    assert.equal(options.redirect, "manual");
    return new Response(null, { status: 307, headers: { Location: "/inspektor/login" } });
  };
  try {
    const request = new Request("https://qedir.com/inspektor/api/meta/regional-centers?x=1", {
      method: "POST",
      body: "nümunə",
    });
    const response = await worker.fetch(request, {});
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("Location"), "https://qedir.com/inspektor/login");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
