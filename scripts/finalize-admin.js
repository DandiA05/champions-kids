const { neon } = require("@neondatabase/serverless");
const bcrypt = require("bcryptjs");

const databaseUrl =
  "postgresql://neondb_owner:npg_b0E9TwPIXoSf@ep-shiny-shape-a1e2mwbz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function updateAdmin() {
  const sql = neon(databaseUrl);
  const password = "admin123";
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log("Generated hash for admin123:", hash);

  try {
    // Check if admin exits
    const users = await sql`SELECT * FROM users WHERE email = 'admin@test.com'`;

    if (users.length > 0) {
      await sql`UPDATE users SET password_hash = ${hash} WHERE email = 'admin@test.com'`;
      console.log("Admin user updated with new hash.");
    } else {
      await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('Test Admin', 'admin@test.com', ${hash}, 'admin')
      `;
      console.log("Admin user created with new hash.");
    }
  } catch (e) {
    console.error("Update failed:", e);
  }
}

updateAdmin();
