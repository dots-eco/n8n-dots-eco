const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildDotsEcoRequestOptions,
  getAuthTokenForOperation,
  splitCsv,
  stripEmptyFields,
} = require("../../dist/nodes/DotsEco/transport.js");
const {
  operationDefinitions,
} = require("../../dist/nodes/DotsEco/operations.js");

test("operation matrix exposes all 19 planned operations", () => {
  assert.equal(operationDefinitions.length, 19);
});

test("token routing matches read, write, and none", () => {
  const credentials = {
    baseUrl: "https://impact.dots.eco/api/v1",
    readAuthToken: "read-token",
    writeAuthToken: "write-token",
  };

  assert.equal(getAuthTokenForOperation(credentials, "read"), "read-token");
  assert.equal(getAuthTokenForOperation(credentials, "write"), "write-token");
  assert.equal(getAuthTokenForOperation(credentials, "none"), undefined);
});

test("operation definitions route notification writes through the write token", () => {
  const single = operationDefinitions.find(
    (entry) =>
      entry.resource === "notifications" &&
      entry.operation === "createSingleSubscription",
  );
  const multiple = operationDefinitions.find(
    (entry) =>
      entry.resource === "notifications" &&
      entry.operation === "createMultipleSubscriptions",
  );

  assert.equal(single?.authType, "write");
  assert.equal(multiple?.authType, "write");
});

test("request builder omits auth header for unauthenticated endpoints", () => {
  const request = buildDotsEcoRequestOptions(
    {
      baseUrl: "https://impact.dots.eco/api/v1",
      readAuthToken: "read-token",
    },
    {
      authType: "none",
      method: "GET",
      path: "/supported-languages",
    },
  );

  assert.equal(
    request.url,
    "https://impact.dots.eco/api/v1/supported-languages",
  );
  assert.equal(request.headers["auth-token"], undefined);
});

test("request builder adds query params and auth token when required", () => {
  const request = buildDotsEcoRequestOptions(
    {
      baseUrl: "https://impact.dots.eco/api/v1",
      readAuthToken: "read-token",
    },
    {
      authType: "read",
      method: "GET",
      path: "/allocations",
      query: {
        company_id: 46,
        langcode: "en",
      },
    },
  );

  assert.equal(
    request.url,
    "https://impact.dots.eco/api/v1/allocations?company_id=46&langcode=en",
  );
  assert.equal(request.headers["auth-token"], "read-token");
});

test("helper functions normalize and strip optional values", () => {
  assert.deepEqual(splitCsv("a, b ,, c"), ["a", "b", "c"]);
  assert.deepEqual(
    stripEmptyFields({
      keep: "value",
      skipEmpty: "",
      skipNull: null,
      skipUndefined: undefined,
      skipArray: [],
      skipObject: {},
    }),
    { keep: "value" },
  );
});
