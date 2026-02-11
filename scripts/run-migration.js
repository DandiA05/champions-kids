const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

async function runMigration() {
  console.log("Starting Database Migration...");

  // Load .env
  const envPath = path.resolve(__dirname, "../.env");
  if (!fs.existsSync(envPath)) {
    console.error(".env file not found");
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, "utf8");
  const env = {};
  envContent.split(/\r?\n/).forEach((line) => {
    line = line.trim();
    if (!line || line.startsWith("#")) return;
    const firstEq = line.indexOf("=");
    if (firstEq !== -1) {
      const key = line.substring(0, firstEq).trim();
      let value = line.substring(firstEq + 1).trim();
      // Strip quotes
      if (value.startsWith("'") && value.endsWith("'"))
        value = value.slice(1, -1);
      if (value.startsWith('"') && value.endsWith('"'))
        value = value.slice(1, -1);
      env[key] = value;
    }
  });

  const getUrl = () => {
    if (env.DATABASE_URL) return env.DATABASE_URL;
    if (env.PGUSER && env.PGPASSWORD && env.PGHOST && env.PGDATABASE) {
      return `postgresql://${env.PGUSER}:${env.PGPASSWORD}@${env.PGHOST}/${env.PGDATABASE}?sslmode=${env.PGSSLMODE || "require"}&channel_binding=${env.PGCHANNELBINDING || "require"}`;
    }
    return null;
  };

  const databaseUrl = getUrl();

  if (!databaseUrl) {
    console.log("Parsed env keys:", Object.keys(env));
    console.error("DATABASE_URL or individual PG variables not found in .env");
    process.exit(1);
  }

  // Load Migration SQL
  const migrationPath = path.resolve(__dirname, "../database/migration.sql");
  if (!fs.existsSync(migrationPath)) {
    console.error("Migration SQL file not found at:", migrationPath);
    process.exit(1);
  }

  let sqlContent = fs.readFileSync(migrationPath, "utf8");

  // Strip SQL comments
  sqlContent = sqlContent.replace(/--.*$/gm, "");

  const sql = neon(databaseUrl);

  try {
    console.log("Executing migration commands sequentially...");
    const commands = sqlContent
      .split(";")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    for (const cmd of commands) {
      console.log(`Running command (${cmd.substring(0, 50)}...)...`);
      await sql(cmd);
    }
    console.log("Migration completed successfully!");

    // Verify
    const tables =
      await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log(
      "Final table list:",
      tables.map((t) => t.table_name),
    );
  } catch (error) {
    console.error("Migration FAILED:", error);
  }
}

runMigration();
