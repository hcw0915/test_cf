import fs from "fs";

const branch = process.env.CF_PAGES_BRANCH || "dev-br"; // 本地 fallback

let envFile = "";

switch (branch) {
  case "dev-br":
    envFile = "env/.env.afun_dev";
    break;
  case "stage-br":
    envFile = "env/.env.afun_stage";
    break;
  case "main":
    envFile = "env/.env.afun_prod";
    break;
  default:
    throw new Error(`❌ No env file defined for branch "${branch}"`);
}

if (!fs.existsSync(envFile)) {
  throw new Error(`❌ Env file not found: ${envFile}`);
}

fs.copyFileSync(envFile, ".env.local");
console.log(`✅ Using env file for branch "${branch}": ${envFile}`);
