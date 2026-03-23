const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getAllocationsForCompany,
  getSupportedCurrencies,
  getSupportedLanguages,
  mapAllocationOptions,
  mapSupportedCurrencyOptions,
  mapSupportedLanguageOptions,
} = require("../../dist/nodes/DotsEco/loadOptions.js");
const {
  normalizeOperationParameters,
} = require("../../dist/nodes/DotsEco/parameterNormalization.js");
const { DotsEco } = require("../../dist/nodes/DotsEco/DotsEco.node.js");
const {
  operationDefinitions,
} = require("../../dist/nodes/DotsEco/operations.js");
const {
  dotsEcoLoadOptionsRequest,
} = require("../../dist/nodes/DotsEco/transport.js");

async function executeCertificateCreate(parameterValues) {
  const node = new DotsEco();
  let capturedRequest;

  const result = await node.execute.call({
    getInputData() {
      return [{ json: {} }];
    },
    async getCredentials() {
      return {
        baseUrl: "https://impact.dots.eco/api/v1",
        writeAuthToken: "write-token",
      };
    },
    getNodeParameter(name) {
      if (name in parameterValues) {
        return parameterValues[name];
      }

      throw new Error(`Unknown parameter: ${name}`);
    },
    continueOnFail() {
      return false;
    },
    getNode() {
      return {};
    },
    helpers: {
      async httpRequest(request) {
        capturedRequest = request;
        return { ok: true };
      },
    },
  });

  return { capturedRequest, result };
}

test("supported language options map canonical values and sort predictably", () => {
  const options = mapSupportedLanguageOptions({
    object: "list",
    data: ["fr", "en"],
  });

  assert.deepEqual(
    options.map((option) => option.value),
    ["en", "fr"],
  );
  assert.match(options[0].name, /\(en\)$/);
  assert.match(options[1].name, /\(fr\)$/);
});

test("supported currency options normalize codes and sort predictably", () => {
  const options = mapSupportedCurrencyOptions({
    object: "list",
    data: ["usd", "cad"],
  });

  assert.deepEqual(
    options.map((option) => option.value),
    ["CAD", "USD"],
  );
  assert.match(options[0].name, /\(CAD\)$/);
  assert.match(options[1].name, /\(USD\)$/);
});

test("allocation options map display names, descriptions, and sort predictably", () => {
  const options = mapAllocationOptions({
    20: {
      allocation_id: "20",
      display_name: "B Ocean Cleanup",
      allocation_description: "Ocean cleanup project",
    },
    10: {
      allocation_id: "10",
      display_name: "A Forest Protection",
      allocation_description: "Forest protection project",
    },
  });

  assert.deepEqual(
    options.map((option) => option.value),
    ["10", "20"],
  );
  assert.equal(options[0].description, "Forest protection project");
  assert.equal(options[1].description, "Ocean cleanup project");
});

test("allocation lookup returns an empty option list until a company id is provided", async () => {
  const options = await getAllocationsForCompany.call({
    getCurrentNodeParameter() {
      return undefined;
    },
  });

  assert.deepEqual(options, []);
});

test("language load options fall back to the current value when the lookup request fails", async () => {
  const options = await getSupportedLanguages.call({
    getCredentials() {
      return { baseUrl: "https://example.com/api/v1" };
    },
    getCurrentNodeParameter(name) {
      return name === "langcode" ? "he" : undefined;
    },
    getNode() {
      return {};
    },
    helpers: {
      httpRequest() {
        throw new Error("network unavailable");
      },
    },
  });

  assert.deepEqual(
    options.map((option) => option.value),
    ["en", "he"],
  );
});

test("currency load options fall back to the current value when the lookup request fails", async () => {
  const options = await getSupportedCurrencies.call({
    getCredentials() {
      return { baseUrl: "https://example.com/api/v1" };
    },
    getCurrentNodeParameter(name) {
      return name === "currency" ? "eur" : undefined;
    },
    getNode() {
      return {};
    },
    helpers: {
      httpRequest() {
        throw new Error("network unavailable");
      },
    },
  });

  assert.deepEqual(
    options.map((option) => option.value),
    ["EUR", "USD"],
  );
});

test("lookup-mode allocation normalization fills the canonical allocationId", () => {
  const normalized = normalizeOperationParameters(
    {
      getNodeParameter(name) {
        return {
          allocationEntryMode: "lookup",
          allocationLookupId: "17",
        }[name];
      },
    },
    "certificates",
    "create",
    {
      allocationId: 99,
    },
    0,
  );

  assert.equal(normalized.allocationId, 17);
});

test("manual allocation normalization leaves the existing allocationId untouched", () => {
  const normalized = normalizeOperationParameters(
    {
      getNodeParameter(name) {
        return {
          allocationEntryMode: "manual",
          allocationLookupId: "17",
        }[name];
      },
    },
    "certificates",
    "create",
    {
      allocationId: 99,
    },
    0,
  );

  assert.equal(normalized.allocationId, 99);
});

