import fs from "fs";

const branch = process.env.CF_PAGES_BRANCH;

let envFile = ".env.local"; // default fallback

if (branch === "dev-br") {
  envFile = "env/.env.afun.dev";
} else if (branch === "stage-br") {
  envFile = "env/.env.afun.stage";
} else if (branch === "main") {
  envFile = "env/.env.afun.prod";
}

// 複製到專案根目錄的 .env.local
fs.copyFileSync(envFile, ".env.local");
console.log(`✅ Using env file: ${envFile}`);
