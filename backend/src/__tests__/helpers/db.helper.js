/**
 * Test Database Utilities
 * Setup and teardown helpers for database testing
 */

const { Pool } = require('pg');

let testDb;

/**
 * Get test database connection
 */
const getTestDb = () => {
  if (!testDb) {
    testDb = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true',
    });
  }
  return testDb;
};

/**
 * Setup test database
 * Creates test database if not exists
 */
const setupTestDatabase = async () => {
  // This would typically run migrations or load schema
  // For now, assumes database exists with schema
  const db = getTestDb();

  try {
    await db.query('SELECT 1');
    console.log('Test database connected');
  } catch (error) {
    console.error('Test database connection failed:', error.message);
    throw error;
  }
};

/**
 * Clean all test data from database
 * Call this in beforeEach or afterEach
 */
const cleanDatabase = async () => {
  const db = getTestDb();

  // Temporarily disable FK constraints for faster cleanup
  await db.query('SET session_replication_role = replica');

  // Delete in correct order (respect foreign keys)
  await db.query('TRUNCATE TABLE audit_log CASCADE');
  await db.query('TRUNCATE TABLE file CASCADE');
  await db.query('TRUNCATE TABLE client_note CASCADE');
  await db.query('TRUNCATE TABLE term CASCADE');
  await db.query('TRUNCATE TABLE voucher CASCADE');
  await db.query('TRUNCATE TABLE contract CASCADE');
  await db.query('TRUNCATE TABLE transaction CASCADE');
  await db.query('TRUNCATE TABLE appointment CASCADE');
  await db.query('TRUNCATE TABLE real_estate CASCADE');
  await db.query('TRUNCATE TABLE client CASCADE');
  await db.query('TRUNCATE TABLE staff CASCADE');
  await db.query('TRUNCATE TABLE account CASCADE');
  await db.query('TRUNCATE TABLE system_config CASCADE');
  await db.query('TRUNCATE TABLE config_catalog CASCADE');
  await db.query('TRUNCATE TABLE role_permission CASCADE');

  // Re-enable FK constraints
  await db.query('SET session_replication_role = DEFAULT');

  // Reset sequences
  await db.query("SELECT setval('account_id_seq', 1, false)");
  await db.query("SELECT setval('staff_id_seq', 1, false)");
  await db.query("SELECT setval('config_catalog_id_seq', 1, false)");
  await db.query("SELECT setval('role_permission_id_seq', 1, false)");
};

/**
 * Close database connection
 */
const closeTestDatabase = async () => {
  if (testDb) {
    await testDb.end();
    testDb = null;
  }
};

/**
 * Seed minimal data for tests
 */
const seedTestData = async () => {
  const db = getTestDb();
  const bcrypt = require('bcryptjs');

  // Create test accounts
  const hashedPassword = await bcrypt.hash('password123', 10);

  const accountResult = await db.query(
    `INSERT INTO account (username, password, is_active) 
     VALUES 
       ('testadmin', $1, true),
       ('testmanager', $1, true),
       ('testagent', $1, true)
     RETURNING id`,
    [hashedPassword]
  );

  const [adminId, managerId, agentId] = accountResult.rows.map((r) => r.id);

  // Create test staff
  await db.query(
    `INSERT INTO staff (account_id, full_name, email, position, status, preferences) 
     VALUES 
       ($1, 'Test Admin', 'admin@test.com', 'admin', 'working', '{"email": true, "sms": false, "push": true}'::jsonb),
       ($2, 'Test Manager', 'manager@test.com', 'manager', 'working', '{"email": true, "sms": false, "push": true}'::jsonb),
       ($3, 'Test Agent', 'agent@test.com', 'agent', 'working', '{"email": true, "sms": false, "push": true}'::jsonb)`,
    [adminId, managerId, agentId]
  );

  // Seed system config
  await db.query(`
    INSERT INTO system_config (key, value, description) VALUES
    ('company_info', '{"company_name": "Test Company", "company_address": "Test Address", "company_phone": "0000000000", "company_email": "test@test.com"}'::jsonb, 'Test company info'),
    ('business_config', '{"working_hours": {"start": "08:00", "end": "17:30"}, "appointment_duration_default": 60}'::jsonb, 'Test business config'),
    ('notification_settings', '{"email_enabled": true, "sms_enabled": false}'::jsonb, 'Test notification settings')
    ON CONFLICT (key) DO NOTHING
  `);

  // Seed config catalogs
  await db.query(`
    INSERT INTO config_catalog (type, value, display_order, is_active, created_by) VALUES
    ('property_type', 'Căn hộ chung cư', 1, true, 1),
    ('property_type', 'Nhà phố', 2, true, 1),
    ('property_type', 'Biệt thự', 3, true, 1),
    ('property_type', 'Đất nền', 4, true, 1),
    ('area', 'Quận 1', 1, true, 1),
    ('area', 'Quận 2', 2, true, 1),
    ('area', 'Quận 3', 3, true, 1),
    ('area', 'Quận 7', 4, true, 1),
    ('lead_source', 'Website', 1, true, 1),
    ('lead_source', 'Facebook', 2, true, 1),
    ('lead_source', 'Giới thiệu', 3, true, 1),
    ('lead_source', 'Hotline', 4, true, 1),
    ('contract_type', 'Mua bán', 1, true, 1),
    ('contract_type', 'Cho thuê', 2, true, 1),
    ('contract_type', 'Ký gửi', 3, true, 1),
    ('contract_type', 'Hợp tác', 4, true, 1)
  `);

  // Seed role permissions (default permissions for each role)
  await db.query(`
    INSERT INTO role_permission (position, resource, permission, is_granted, updated_by) VALUES
    -- Agent permissions
    ('agent', 'transactions', 'view', true, 1),
    ('agent', 'transactions', 'add', true, 1),
    ('agent', 'transactions', 'edit', true, 1),
    ('agent', 'transactions', 'delete', false, 1),
    ('agent', 'properties', 'view', true, 1),
    ('agent', 'properties', 'add', true, 1),
    ('agent', 'properties', 'edit', true, 1),
    ('agent', 'properties', 'delete', false, 1),
    -- Legal Officer permissions
    ('legal_officer', 'contracts', 'view', true, 1),
    ('legal_officer', 'contracts', 'add', true, 1),
    ('legal_officer', 'contracts', 'edit', true, 1),
    ('legal_officer', 'contracts', 'delete', false, 1),
    -- Accountant permissions
    ('accountant', 'payments', 'view', true, 1),
    ('accountant', 'payments', 'add', true, 1),
    ('accountant', 'payments', 'edit', true, 1),
    ('accountant', 'payments', 'delete', false, 1)
  `);

  return { adminId, managerId, agentId };
};

module.exports = {
  getTestDb,
  setupTestDatabase,
  cleanDatabase,
  closeTestDatabase,
  seedTestData,
};
