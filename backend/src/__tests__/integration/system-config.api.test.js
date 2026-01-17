/**
 * Integration Tests for System Config APIs
 */

const request = require('supertest');
const app = require('../../app');
const {
  setupTestDatabase,
  cleanDatabase,
  closeTestDatabase,
  seedTestData,
} = require('../helpers/db.helper');
const {
  generateTestToken,
  mockUsers,
  mockSystemConfig,
} = require('../helpers/fixtures');

describe('System Config API Integration Tests', () => {
  let adminToken;
  let managerToken;
  let agentToken;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
    await seedTestData();

    adminToken = generateTestToken(mockUsers.admin);
    managerToken = generateTestToken(mockUsers.manager);
    agentToken = generateTestToken(mockUsers.agent);
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('GET /api/v1/system/config', () => {
    it('should return system config for admin', async () => {
      const response = await request(app)
        .get('/api/v1/system/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('company_name');
      expect(response.body.data).toHaveProperty('company_address');
      expect(response.body.data).toHaveProperty('company_phone');
      expect(response.body.data).toHaveProperty('company_email');
      expect(response.body.data).toHaveProperty('working_hours');
      expect(response.body.data).toHaveProperty('appointment_duration_default');
      expect(response.body.data).toHaveProperty('notification_settings');
    });

    it('should return system config for manager', async () => {
      const response = await request(app)
        .get('/api/v1/system/config')
        .set('Authorization', `Bearer ${managerToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('company_name');
    });

    it('should return 403 for agent (not authorized)', async () => {
      const response = await request(app)
        .get('/api/v1/system/config')
        .set('Authorization', `Bearer ${agentToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/v1/system/config')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/system/config', () => {
    it('should update system config for admin', async () => {
      const response = await request(app)
        .put('/api/v1/system/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockSystemConfig)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.company_name).toBe(
        mockSystemConfig.company_name
      );
      expect(response.body.data.company_phone).toBe(
        mockSystemConfig.company_phone
      );
      expect(response.body.data.working_hours).toEqual(
        mockSystemConfig.working_hours
      );
      expect(response.body.data.appointment_duration_default).toBe(
        mockSystemConfig.appointment_duration_default
      );
    });

    it('should persist config changes', async () => {
      // Update config
      await request(app)
        .put('/api/v1/system/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          company_name: 'Updated Company Name',
          company_address: 'New Address',
          company_phone: '1111111111',
          company_email: 'new@company.com',
          working_hours: { start: '10:00', end: '19:00' },
          appointment_duration_default: 120,
        })
        .expect(200);

      // Verify changes persisted
      const response = await request(app)
        .get('/api/v1/system/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.company_name).toBe('Updated Company Name');
      expect(response.body.data.company_phone).toBe('1111111111');
      expect(response.body.data.working_hours.start).toBe('10:00');
      expect(response.body.data.appointment_duration_default).toBe(120);
    });

    it('should return 403 for manager (not admin)', async () => {
      const response = await request(app)
        .put('/api/v1/system/config')
        .set('Authorization', `Bearer ${managerToken}`)
        .send(mockSystemConfig)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should return 403 for agent', async () => {
      const response = await request(app)
        .put('/api/v1/system/config')
        .set('Authorization', `Bearer ${agentToken}`)
        .send(mockSystemConfig)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .put('/api/v1/system/config')
        .send(mockSystemConfig)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
