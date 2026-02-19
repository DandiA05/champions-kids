const fs = require("fs");
const path = require("path");
const postgres = require("postgres");

async function runMigration() {
  console.log("Starting Event Database Migration with Postgres package...");

  // Load .env
  const envPath = path.resolve(__dirname, "../.env");
  const envContent = fs.readFileSync(envPath, "utf8");
  let databaseUrl = "";
  envContent.split(/\r?\n/).forEach((line) => {
    line = line.trim();
    if (line.startsWith("DATABASE_URL=")) {
      databaseUrl = line.split("=")[1].replace(/['"]/g, "");
    }
  });

  if (!databaseUrl) {
    console.error("DATABASE_URL not found");
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { ssl: "require" });

  try {
    const migrationPath = path.resolve(
      __dirname,
      "../database/migration_events.sql",
    );
    const sqlContent = fs.readFileSync(migrationPath, "utf8");

    console.log("Executing migration SQL...");
    // The postgres package allows executing multiple statements in one go
    await sql.unsafe(sqlContent);

    console.log("Event migration completed successfully!");

    // Verify
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log(
      "Current Tables:",
      tables.map((t) => t.table_name),
    );

    if (tables.some((t) => t.table_name === "events")) {
      const count = await sql`SELECT count(*) FROM events`;
      console.log("Total events in database:", count[0].count);
    }
  } catch (error) {
    console.error("Migration FAILED:", error);
  } finally {
    await sql.end();
  }
}

runMigration();
