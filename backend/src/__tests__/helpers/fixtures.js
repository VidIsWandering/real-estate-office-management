/**
 * Test Fixtures - Mock data and helpers
 */

const request = require('supertest');
const app = require('../../app');
const { generateAccessToken } = require('../../utils/jwt.util');

/**
 * Mock user data
 */
const mockUsers = {
  admin: {
    id: 1,
    username: 'testadmin',
    staff_id: 1,
    position: 'admin',
  },
  manager: {
    id: 2,
    username: 'testmanager',
    staff_id: 2,
    position: 'manager',
  },
  agent: {
    id: 3,
    username: 'testagent',
    staff_id: 3,
    position: 'agent',
  },
};

/**
 * Generate test JWT token
 */
const generateTestToken = (user = mockUsers.admin) => {
  return generateAccessToken(user);
};

/**
 * Make authenticated request
 */
const authenticatedRequest = (method, url, user = mockUsers.admin) => {
  const token = generateTestToken(user);
  return request(app)[method](url).set('Authorization', `Bearer ${token}`);
};

/**
 * Login helper
 */
const loginUser = async (username = 'testadmin', password = 'password123') => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({ username, password });

  return response.body.data;
};

/**
 * Mock staff data
 */
const mockStaffData = {
  full_name: 'John Doe',
  email: 'john.doe@test.com',
  phone_number: '0912345678',
  address: '123 Test Street',
  assigned_area: 'District 1',
  position: 'agent',
  status: 'working',
  preferences: {
    email: true,
    sms: false,
    push: true,
  },
};

/**
 * Mock system config data
 */
const mockSystemConfig = {
  company_name: 'Test Real Estate',
  company_address: '456 Test Avenue',
  company_phone: '0909090909',
  company_email: 'contact@testrealestate.com',
  working_hours: {
    start: '09:00',
    end: '18:00',
  },
  appointment_duration_default: 90,
  notification_settings: {
    email_enabled: true,
    sms_enabled: true,
  },
};

module.exports = {
  mockUsers,
  mockStaffData,
  mockSystemConfig,
  generateTestToken,
  authenticatedRequest,
  loginUser,
};
