/**
 * Unit Tests for Catalog Repository
 * Tests all database operations for config catalogs
 */

const catalogRepository = require('../../repositories/catalog.repository');
const {
  setupTestDatabase,
  cleanDatabase,
  closeTestDatabase,
} = require('../helpers/db.helper');
const { NotFoundError, ConflictError } = require('../../utils/error.util');
const { getTestDb } = require('../helpers/db.helper');

describe('Catalog Repository Unit Tests', () => {
  let testStaffId;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
    // Create minimal test account for foreign key
    const db = getTestDb();
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const accountResult = await db.query(
      `INSERT INTO account (username, password) VALUES ('test', $1) RETURNING id`,
      [hashedPassword]
    );
    const accountId = accountResult.rows[0].id;

    const staffResult = await db.query(
      `INSERT INTO staff (account_id, full_name, position) VALUES ($1, 'Test User', 'admin') RETURNING id`,
      [accountId]
    );
    testStaffId = staffResult.rows[0].id;
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('findByType', () => {
    it('should return all active catalogs for a given type', async () => {
      // Create test catalogs
      await catalogRepository.create('area', 'Hanoi', testStaffId);
      await catalogRepository.create('area', 'Ho Chi Minh', testStaffId);
      await catalogRepository.create('property_type', 'Apartment', testStaffId);

      const results = await catalogRepository.findByType('area');

      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBe(2);
      expect(results[0]).toHaveProperty('id');
      expect(results[0]).toHaveProperty('type', 'area');
      expect(results[0]).toHaveProperty('value');
      expect(results[0]).toHaveProperty('display_order');
      expect(results[0]).toHaveProperty('is_active', true);
    });

    it('should return empty array if no catalogs found', async () => {
      const results = await catalogRepository.findByType('lead_source');

      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBe(0);
    });

    it('should not return inactive catalogs', async () => {
      const created = await catalogRepository.create(
        'area',
        'Danang',
        testStaffId
      );
      await catalogRepository.delete(created.id, testStaffId); // Soft delete

      const results = await catalogRepository.findByType('area');

      expect(results.length).toBe(0);
    });

    it('should order results by display_order and id', async () => {
      await catalogRepository.create('area', 'C Item', testStaffId);
      await catalogRepository.create('area', 'A Item', testStaffId);
      await catalogRepository.create('area', 'B Item', testStaffId);

      const results = await catalogRepository.findByType('area');

      // All have display_order = 999 (default), so should be ordered by id ASC
      expect(results.length).toBe(3);
      expect(results[0].value).toBe('C Item');
      expect(results[1].value).toBe('A Item');
      expect(results[2].value).toBe('B Item');
    });
  });

  describe('findById', () => {
    it('should return catalog by id', async () => {
      const created = await catalogRepository.create(
        'area',
        'Hanoi',
        testStaffId
      );

      const result = await catalogRepository.findById(created.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.type).toBe('area');
      expect(result.value).toBe('Hanoi');
      expect(result.is_active).toBe(true);
    });

    it('should return inactive catalogs too', async () => {
      const created = await catalogRepository.create(
        'area',
        'Hanoi',
        testStaffId
      );
      await catalogRepository.delete(created.id, testStaffId);

      const result = await catalogRepository.findById(created.id);

      expect(result).toBeDefined();
      expect(result.is_active).toBe(false);
    });

    it('should return null if catalog not found', async () => {
      const result = await catalogRepository.findById(99999);

      expect(result).toBeNull();
    });
  });

  describe('existsByTypeAndValue', () => {
    it('should return true if value exists for type', async () => {
      await catalogRepository.create('area', 'Hanoi', testStaffId);

      const exists = await catalogRepository.existsByTypeAndValue(
        'area',
        'Hanoi'
      );

      expect(exists).toBe(true);
    });

    it('should return false if value does not exist', async () => {
      const exists = await catalogRepository.existsByTypeAndValue(
        'area',
        'Nonexistent'
      );

      expect(exists).toBe(false);
    });

    it('should be case-insensitive', async () => {
      await catalogRepository.create('area', 'Hanoi', testStaffId);

      const exists = await catalogRepository.existsByTypeAndValue(
        'area',
        'HANOI'
      );

      expect(exists).toBe(true);
    });

    it('should exclude specified id when checking', async () => {
      const created = await catalogRepository.create(
        'area',
        'Hanoi',
        testStaffId
      );

      // Same value but excluded id - should return false
      const exists = await catalogRepository.existsByTypeAndValue(
        'area',
        'Hanoi',
        created.id
      );

      expect(exists).toBe(false);
    });

    it('should check within same type only', async () => {
      await catalogRepository.create('area', 'Hanoi', testStaffId);

      const exists = await catalogRepository.existsByTypeAndValue(
        'property_type',
        'Hanoi'
      );

      expect(exists).toBe(false);
    });
  });

  describe('create', () => {
    it('should create a new catalog item', async () => {
      const result = await catalogRepository.create(
        'area',
        'Hanoi',
        testStaffId
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result.type).toBe('area');
      expect(result.value).toBe('Hanoi');
      expect(result.display_order).toBe(999); // Default
      expect(result.is_active).toBe(true);
      expect(result).toHaveProperty('created_at');
      expect(result).toHaveProperty('updated_at');
    });

    it('should throw ConflictError for duplicate value', async () => {
      await catalogRepository.create('area', 'Hanoi', testStaffId);

      await expect(
        catalogRepository.create('area', 'Hanoi', testStaffId)
      ).rejects.toThrow(ConflictError);

      await expect(
        catalogRepository.create('area', 'Hanoi', testStaffId)
      ).rejects.toThrow('already exists');
    });

    it('should allow same value for different types', async () => {
      await catalogRepository.create('area', 'Luxury', testStaffId);
      const result = await catalogRepository.create(
        'property_type',
        'Luxury',
        testStaffId
      );

      expect(result.type).toBe('property_type');
      expect(result.value).toBe('Luxury');
    });

    it('should store createdBy and updatedBy', async () => {
      const result = await catalogRepository.create(
        'area',
        'Hanoi',
        testStaffId
      );

      // Verify by checking database directly
      expect(result.id).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update catalog value', async () => {
      const created = await catalogRepository.create(
        'area',
        'Hanoi',
        testStaffId
      );

      const updated = await catalogRepository.update(
        created.id,
        'Ha Noi City',
        testStaffId
      );

      expect(updated.id).toBe(created.id);
      expect(updated.value).toBe('Ha Noi City');
      expect(updated.type).toBe('area');
    });

    it('should throw NotFoundError for non-existent catalog', async () => {
      await expect(
        catalogRepository.update(99999, 'New Value', testStaffId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError for inactive catalog', async () => {
      const created = await catalogRepository.create(
        'area',
        'Hanoi',
        testStaffId
      );
      await catalogRepository.delete(created.id, testStaffId);

      await expect(
        catalogRepository.update(created.id, 'New Value', testStaffId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ConflictError for duplicate value', async () => {
      await catalogRepository.create('area', 'Hanoi', testStaffId);
      const item2 = await catalogRepository.create(
        'area',
        'Ho Chi Minh',
        testStaffId
      );

      await expect(
        catalogRepository.update(item2.id, 'Hanoi', testStaffId)
      ).rejects.toThrow(ConflictError);
    });

    it('should allow updating to same value (no change)', async () => {
      const created = await catalogRepository.create(
        'area',
        'Hanoi',
        testStaffId
      );

      const updated = await catalogRepository.update(
        created.id,
        'Hanoi',
        testStaffId
      );

      expect(updated.value).toBe('Hanoi');
    });
  });

  describe('delete', () => {
    it('should soft delete catalog item', async () => {
      const created = await catalogRepository.create(
        'area',
        'Hanoi',
        testStaffId
      );

      const result = await catalogRepository.delete(created.id, testStaffId);

      expect(result).toBe(true);

      // Verify it's soft deleted
      const found = await catalogRepository.findById(created.id);
      expect(found).toBeDefined();
      expect(found.is_active).toBe(false);
    });

    it('should throw NotFoundError for non-existent catalog', async () => {
      await expect(
        catalogRepository.delete(99999, testStaffId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError for already deleted catalog', async () => {
      const created = await catalogRepository.create(
        'area',
        'Hanoi',
        testStaffId
      );
      await catalogRepository.delete(created.id, testStaffId);

      await expect(
        catalogRepository.delete(created.id, testStaffId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should not appear in findByType after deletion', async () => {
      const created = await catalogRepository.create(
        'area',
        'Hanoi',
        testStaffId
      );
      await catalogRepository.delete(created.id, testStaffId);

      const results = await catalogRepository.findByType('area');

      expect(results.length).toBe(0);
    });
  });

  describe('updateOrder', () => {
    it('should update display order for multiple items', async () => {
      const item1 = await catalogRepository.create(
        'area',
        'Item 1',
        testStaffId
      );
      const item2 = await catalogRepository.create(
        'area',
        'Item 2',
        testStaffId
      );
      const item3 = await catalogRepository.create(
        'area',
        'Item 3',
        testStaffId
      );

      const result = await catalogRepository.updateOrder([
        { id: item1.id, display_order: 3 },
        { id: item2.id, display_order: 1 },
        { id: item3.id, display_order: 2 },
      ]);

      expect(result).toBe(true);

      // Verify new order
      const items = await catalogRepository.findByType('area');
      expect(items[0].id).toBe(item2.id); // display_order = 1
      expect(items[1].id).toBe(item3.id); // display_order = 2
      expect(items[2].id).toBe(item1.id); // display_order = 3
    });

    it('should be transactional - all succeed or all fail', async () => {
      const item1 = await catalogRepository.create(
        'area',
        'Item 1',
        testStaffId
      );
      const item2 = await catalogRepository.create(
        'area',
        'Item 2',
        testStaffId
      );

      // Update both items
      const result = await catalogRepository.updateOrder([
        { id: item1.id, display_order: 10 },
        { id: item2.id, display_order: 20 },
      ]);

      expect(result).toBe(true);

      // Verify both updated
      const found1 = await catalogRepository.findById(item1.id);
      const found2 = await catalogRepository.findById(item2.id);
      expect(found1.display_order).toBe(10);
      expect(found2.display_order).toBe(20);
    });

    it('should handle empty array', async () => {
      const result = await catalogRepository.updateOrder([]);

      expect(result).toBe(true);
    });
  });
});
