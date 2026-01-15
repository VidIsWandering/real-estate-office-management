/**
 * Unit Tests for Staff Repository
 * Tests database operations for staff management
 */

const staffRepository = require('../../repositories/staff.repository');
const accountRepository = require('../../repositories/account.repository');
const bcrypt = require('bcryptjs');
const {
  setupTestDatabase,
  cleanDatabase,
  closeTestDatabase,
} = require('../helpers/db.helper');

describe('Staff Repository Unit Tests', () => {
  let testAccountId;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
    // Create test account for FK constraint
    const hashedPassword = await bcrypt.hash('password123', 10);
    const account = await accountRepository.create('testuser', hashedPassword);
    testAccountId = account.id;
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('create', () => {
    it('should create staff with minimal data', async () => {
      const staffData = {
        account_id: testAccountId,
        full_name: 'John Doe',
      };

      const staff = await staffRepository.create(staffData);

      expect(staff).toBeDefined();
      expect(staff.id).toBeDefined();
      expect(staff.account_id).toBe(testAccountId);
      expect(staff.full_name).toBe('John Doe');
      expect(staff.position).toBe('agent'); // default
      expect(staff.status).toBe('working'); // default
    });

    it('should create staff with full data', async () => {
      const staffData = {
        account_id: testAccountId,
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        phone_number: '0123456789',
        address: '123 Main St',
        assigned_area: 'District 1',
        position: 'manager',
        status: 'working',
      };

      const staff = await staffRepository.create(staffData);

      expect(staff.full_name).toBe('Jane Smith');
      expect(staff.email).toBe('jane@example.com');
      expect(staff.phone_number).toBe('0123456789');
      expect(staff.address).toBe('123 Main St');
      expect(staff.assigned_area).toBe('District 1');
      expect(staff.position).toBe('manager');
      expect(staff.status).toBe('working');
    });

    it('should handle null optional fields', async () => {
      const staffData = {
        account_id: testAccountId,
        full_name: 'Test User',
        email: null,
        phone_number: null,
      };

      const staff = await staffRepository.create(staffData);

      expect(staff.email).toBeNull();
      expect(staff.phone_number).toBeNull();
    });
  });

  describe('findByAccountId', () => {
    it('should find staff by account_id', async () => {
      const created = await staffRepository.create({
        account_id: testAccountId,
        full_name: 'John Doe',
      });

      const found = await staffRepository.findByAccountId(testAccountId);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.account_id).toBe(testAccountId);
    });

    it('should return null if not found', async () => {
      const found = await staffRepository.findByAccountId(99999);

      expect(found).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find staff by id', async () => {
      const created = await staffRepository.create({
        account_id: testAccountId,
        full_name: 'John Doe',
      });

      const found = await staffRepository.findById(created.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.full_name).toBe('John Doe');
    });

    it('should return null if not found', async () => {
      const found = await staffRepository.findById(99999);

      expect(found).toBeNull();
    });
  });

  describe('findByIdWithAccount', () => {
    it('should find staff with account information', async () => {
      const created = await staffRepository.create({
        account_id: testAccountId,
        full_name: 'John Doe',
      });

      const found = await staffRepository.findByIdWithAccount(created.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.username).toBe('testuser');
      expect(found.account_created_at).toBeDefined();
    });

    it('should return null if not found', async () => {
      const found = await staffRepository.findByIdWithAccount(99999);

      expect(found).toBeNull();
    });
  });

  describe('existsByEmail', () => {
    it('should return true if email exists', async () => {
      await staffRepository.create({
        account_id: testAccountId,
        full_name: 'John Doe',
        email: 'john@example.com',
      });

      const exists = await staffRepository.existsByEmail('john@example.com');

      expect(exists).toBe(true);
    });

    it('should return false if email does not exist', async () => {
      const exists = await staffRepository.existsByEmail(
        'nonexistent@example.com'
      );

      expect(exists).toBe(false);
    });

    it('should be case-sensitive', async () => {
      await staffRepository.create({
        account_id: testAccountId,
        full_name: 'John Doe',
        email: 'john@example.com',
      });

      const exists = await staffRepository.existsByEmail('John@Example.com');

      expect(exists).toBe(false);
    });
  });

  describe('update', () => {
    it('should update staff fields', async () => {
      const created = await staffRepository.create({
        account_id: testAccountId,
        full_name: 'John Doe',
        email: 'john@example.com',
      });

      const updated = await staffRepository.update(created.id, {
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        phone_number: '0987654321',
      });

      expect(updated).toBeDefined();
      expect(updated.full_name).toBe('Jane Smith');
      expect(updated.email).toBe('jane@example.com');
      expect(updated.phone_number).toBe('0987654321');
    });

    it('should return null if staff not found', async () => {
      const updated = await staffRepository.update(99999, {
        full_name: 'Test',
      });

      expect(updated).toBeNull();
    });

    it('should only update provided fields (COALESCE)', async () => {
      const created = await staffRepository.create({
        account_id: testAccountId,
        full_name: 'John Doe',
        email: 'john@example.com',
        phone_number: '0123456789',
      });

      const updated = await staffRepository.update(created.id, {
        full_name: 'Jane Doe',
        // email and phone_number not provided
      });

      expect(updated.full_name).toBe('Jane Doe');
      expect(updated.email).toBe('john@example.com'); // unchanged
      expect(updated.phone_number).toBe('0123456789'); // unchanged
    });

    it('should update preferences as JSON', async () => {
      const created = await staffRepository.create({
        account_id: testAccountId,
        full_name: 'John Doe',
      });

      const preferences = {
        theme: 'dark',
        language: 'vi',
        notifications: true,
      };

      const updated = await staffRepository.update(created.id, {
        preferences,
      });

      expect(updated.preferences).toBeDefined();
      expect(updated.preferences.theme).toBe('dark');
      expect(updated.preferences.language).toBe('vi');
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      // Create multiple accounts and staff
      const hashedPassword = await bcrypt.hash('password', 10);

      for (let i = 1; i <= 5; i++) {
        const account = await accountRepository.create(
          `user${i}`,
          hashedPassword
        );
        await staffRepository.create({
          account_id: account.id,
          full_name: `Staff ${i}`,
          email: `staff${i}@example.com`,
          position: i % 2 === 0 ? 'manager' : 'agent',
          status: i === 5 ? 'off_duty' : 'working',
        });
      }
    });

    it('should return paginated staff list', async () => {
      const result = await staffRepository.findAll(1, 3);

      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(5);
    });

    it('should return second page', async () => {
      const result = await staffRepository.findAll(2, 3);

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(5);
    });

    it('should filter by position', async () => {
      const result = await staffRepository.findAll(1, 10, {
        position: 'manager',
      });

      expect(result.data.length).toBe(2); // staff 2 and 4
      expect(result.total).toBe(2);
      result.data.forEach((staff) => {
        expect(staff.position).toBe('manager');
      });
    });

    it('should filter by status', async () => {
      const result = await staffRepository.findAll(1, 10, {
        status: 'working',
      });

      expect(result.data.length).toBe(4);
      expect(result.total).toBe(4);
    });

    it('should filter by search term', async () => {
      const result = await staffRepository.findAll(1, 10, {
        search: 'Staff 1',
      });

      expect(result.data.length).toBe(1);
      expect(result.data[0].full_name).toBe('Staff 1');
    });

    it('should include username from account', async () => {
      const result = await staffRepository.findAll(1, 1);

      expect(result.data[0].username).toBeDefined();
    });

    it('should order by id DESC', async () => {
      const result = await staffRepository.findAll(1, 10);

      // Newest staff first (higher ID)
      for (let i = 0; i < result.data.length - 1; i++) {
        expect(Number(result.data[i].id)).toBeGreaterThan(
          Number(result.data[i + 1].id)
        );
      }
    });
  });
});
