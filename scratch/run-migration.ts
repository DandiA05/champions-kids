import { sql } from "@/lib/db";
import fs from "fs";
import path from "path";

async function runMigration() {
  const sqlPath = path.join(
    process.cwd(),
    "database",
    "migration_schedules.sql",
  );
  const migrationSql = fs.readFileSync(sqlPath, "utf8");

  console.log("Running migration...");
  try {
    // Neon's sql`` tagged template doesn't easily support running multiple statements from a string.
    // We'll split by semicolon if they're simple, or just run the whole thing if the driver supports it.
    // However, some drivers might not like multiple commands.
    // Let's run it as a single block.
    await sql.unsafe(migrationSql);
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
