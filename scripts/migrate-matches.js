const fs = require("fs");
const path = require("path");
const postgres = require("postgres");

// Load .env manually
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");

  if (!fs.existsSync(envPath)) {
    console.error("❌ .env file NOT found!");
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, "utf8");

  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const firstEq = trimmed.indexOf("=");
    if (firstEq === -1) return;

    const key = trimmed.substring(0, firstEq).trim();
    let value = trimmed.substring(firstEq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}

loadEnv();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ DATABASE_URL not found in .env");
  process.exit(1);
}

// ✅ Gunakan postgres driver
const sql = postgres(dbUrl, {
  ssl: "require",
});

async function runMigration() {
  try {
    console.log("🚀 Starting Matches Database Migration...");

    const migrationPath = path.resolve(
      __dirname,
      "../database/migration_matches.sql",
    );

    if (!fs.existsSync(migrationPath)) {
      console.error("❌ Migration SQL file not found:", migrationPath);
      process.exit(1);
    }

    const migrationSql = fs.readFileSync(migrationPath, "utf8");

    console.log("📦 Executing migration...");

    // ✅ Execute full SQL script
    await sql.unsafe(migrationSql);

    console.log("✅ Matches migration completed successfully!");

    // Optional verification
    const result = await sql`SELECT COUNT(*) as count FROM matches`;
    console.log(`Verification: Total matches in database = ${result[0].count}`);
  } catch (error) {
    console.error("❌ Migration FAILED:");
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();
