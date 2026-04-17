const { neon } = require('@neondatabase/serverless');
const DATABASE_URL = 'postgresql://neondb_owner:npg_b0E9TwPIXoSf@ep-shiny-shape-a1e2mwbz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(DATABASE_URL);

async function check() {
  try {
    const result = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'schedules')`;
    console.log('Result:', result);
  } catch (e) {
    console.error('Check failed:', e);
  }
}
check();
