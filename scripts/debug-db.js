const fs = require("fs");
const path = require("path");
const postgres = require("postgres");

console.log("Starting debug script...");

const envFiles = [".env", ".env.local"];
const envVars = {};

envFiles.forEach((file) => {
  const envPath = path.resolve(__dirname, `../${file}`);
  if (fs.existsSync(envPath)) {
    console.log(`Parsing ${file}...`);
    try {
      const envContent = fs.readFileSync(envPath, "utf8");
      envContent.split("\n").forEach((line) => {
        if (!line || line.trim().startsWith("#")) return;
        const match = line.match(/^([^=]+)\s*=\s*(.*)$/);
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
  } else {
    console.log(`${file} not found.`);
  }
});

console.log("Found keys:", Object.keys(envVars));

const DATABASE_URL = envVars.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("CRITICAL: DATABASE_URL not found in .env or .env.local");
  process.exit(1);
}

console.log("Attempting to connect to database...");
const maskedUrl = DATABASE_URL.replace(/:([^:@]+)@/, ":****@");
console.log("URL:", maskedUrl);

const sql = postgres(DATABASE_URL, {
  max: 1,
  idle_timeout: 5,
  connect_timeout: 10,
});

async function testConnection() {
  try {
    const result = await sql`SELECT version()`;
    console.log("Database connection successful!");
    console.log("PostgreSQL Version:", result[0].version);

    console.log("\nChecking for admin user...");
    // We try to find ANY user first
    const anyUser = await sql`SELECT count(*) FROM users`;
    console.log("Total users in DB:", anyUser[0].count);

    const adminEmail = "admin@test.com";
    const users =
      await sql`SELECT id, name, email, role, password_hash FROM users WHERE email = ${adminEmail}`;

    if (users.length > 0) {
      console.log("Admin user found:");
      console.log("ID:", users[0].id);
      console.log("Email:", users[0].email);
      console.log("Role:", users[0].role);
    } else {
      console.log(`Admin user (${adminEmail}) NOT found.`);
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    if (error.code === "42P01") {
      console.error('Table "users" does not exist! Did you run migrations?');
    }
  } finally {
    await sql.end();
  }
}

testConnection();
