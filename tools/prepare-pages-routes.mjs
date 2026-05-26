#!/usr/bin/env node
/**
 * GitHub Pages 路径路由：为每个题目复制 index.html → dist/{topicId}/index.html
 * 使 https://user.github.io/repo/maxDepth/ 可访问
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEPLOYED_TOPICS } from "../src/motion/deployedTopics.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "../dist");
const indexHtml = path.join(dist, "index.html");

if (!fs.existsSync(indexHtml)) {
  console.error("prepare-pages-routes: dist/index.html 不存在，请先 npm run build");
  process.exit(1);
}

const html = fs.readFileSync(indexHtml, "utf8");

for (const topicId of DEPLOYED_TOPICS) {
  const dir = path.join(dist, topicId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  console.log(`pages route: /${topicId}/`);
}

fs.writeFileSync(path.join(dist, "404.html"), html);
console.log("pages route: 404.html fallback");
