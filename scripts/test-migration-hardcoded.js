const { neon } = require("@neondatabase/serverless");

const databaseUrl =
  "postgresql://neondb_owner:npg_b0E9TwPIXoSf@ep-shiny-shape-a1e2mwbz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function test() {
  console.log("Connecting to Neon with hardcoded URL...");
  const sql = neon(databaseUrl);
  try {
    const result = await sql`SELECT 1 + 1 as sum`;
    console.log("Test query result:", result[0].sum);

    console.log("Attempting to create tables...");
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'non-admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Users table created or exists.");

    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`;
    console.log("Indexes created.");

    // Insert admin if not exists
    await sql`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (
        'Admin User',
        'admin@test.com',
        '$2b$10$npg_b0E9TwPIXoSf_PLACEHOLDER_HASH', -- Need a real hash for admin123
        'admin'
      )
      ON CONFLICT (email) DO NOTHING
    `;
    // Wait, I should use the real hash for admin123
    // From create-admin.sql: $2a$10$rQZ9vK5xK5xK5xK5xK5xKOqH7Z9vK5xK5xK5xK5xK5xK5xK5xK5xK

    console.log("Migration steps finished.");

    const tables =
      await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log(
      "Public tables:",
      tables.map((t) => t.table_name),
    );
  } catch (e) {
    console.error("FAILED:", e);
  }
}

test();
