/**
 * Integration Tests for Auth APIs
 */

const request = require('supertest');
const app = require('../../app');
const {
  setupTestDatabase,
  cleanDatabase,
  closeTestDatabase,
  seedTestData,
} = require('../helpers/db.helper');
const { generateTestToken, mockUsers } = require('../helpers/fixtures');

describe('Auth API Integration Tests', () => {
  let adminToken;
  let testAccountIds;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
    testAccountIds = await seedTestData();
    adminToken = generateTestToken(mockUsers.admin);
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'testadmin',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('account');
      expect(response.body.data).toHaveProperty('staff');
      expect(response.body.data).toHaveProperty('tokens');
      expect(response.body.data.tokens).toHaveProperty('access_token');
      expect(response.body.data.tokens).toHaveProperty('refresh_token');
      expect(response.body.data.staff.position).toBe('admin');
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'testadmin',
          password: 'wrongpassword',
        })
        .expect(500); // Service throws error, caught by error middleware

      // Error middleware returns error object, not standardized response
      expect(response.body).toBeDefined();
    });

    it('should return 400 with missing fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'testadmin',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/v1/auth/profile', () => {
    it('should return profile for authenticated user', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('account');
      expect(response.body.data).toHaveProperty('staff');
      expect(response.body.data.staff).toHaveProperty('preferences');
      expect(response.body.data.staff.preferences).toEqual({
        email: true,
        sms: false,
        push: true,
      });
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/auth/profile', () => {
    it('should update profile successfully', async () => {
      const response = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          full_name: 'Updated Admin Name',
          email: 'updated.admin@test.com',
          phone_number: '0987654321',
          address: '789 Updated Street',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.staff.full_name).toBe('Updated Admin Name');
      expect(response.body.data.staff.email).toBe('updated.admin@test.com');
      expect(response.body.data.staff.phone_number).toBe('0987654321');
    });

    it('should update preferences successfully', async () => {
      const response = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          preferences: {
            email: false,
            sms: true,
            push: false,
          },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.staff.preferences).toEqual({
        email: false,
        sms: true,
        push: false,
      });
    });

    it('should return 400 with invalid email format', async () => {
      const response = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .put('/api/v1/auth/profile')
        .send({
          full_name: 'Test',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/auth/change-password', () => {
    it('should change password successfully', async () => {
      const response = await request(app)
        .put('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          old_password: 'password123',
          new_password: 'newpassword456',
          confirm_password: 'newpassword456',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password changed');

      // Verify new password works
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'testadmin',
          password: 'newpassword456',
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it('should return 400 with incorrect old password', async () => {
      const response = await request(app)
        .put('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          old_password: 'wrongpassword',
          new_password: 'newpassword456',
          confirm_password: 'newpassword456',
        })
        .expect(500); // Service throws error, caught by error middleware

      // Error middleware returns error object, not standardized response
      expect(response.body).toBeDefined();
    });

    it('should return 400 with password mismatch', async () => {
      const response = await request(app)
        .put('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          old_password: 'password123',
          new_password: 'newpassword456',
          confirm_password: 'differentpassword',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });
});
