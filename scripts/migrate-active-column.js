const fs = require("fs");
const path = require("path");
const postgres = require("postgres");

// Function to load .env manually
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf8");
    envConfig.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("#")) return;
      const parts = trimmedLine.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join("=").trim();
        if (
          (value.startsWith("'") && value.endsWith("'")) ||
          (value.startsWith('"') && value.endsWith('"'))
        ) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("❌ Error: DATABASE_URL not found in .env file.");
  process.exit(1);
}

const sql = postgres(dbUrl, { ssl: "require" });

async function runMigration() {
  try {
    const migrationPath = path.resolve(
      __dirname,
      "../database/add_is_active_column.sql",
    );
    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Migration file not found at: ${migrationPath}`);
      process.exit(1);
    }

    const migrationSql = fs.readFileSync(migrationPath, "utf8");
    console.log("Running migration: add_is_active_column.sql...");

    await sql.unsafe(migrationSql);

    console.log("✅ Migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:");
    console.error(err);
  } finally {
    await sql.end();
  }
}

runMigration();
