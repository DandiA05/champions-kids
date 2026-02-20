const fs = require("fs");
const { neon } = require("@neondatabase/serverless");

async function run() {
  try {
    const env = fs.readFileSync(".env", "utf8");
    const dbUrlMatch = env.match(/DATABASE_URL=(.+)/);
    if (!dbUrlMatch) {
      console.error("DATABASE_URL not found in .env");
      return;
    }
    const dbUrl = dbUrlMatch[1].trim().replace(/^['"]|['"]$/g, "");
    const sql = neon(dbUrl);

    console.log("Adding columns to clubs and matches...");
    await sql`ALTER TABLE clubs ADD COLUMN IF NOT EXISTS is_our_team BOOLEAN DEFAULT FALSE`;
    await sql`ALTER TABLE matches ADD COLUMN IF NOT EXISTS result VARCHAR(10)`;

    console.log("Successfully applied migration");
  } catch (e) {
    console.error("Migration failed:", e);
  }
}

run();
