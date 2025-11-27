const fs = require('fs');
const path = require('path');
const pool = require('./connection');

async function runMigrations() {
  try {
    console.log('🔄 Ejecutando migraciones...');
    
    const migrationFile = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    await pool.query(sql);
    
    console.log('✅ Migraciones ejecutadas exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    process.exit(1);
  }
}

runMigrations();

