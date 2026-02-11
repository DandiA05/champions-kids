const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

async function checkTables() {
  console.log("Checking database tables...");

  // Load .env
  const envPath = path.resolve(__dirname, "../.env");
  const envContent = fs.readFileSync(envPath, "utf8");
  let databaseUrl = "";
  envContent.split("\n").forEach((line) => {
    line = line.trim();
    if (line.startsWith("DATABASE_URL=")) {
      databaseUrl = line.split("=")[1].replace(/['"]/g, "");
    }
  });

  if (!databaseUrl) {
    console.error("DATABASE_URL not found");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    console.log(
      "Tables found:",
      result.map((r) => r.table_name),
    );

    if (result.some((r) => r.table_name === "users")) {
      console.log('SUCCESS: Table "users" exists.');
      const userCount = await sql`SELECT count(*) FROM users`;
      console.log("User count:", userCount[0].count);
    } else {
      console.log('FAILED: Table "users" does not exist.');
    }
  } catch (error) {
    console.error("Error checking tables:", error);
  }
}

checkTables();
