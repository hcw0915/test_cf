import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

// 讀 --env flag
const envIndex = process.argv.indexOf("--env");
if (envIndex === -1 || !process.argv[envIndex + 1]) {
  console.error("❌ 請提供環境檔，例如 --env env/.env.abear.dev");
  process.exit(1);
}

const envFile = process.argv[envIndex + 1];

if (!fs.existsSync(envFile)) {
  console.error(`❌ 找不到檔案: ${envFile}`);
  process.exit(1);
}

// 讀取指定 .env，只拿它自己的變數
const envResult = dotenv.config({ path: envFile });
if (envResult.error) {
  console.error("❌ 讀取 .env 失敗", envResult.error);
  process.exit(1);
}

const envVars = envResult.parsed || {};

// 讀 wrangler.jsonc（必須合法 JSON）
const wranglerPath = "wrangler.jsonc";
const raw = fs.readFileSync(wranglerPath, "utf-8");

let wrangler;
try {
  wrangler = JSON.parse(raw);
} catch (err) {
  console.error("❌ wrangler.jsonc 不是合法 JSON，請移除註解或尾逗號");
  process.exit(1);
}

// **完全覆蓋 vars，不累加**
wrangler.vars = { ...envVars };

// ✅ 根據 env 檔名生成 name (e.g. env/.env.abear.dev -> abear-dev)
const baseName = path.basename(envFile); // ".env.abear.dev"
const nameParts = baseName
  .replace(/^\.env\./, "") // 去掉開頭 .env.
  .replace(/\./g, "-") // 把點換成中橫線
  .toLowerCase(); // 小寫
wrangler.name = nameParts;
// 更新 compatibility_date
wrangler.compatibility_date = new Date().toISOString().slice(0, 10);

// 寫回 wrangler.jsonc
fs.writeFileSync(wranglerPath, JSON.stringify(wrangler, null, 2));

console.log(`✅ 同步 ${envFile} → wrangler.jsonc（完全覆蓋 vars）`);

// 覆蓋整個環境變數
