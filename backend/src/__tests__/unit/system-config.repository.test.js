/**
 * Unit Tests for SystemConfigRepository
 */

const systemConfigRepository = require('../../repositories/system-config.repository');
const {
  getTestDb,
  cleanDatabase,
  seedTestData,
  setupTestDatabase,
  closeTestDatabase,
} = require('../helpers/db.helper');

describe('SystemConfigRepository', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
    await seedTestData(); // This creates staff records

    // Seed initial config
    const db = getTestDb();
    await db.query(`
      INSERT INTO system_config (key, value, description) VALUES
      ('test_config_1', '{"key1": "value1"}'::jsonb, 'Test config 1'),
      ('test_config_2', '{"key2": "value2"}'::jsonb, 'Test config 2')
      ON CONFLICT (key) DO NOTHING
    `);
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('getAll', () => {
    it('should return all configurations', async () => {
      const configs = await systemConfigRepository.getAll();

      expect(configs).toBeInstanceOf(Array);
      expect(configs.length).toBeGreaterThanOrEqual(2);
      expect(configs[0]).toHaveProperty('key');
      expect(configs[0]).toHaveProperty('value');
      expect(configs[0]).toHaveProperty('description');
    });
  });

  describe('getByKey', () => {
    it('should return config by key', async () => {
      const config = await systemConfigRepository.getByKey('test_config_1');

      expect(config).not.toBeNull();
      expect(config.key).toBe('test_config_1');
      expect(config.value).toEqual({ key1: 'value1' });
    });

    it('should return null for non-existent key', async () => {
      const config = await systemConfigRepository.getByKey('non_existent');

      expect(config).toBeNull();
    });
  });

  describe('update', () => {
    it('should update existing config', async () => {
      const updated = await systemConfigRepository.update(
        'test_config_1',
        { key1: 'updated_value' },
        1
      );

      expect(updated).not.toBeNull();
      expect(updated.key).toBe('test_config_1');
      expect(updated.value).toEqual({ key1: 'updated_value' });
    });

    it('should return null for non-existent key', async () => {
      const updated = await systemConfigRepository.update(
        'non_existent',
        { test: 'value' },
        1
      );

      expect(updated).toBeNull();
    });
  });

  describe('upsert', () => {
    it('should insert new config', async () => {
      const config = await systemConfigRepository.upsert(
        'new_config',
        { new_key: 'new_value' },
        'New configuration',
        1
      );

      expect(config).not.toBeNull();
      expect(config.key).toBe('new_config');
      expect(config.value).toEqual({ new_key: 'new_value' });
    });

    it('should update existing config on conflict', async () => {
      const config = await systemConfigRepository.upsert(
        'test_config_1',
        { key1: 'upserted_value' },
        'Updated description',
        1
      );

      expect(config).not.toBeNull();
      expect(config.key).toBe('test_config_1');
      expect(config.value).toEqual({ key1: 'upserted_value' });
    });
  });

  describe('getMergedConfig', () => {
    it('should merge all configs into single object', async () => {
      // Setup proper config structure
      const db = getTestDb();
      await db.query('DELETE FROM system_config');
      await db.query(`
        INSERT INTO system_config (key, value, description) VALUES
        ('company_info', '{"company_name": "Test Company", "company_phone": "0000000000"}'::jsonb, 'Company info'),
        ('business_config', '{"working_hours": {"start": "08:00", "end": "17:30"}}'::jsonb, 'Business config'),
        ('notification_settings', '{"email_enabled": true}'::jsonb, 'Notifications')
      `);

      const merged = await systemConfigRepository.getMergedConfig();

      expect(merged).toHaveProperty('company_name', 'Test Company');
      expect(merged).toHaveProperty('company_phone', '0000000000');
      expect(merged).toHaveProperty('working_hours');
      expect(merged.working_hours).toEqual({ start: '08:00', end: '17:30' });
      expect(merged).toHaveProperty('notification_settings');
      expect(merged.notification_settings).toEqual({ email_enabled: true });
    });
  });
});
