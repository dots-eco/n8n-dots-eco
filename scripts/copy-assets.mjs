import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

const packageRoot = path.resolve(import.meta.dirname, "..");
const assets = [
  ["nodes/DotsEco/DotsEco.node.json", "dist/nodes/DotsEco/DotsEco.node.json"],
  ["nodes/DotsEco/Dots_eco_logo.png", "dist/nodes/DotsEco/Dots_eco_logo.png"],
  ["nodes/DotsEco/Dots_eco_logo.svg", "dist/nodes/DotsEco/Dots_eco_logo.svg"],
];

for (const [source, target] of assets) {
  const sourcePath = path.join(packageRoot, source);
  const targetPath = path.join(packageRoot, target);

  await mkdir(path.dirname(targetPath), { recursive: true });
  await cp(sourcePath, targetPath);
}
