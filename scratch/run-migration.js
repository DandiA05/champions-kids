const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = 'postgresql://neondb_owner:npg_b0E9TwPIXoSf@ep-shiny-shape-a1e2mwbz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(DATABASE_URL);

async function runMigration() {
  const sqlPath = path.join(__dirname, '..', 'database', 'migration_schedules.sql');
  const migrationSql = fs.readFileSync(sqlPath, 'utf8');
  
  console.log('Running migration...');
  try {
    const statements = migrationSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 50) + '...');
      await sql.unsafe(statement);
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
