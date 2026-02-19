const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function checkColumns() {
  try {
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'players'
      ORDER BY ordinal_position;
    `;

    console.log("Columns in 'players' table:");
    result.forEach((col) => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });
  } catch (err) {
    console.error("Error checking columns:", err);
  }
}

checkColumns();
