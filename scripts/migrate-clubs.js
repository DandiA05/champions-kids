const fs = require("fs");
const path = require("path");
const postgres = require("postgres");

// Load .env manual (sama seperti script pertama kamu)
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");

  if (!fs.existsSync(envPath)) {
    console.error("❌ .env file NOT found!");
    process.exit(1);
  }

  const envConfig = fs.readFileSync(envPath, "utf8");

  envConfig.split(/\r?\n/).forEach((line) => {
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

// ✅ Pakai postgres driver (bukan neon serverless)
const sql = postgres(dbUrl, {
  ssl: "require",
});

async function runMigration() {
  try {
    console.log("🚀 Starting Clubs Database Migration...");

    const migrationPath = path.resolve(
      __dirname,
      "../database/migration_clubs.sql",
    );

    if (!fs.existsSync(migrationPath)) {
      console.error("❌ Migration SQL file not found:", migrationPath);
      process.exit(1);
    }

    const migrationSql = fs.readFileSync(migrationPath, "utf8");

    console.log("📦 Executing migration...");

    // ✅ Jalankan full SQL file sekaligus
    await sql.unsafe(migrationSql);

    console.log("✅ Clubs migration completed successfully!");

    // Optional verification
    const result = await sql`SELECT COUNT(*) as count FROM clubs`;
    console.log(`Verification: Total clubs in database = ${result[0].count}`);
  } catch (err) {
    console.error("❌ Migration FAILED:");
    console.error(err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();
