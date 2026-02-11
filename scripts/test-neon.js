const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

console.log("Starting Neon Serverless test...");

const envFiles = [".env", ".env.local"];
const envVars = {};

envFiles.forEach((file) => {
  const envPath = path.resolve(__dirname, `../${file}`);
  if (fs.existsSync(envPath)) {
    console.log(`Reading ${file}...`);
    try {
      const envContent = fs.readFileSync(envPath, "utf8");
      envContent.split("\n").forEach((line) => {
        line = line.trim();
        if (!line || line.startsWith("#")) return;
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let value = match[2].trim();
          if (value.startsWith("'") && value.endsWith("'"))
            value = value.slice(1, -1);
          if (value.startsWith('"') && value.endsWith('"'))
            value = value.slice(1, -1);
          envVars[key] = value;
        }
      });
    } catch (e) {
      console.error(`Error reading ${file}:`, e.message);
    }
  }
});

const DATABASE_URL = envVars.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("CRITICAL: DATABASE_URL not found in .env or .env.local");
  process.exit(1);
}

console.log("Connecting to Neon...");
const sql = neon(DATABASE_URL);

async function runTest() {
  try {
    const result = await sql`SELECT version()`;
    console.log("Connection successful!");
    console.log("PostgreSQL Version:", result[0].version);

    const users = await sql`SELECT count(*) FROM users`;
    console.log("Total users in database:", users[0].count);

    const adminEmail = "admin@test.com";
    const adminUser =
      await sql`SELECT id, email, role FROM users WHERE email = ${adminEmail}`;

    if (adminUser.length > 0) {
      console.log("Admin user found:", adminUser[0]);
    } else {
      console.log(`Admin user (${adminEmail}) not found.`);
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTest();
