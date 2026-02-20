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
    const dbUrl = dbUrlMatch[1]
      .trim()
      .replace(/^['']|[''']$/g, "")
      .replace(/^"|"$/g, "");
    const sql = neon(dbUrl);

    console.log("Checking and adding remark column to matches table...");
    await sql`ALTER TABLE matches ADD COLUMN IF NOT EXISTS remark VARCHAR(255)`;

    console.log("Successfully updated matches table.");

    // Verify
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'matches' AND column_name = 'remark'
    `;

    if (columns.length > 0) {
      console.log("Verification SUCCESS: 'remark' column exists.");
    } else {
      console.error("Verification FAILED: 'remark' column NOT found.");
    }
  } catch (e) {
    console.error("Script failed:", e);
  }
}

run();
