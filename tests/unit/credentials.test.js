const test = require("node:test");
const assert = require("node:assert/strict");

const {
  DotsEcoApi,
} = require("../../dist/credentials/DotsEcoApi.credentials.js");

test("credential connectivity test probes a public endpoint without auth headers", () => {
  const credentials = new DotsEcoApi();

  assert.equal(credentials.test.request.baseURL, "={{$credentials.baseUrl}}");
  assert.equal(credentials.test.request.url, "/supported-languages");
  assert.equal(credentials.test.request.method, "GET");
  assert.equal(credentials.test.request.headers, undefined);
});