test("lookup-mode allocation normalization clears stale manual values when no lookup is selected", () => {
  const normalized = normalizeOperationParameters(
    {
      getNodeParameter(name) {
        return {
          allocationEntryMode: "lookup",
          allocationLookupId: "",
        }[name];
      },
    },
    "certificates",
    "create",
    {
      allocationId: 99,
    },
    0,
  );

  assert.equal(normalized.allocationId, undefined);
});

test("certificate create sends the selected allocation id in lookup mode even when the manual field is hidden", async () => {
  const { capturedRequest, result } = await executeCertificateCreate({
    resource: "certificates",
    operation: "create",
    appToken: "app-token",
    externalUniqueId: "",
    impactQty: 2,
    remoteUserId: "user-123",
    nameOnCertificate: "",
    remoteUserEmail: "",
    certificateDesign: "",
    sendCertificateByEmail: "",
    certificateInfo: "",
    createAsyncImage: "",
    langcode: "",
    currency: "",
    allocationEntryMode: "lookup",
    allocationLookupId: "17",
  });

  assert.equal(capturedRequest.body.allocation_id, 17);
  assert.equal("external_unique_id" in capturedRequest.body, false);
  assert.deepEqual(result, [[{ json: { ok: true }, pairedItem: { item: 0 } }]]);
});

test("certificate create sends the manually entered allocation id", async () => {
  const { capturedRequest } = await executeCertificateCreate({
    resource: "certificates",
    operation: "create",
    appToken: "app-token",
    externalUniqueId: "",
    impactQty: 2,
    allocationId: 33,
    remoteUserId: "user-123",
    nameOnCertificate: "",
    remoteUserEmail: "",
    certificateDesign: "",
    sendCertificateByEmail: "",
    certificateInfo: "",
    createAsyncImage: "",
    langcode: "",
    currency: "",
    allocationEntryMode: "manual",
  });

  assert.equal(capturedRequest.body.allocation_id, 33);
});

test("certificate create forwards a non-empty external unique id", async () => {
  const { capturedRequest } = await executeCertificateCreate({
    resource: "certificates",
    operation: "create",
    appToken: "app-token",
    externalUniqueId: "order-12345",
    impactQty: 2,
    allocationId: 33,
    remoteUserId: "user-123",
    nameOnCertificate: "",
    remoteUserEmail: "",
    certificateDesign: "",
    sendCertificateByEmail: "",
    certificateInfo: "",
    createAsyncImage: "",
    langcode: "",
    currency: "",
    allocationEntryMode: "manual",
  });

  assert.equal(capturedRequest.body.external_unique_id, "order-12345");
});

test("manual eco club allocation limits remain unchanged", () => {
  const normalized = normalizeOperationParameters(
    {
      getNodeParameter(name) {
        return {
          limitAllocationsEntryMode: "manual",
          limitAllocationLookupIds: ["5", "9"],
        }[name];
      },
    },
    "ecoClub",
    "createOffering",
    {
      limitAllocations: "1,2",
    },
    0,
  );

  assert.equal(normalized.limitAllocations, "1,2");
});

test("lookup-mode eco club allocation limits serialize selected ids back to CSV", () => {
  const normalized = normalizeOperationParameters(
    {
      getNodeParameter(name) {
        return {
          limitAllocationsEntryMode: "lookup",
          limitAllocationLookupIds: ["5", "9"],
        }[name];
      },
    },
    "ecoClub",
    "createOffering",
    {
      limitAllocations: "1,2",
    },
    0,
  );

  assert.equal(normalized.limitAllocations, "5,9");
});

test("lookup helper fields stay out of canonical operation parameter lists", () => {
  const certificateCreate = operationDefinitions.find(
    (definition) =>
      definition.resource === "certificates" &&
      definition.operation === "create",
  );
  const ecoClubCreate = operationDefinitions.find(
    (definition) =>
      definition.resource === "ecoClub" &&
      definition.operation === "createOffering",
  );

  assert.equal(
    certificateCreate?.parameterNames.includes("allocationEntryMode"),
    false,
  );
  assert.equal(
    certificateCreate?.parameterNames.includes("allocationLookupId"),
    false,
  );
  assert.equal(
    ecoClubCreate?.parameterNames.includes("limitAllocationsEntryMode"),
    false,
  );
  assert.equal(
    ecoClubCreate?.parameterNames.includes("limitAllocationLookupIds"),
    false,
  );
});

test("load options transport wraps lookup failures in a clear editor-facing message", async () => {
  await assert.rejects(
    dotsEcoLoadOptionsRequest(
      {
        getNode() {
          return {};
        },
        helpers: {
          async httpRequest() {
            throw new Error("Access denied");
          },
        },
      },
      {
        baseUrl: "https://impact.dots.eco/api/v1",
        readAuthToken: "read-token",
      },
      {
        authType: "read",
        method: "GET",
        path: "/allocations",
      },
    ),
    /Dots\.eco lookup failed: Access denied/,
  );
});
