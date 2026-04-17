const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = 'postgresql://neondb_owner:npg_b0E9TwPIXoSf@ep-shiny-shape-a1e2mwbz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(DATABASE_URL);

async function migrate() {
  try {
    console.log('Creating table...');
    await sql`CREATE TABLE IF NOT EXISTS schedules (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`;
    console.log('Creating index 1...');
    await sql`CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date)`;
    console.log('Creating index 2...');
    await sql`CREATE INDEX IF NOT EXISTS idx_schedules_category ON schedules(category)`;
    console.log('Migration done!');
  } catch (e) {
    console.error('Migration failed:', e);
  }
}
migrate();
