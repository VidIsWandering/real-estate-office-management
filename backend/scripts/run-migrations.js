#!/usr/bin/env node

/**
 * Database Migration Runner
 *
 * Runs all SQL migration files in order from the migrations/ directory.
 * Used for production deployments on Render, Railway, etc.
 *
 * Usage:
 *   node scripts/run-migrations.js
 *   npm run db:migrate
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

/**
 * Run all migrations in order
 */
async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'migrations');

  console.log('🔄 Starting database migrations...\n');
  console.log(`📁 Migrations directory: ${migrationsDir}\n`);

  // Check if migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migrations directory not found!');
    process.exit(1);
  }

  // Get all .sql files sorted alphabetically
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('ℹ️  No migration files found.');
    process.exit(0);
  }

  console.log(`📋 Found ${files.length} migration file(s):\n`);
  files.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  console.log('');

  // Create migrations tracking table if not exists
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Migrations tracking table ready\n');
  } catch (error) {
    console.error('❌ Failed to create migrations table:', error.message);
    process.exit(1);
  }

  // Run each migration
  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);

    try {
      // Check if migration already executed
      const { rows } = await pool.query(
        'SELECT * FROM migrations WHERE filename = $1',
        [file]
      );

      if (rows.length > 0) {
        console.log(
          `⏭️  Skipping ${file} (already executed at ${rows[0].executed_at})`
        );
        skippedCount++;
        continue;
      }

      // Read and execute migration
      console.log(`🔄 Running ${file}...`);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Begin transaction
      await pool.query('BEGIN');

      try {
        // Execute migration
        await pool.query(sql);

        // Record migration
        await pool.query('INSERT INTO migrations (filename) VALUES ($1)', [
          file,
        ]);

        // Commit transaction
        await pool.query('COMMIT');

        console.log(`✅ Successfully executed ${file}\n`);
        successCount++;
      } catch (migrationError) {
        // Rollback on error
        await pool.query('ROLLBACK');
        throw migrationError;
      }
    } catch (error) {
      console.error(`❌ Failed to execute ${file}:`);
      console.error(`   Error: ${error.message}\n`);
      failedCount++;

      // Stop on first error
      break;
    }
  }

  // Summary
  console.log('━'.repeat(60));
  console.log('📊 Migration Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Failed:  ${failedCount}`);
  console.log('━'.repeat(60));

  if (failedCount > 0) {
    console.error('\n❌ Migrations failed! Please fix errors and try again.');
    process.exit(1);
  } else {
    console.log('\n✅ All migrations completed successfully!');
    process.exit(0);
  }
}

/**
 * Main execution
 */
(async () => {
  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    const { rows } = await pool.query('SELECT NOW()');
    console.log(`✅ Connected to database at ${rows[0].now}\n`);

    // Run migrations
    await runMigrations();
  } catch (error) {
    console.error('\n❌ Migration runner failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
