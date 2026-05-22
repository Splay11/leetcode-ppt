#!/usr/bin/env node
/**
 * Motion 课件动画参数保存服务（配合 ?debug=1）
 * 启动: npm run tuning-server
 *
 * payload 字段:
 * - configPath: 相对项目根的配置文件（必填，如 src/maxDepth/animConfig.js）
 * - cssVarsBlock: CSS 变量块名（默认 DECK_CSS_VARS）
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.ANIM_TUNING_PORT || 3847);
const DEFAULT_CONFIG_JS = "src/maxDepth/animConfig.js";
const DEFAULT_CSS_VARS_BLOCK = "DECK_CSS_VARS";

function readFile(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function writeFile(rel, content) {
  fs.writeFileSync(path.join(ROOT, rel), content, "utf8");
}

function formatJsValue(value) {
  if (typeof value === "number") {
    if (Number.isInteger(value)) return String(value);
    return String(parseFloat(value.toFixed(4)));
  }
  return JSON.stringify(value);
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function patchJsBlock(content, blockName, values, { quotedKeys = false } = {}) {
  const blockRe = new RegExp(
    `(export const ${blockName}\\s*=\\s*\\{)([\\s\\S]*?)(\\n\\};)`,
    "m",
  );
  const match = content.match(blockRe);
  if (!match) throw new Error(`找不到 JS 块: ${blockName}`);

  let body = match[2];
  Object.entries(values).forEach(([key, val]) => {
    const formatted = formatJsValue(val);
    const keyToken = quotedKeys ? `"${key}"` : key;
    const keyRe = new RegExp(`(\\n\\s*${escapeRegExp(keyToken)}\\s*:\\s*)([^,\\n]+)`);
    if (keyRe.test(body)) {
      body = body.replace(keyRe, `$1${formatted}`);
    } else {
      const line = quotedKeys ? `\n  "${key}": ${formatted},` : `\n  ${key}: ${formatted},`;
      body = `${body.replace(/\s*$/, "")}${line}`;
    }
  });

  return content.replace(blockRe, `${match[1]}${body}${match[3]}`);
}

function patchJsArrayBlock(content, blockName, items) {
  const blockRe = new RegExp(
    `(export const ${blockName}\\s*=\\[)([\\s\\S]*?)(\\n\\];)`,
    "m",
  );
  const match = content.match(blockRe);
  if (!match) throw new Error(`找不到 JS 数组块: ${blockName}`);

  const lines = items.map((item) => {
    const pairs = Object.entries(item)
      .map(([key, val]) => `${key}: ${formatJsValue(val)}`)
      .join(", ");
    return `  { ${pairs} }`;
  });
  const body = `\n${lines.join(",\n")},\n`;
  return content.replace(blockRe, `${match[1]}${body}${match[3]}`);
}

function applySave(payload) {
  const configPath = payload.configPath || DEFAULT_CONFIG_JS;
  const cssVarsBlock = payload.cssVarsBlock || DEFAULT_CSS_VARS_BLOCK;

  let js = readFile(configPath);
  let changed = false;

  if (payload.blocks) {
    Object.entries(payload.blocks).forEach(([blockName, values]) => {
      if (!values || !Object.keys(values).length) return;
      js = patchJsBlock(js, blockName, values);
      changed = true;
    });
  }

  if (payload.arrayBlocks) {
    Object.entries(payload.arrayBlocks).forEach(([blockName, items]) => {
      if (!items || !items.length) return;
      js = patchJsArrayBlock(js, blockName, items);
      changed = true;
    });
  }

  if (payload.cssVars && Object.keys(payload.cssVars).length) {
    js = patchJsBlock(js, cssVarsBlock, payload.cssVars, { quotedKeys: true });
    changed = true;
  }

  if (!changed) return [];

  writeFile(configPath, js);
  return [configPath];
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    sendJson(res, 200, { ok: true, root: ROOT });
    return;
  }

  if (req.method === "POST" && req.url === "/save-tuning") {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        const files = applySave(payload);
        sendJson(res, 200, { ok: true, files, deckId: payload.deckId ?? null });
      } catch (err) {
        sendJson(res, 500, { ok: false, error: err.message });
      }
    });
    return;
  }

  sendJson(res, 404, { ok: false, error: "Not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`anim-tuning-server listening on http://127.0.0.1:${PORT}`);
  console.log(`project root: ${ROOT}`);
  console.log(`default config: ${DEFAULT_CONFIG_JS}`);
});
