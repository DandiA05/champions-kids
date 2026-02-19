const fs = require("fs");
const path = require("path");
const postgres = require("postgres"); // Switched back to postgres driver

// Function to load .env manually
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  console.log(`Loading .env from: ${envPath}`);

  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf8");
    envConfig.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("#")) return;

      const parts = trimmedLine.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join("=").trim();

        // Remove quotes if present
        if (
          (value.startsWith("'") && value.endsWith("'")) ||
          (value.startsWith('"') && value.endsWith('"'))
        ) {
          value = value.slice(1, -1);
        }

        process.env[key] = value;
      }
    });
  } else {
    console.error("❌ .env file NOT found!");
  }
}

loadEnv();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.log(
    "Keys found in environment:",
    Object.keys(process.env).filter((k) => !k.startsWith("npm_")),
  );
  console.error("❌ Error: DATABASE_URL not found in .env file.");
  process.exit(1);
}

// Connect to database using postgres driver
const sql = postgres(dbUrl, { ssl: "require" }); // Using postgres driver with ssl

async function runMigration() {
  try {
    const migrationPath = path.resolve(
      __dirname,
      "../database/migration_players.sql",
    );
    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Migration file not found at: ${migrationPath}`);
      process.exit(1);
    }

    const migrationSql = fs.readFileSync(migrationPath, "utf8");

    console.log("Connecting to database...");
    console.log("Running migration...");

    // Execute the SQL using .unsafe() for raw SQL script execution
    await sql.unsafe(migrationSql);

    console.log("✅ Migration completed successfully!");
    console.log("The 'players' table has been created.");
  } catch (err) {
    console.error("❌ Migration failed:");
    console.error(err);
  } finally {
    await sql.end(); // Ensure the connection is closed
  }
}

runMigration();
