const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { DotsEco } = require("../../dist/nodes/DotsEco/DotsEco.node.js");
const {
  DotsEcoApi,
} = require("../../dist/credentials/DotsEcoApi.credentials.js");

test("node and credential icons point to the packaged SVG asset", () => {
  const node = new DotsEco();
  const credentials = new DotsEcoApi();

  assert.deepEqual(node.description.icon, {
    light: "file:Dots_eco_logo.svg",
    dark: "file:Dots_eco_logo.dark.svg",
  });
  assert.deepEqual(credentials.icon, {
    light: "file:../nodes/DotsEco/Dots_eco_logo.svg",
    dark: "file:../nodes/DotsEco/Dots_eco_logo.dark.svg",
  });
});

test("node SVG icons use square canvases for both themes", () => {
  const lightSvgPath = path.join(
    __dirname,
    "../../dist/nodes/DotsEco/Dots_eco_logo.svg",
  );
  const darkSvgPath = path.join(
    __dirname,
    "../../dist/nodes/DotsEco/Dots_eco_logo.dark.svg",
  );
  const lightSvg = fs.readFileSync(lightSvgPath, "utf8");
  const darkSvg = fs.readFileSync(darkSvgPath, "utf8");

  assert.match(lightSvg, /viewBox="0 0 94 94"/);
  assert.match(darkSvg, /viewBox="0 0 94 94"/);
});
