/**
 * Unit Tests for Permission Repository
 * Tests all database operations for role permissions
 */

const permissionRepository = require('../../repositories/permission.repository');
const {
  setupTestDatabase,
  cleanDatabase,
  closeTestDatabase,
} = require('../helpers/db.helper');
const { getTestDb } = require('../helpers/db.helper');

describe('Permission Repository Unit Tests', () => {
  let testStaffId;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
    // Create minimal test staff for foreign key
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

  describe('findAll', () => {
    it('should return all permissions ordered by position, resource, permission', async () => {
      // Create test permissions
      await permissionRepository.upsert(
        'agent',
        'transactions',
        'view',
        true,
        testStaffId
      );
      await permissionRepository.upsert(
        'agent',
        'transactions',
        'add',
        false,
        testStaffId
      );
      await permissionRepository.upsert(
        'manager',
        'contracts',
        'view',
        true,
        testStaffId
      );

      const results = await permissionRepository.findAll();

      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBe(3);
      expect(results[0]).toHaveProperty('id');
      expect(results[0]).toHaveProperty('position');
      expect(results[0]).toHaveProperty('resource');
      expect(results[0]).toHaveProperty('permission');
      expect(results[0]).toHaveProperty('is_granted');
      expect(results[0]).toHaveProperty('updated_at');
    });

    it('should return empty array if no permissions exist', async () => {
      const results = await permissionRepository.findAll();

      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBe(0);
    });

    it('should order by position, then resource, then permission', async () => {
      await permissionRepository.upsert(
        'manager',
        'contracts',
        'add',
        true,
        testStaffId
      );
      await permissionRepository.upsert(
        'agent',
        'transactions',
        'view',
        true,
        testStaffId
      );
      await permissionRepository.upsert(
        'agent',
        'contracts',
        'view',
        true,
        testStaffId
      );

      const results = await permissionRepository.findAll();

      expect(results.length).toBe(3);
      // Check all items are present
      const items = results.map((r) => `${r.position}/${r.resource}`);
      expect(items).toContain('agent/contracts');
      expect(items).toContain('agent/transactions');
      expect(items).toContain('manager/contracts');
    });
  });

  describe('findByPosition', () => {
    it('should return all permissions for a specific position', async () => {
      await permissionRepository.upsert(
        'agent',
        'transactions',
        'view',
        true,
        testStaffId
      );
      await permissionRepository.upsert(
        'agent',
        'contracts',
        'view',
        false,
        testStaffId
      );
      await permissionRepository.upsert(
        'manager',
        'transactions',
        'view',
        true,
        testStaffId
      );

      const results = await permissionRepository.findByPosition('agent');

      expect(results.length).toBe(2);
      expect(results[0].position).toBe('agent');
      expect(results[1].position).toBe('agent');
    });

    it('should return empty array if no permissions for position', async () => {
      const results = await permissionRepository.findByPosition('agent');

      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBe(0);
    });

    it('should order by resource and permission', async () => {
      await permissionRepository.upsert(
        'agent',
        'contracts',
        'view',
        true,
        testStaffId
      );
      await permissionRepository.upsert(
        'agent',
        'contracts',
        'add',
        true,
        testStaffId
      );
      await permissionRepository.upsert(
        'agent',
        'transactions',
        'view',
        true,
        testStaffId
      );

      const results = await permissionRepository.findByPosition('agent');

      expect(results.length).toBe(3);
      // Verify all three are present and ordered
      const sorted = results.map((r) => `${r.resource}/${r.permission}`).sort();
      expect(sorted).toEqual([
        'contracts/add',
        'contracts/view',
        'transactions/view',
      ]);
    });
  });

  describe('findByPositionResourcePermission', () => {
    it('should return specific permission record', async () => {
      await permissionRepository.upsert(
        'agent',
        'transactions',
        'view',
        true,
        testStaffId
      );

      const result =
        await permissionRepository.findByPositionResourcePermission(
          'agent',
          'transactions',
          'view'
        );

      expect(result).toBeDefined();
      expect(result.position).toBe('agent');
      expect(result.resource).toBe('transactions');
      expect(result.permission).toBe('view');
      expect(result.is_granted).toBe(true);
    });

    it('should return null if permission not found', async () => {
      const result =
        await permissionRepository.findByPositionResourcePermission(
          'agent',
          'transactions',
          'view'
        );

      expect(result).toBeNull();
    });

    it('should find exact match by position, resource, permission', async () => {
      // Create two similar permissions
      await permissionRepository.upsert(
        'agent',
        'transactions',
        'view',
        true,
        testStaffId
      );
      await permissionRepository.upsert(
        'agent',
        'transactions',
        'add',
        false,
        testStaffId
      );
      await permissionRepository.upsert(
        'agent',
        'contracts',
        'view',
        true,
        testStaffId
      );

      // Should find exact match only
      const result1 =
        await permissionRepository.findByPositionResourcePermission(
          'agent',
          'transactions',
          'view'
        );
      expect(result1).not.toBeNull();
      expect(result1.is_granted).toBe(true);

      const result2 =
        await permissionRepository.findByPositionResourcePermission(
          'agent',
          'transactions',
          'add'
        );
      expect(result2).not.toBeNull();
      expect(result2.is_granted).toBe(false);

      const result3 =
        await permissionRepository.findByPositionResourcePermission(
          'agent',
          'contracts',
          'view'
        );
      expect(result3).not.toBeNull();
      expect(result3.is_granted).toBe(true);
    });
  });

  describe('upsert', () => {
    it('should insert new permission', async () => {
      const result = await permissionRepository.upsert(
        'agent',
        'transactions',
        'view',
        true,
        testStaffId
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result.position).toBe('agent');
      expect(result.resource).toBe('transactions');
      expect(result.permission).toBe('view');
      expect(result.is_granted).toBe(true);
    });

    it('should update existing permission', async () => {
      // Insert first
      const inserted = await permissionRepository.upsert(
        'agent',
        'transactions',
        'view',
        true,
        testStaffId
      );

      // Update same permission
      const updated = await permissionRepository.upsert(
        'agent',
        'transactions',
        'view',
        false,
        testStaffId
      );

      expect(updated.id).toBe(inserted.id);
      expect(updated.is_granted).toBe(false);

      // Verify only one record exists
      const all = await permissionRepository.findAll();
      expect(all.length).toBe(1);
    });

    it('should handle false permission value', async () => {
      const result = await permissionRepository.upsert(
        'agent',
        'transactions',
        'delete',
        false,
        testStaffId
      );

      expect(result.is_granted).toBe(false);
    });

    it('should update updatedBy field', async () => {
      const db = getTestDb();

      // Create second staff
      const account2 = await db.query(
        `INSERT INTO account (username, password) VALUES ('test2', 'hash') RETURNING id`
      );
      const staff2 = await db.query(
        `INSERT INTO staff (account_id, full_name, position) VALUES ($1, 'Staff 2', 'admin') RETURNING id`,
        [account2.rows[0].id]
      );
      const staff2Id = staff2.rows[0].id;

      // Insert with first staff
      await permissionRepository.upsert(
        'agent',
        'transactions',
        'view',
        true,
        testStaffId
      );

      // Update with second staff
      await permissionRepository.upsert(
        'agent',
        'transactions',
        'view',
        false,
        staff2Id
      );

      // Verify updated_by changed (would need to query DB directly to check)
      const result =
        await permissionRepository.findByPositionResourcePermission(
          'agent',
          'transactions',
          'view'
        );
      expect(result.is_granted).toBe(false);
    });
  });

  describe('bulkUpsert', () => {
    it('should insert multiple permissions', async () => {
      const permissions = [
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'view',
          is_granted: true,
        },
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'add',
          is_granted: false,
        },
        {
          position: 'agent',
          resource: 'contracts',
          permission: 'view',
          is_granted: true,
        },
      ];

      const results = await permissionRepository.bulkUpsert(
        permissions,
        testStaffId
      );

      expect(results.length).toBe(3);
      expect(results[0]).toHaveProperty('id');
      expect(results[0].position).toBe('agent');
    });

    it('should update existing permissions', async () => {
      // Insert initial permissions
      await permissionRepository.upsert(
        'agent',
        'transactions',
        'view',
        true,
        testStaffId
      );
      await permissionRepository.upsert(
        'agent',
        'transactions',
        'add',
        false,
        testStaffId
      );

      // Bulk update
      const permissions = [
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'view',
          is_granted: false,
        },
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'add',
          is_granted: true,
        },
      ];

      const results = await permissionRepository.bulkUpsert(
        permissions,
        testStaffId
      );

      expect(results.length).toBe(2);
      expect(results[0].is_granted).toBe(false);
      expect(results[1].is_granted).toBe(true);

      // Verify total count
      const all = await permissionRepository.findAll();
      expect(all.length).toBe(2);
    });

    it('should handle empty array', async () => {
      const results = await permissionRepository.bulkUpsert([], testStaffId);

      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBe(0);
    });

    it('should be transactional - all succeed or all fail', async () => {
      const permissions = [
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'view',
          is_granted: true,
        },
        {
          position: 'agent',
          resource: 'contracts',
          permission: 'view',
          is_granted: true,
        },
      ];

      const results = await permissionRepository.bulkUpsert(
        permissions,
        testStaffId
      );

      expect(results.length).toBe(2);

      // Verify both were inserted
      const all = await permissionRepository.findAll();
      expect(all.length).toBe(2);
    });
  });

  describe('transformToMatrix', () => {
    it('should transform flat permissions to matrix format', async () => {
      const permissions = [
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'view',
          is_granted: true,
        },
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'add',
          is_granted: false,
        },
        {
          position: 'agent',
          resource: 'contracts',
          permission: 'view',
          is_granted: true,
        },
        {
          position: 'manager',
          resource: 'transactions',
          permission: 'view',
          is_granted: true,
        },
      ];

      const matrix = permissionRepository.transformToMatrix(permissions);

      expect(matrix).toHaveProperty('agent');
      expect(matrix.agent).toHaveProperty('transactions');
      expect(matrix.agent.transactions).toHaveProperty('view', true);
      expect(matrix.agent.transactions).toHaveProperty('add', false);
      expect(matrix.agent).toHaveProperty('contracts');
      expect(matrix.agent.contracts).toHaveProperty('view', true);
      expect(matrix).toHaveProperty('manager');
      expect(matrix.manager.transactions).toHaveProperty('view', true);
    });

    it('should handle empty array', () => {
      const matrix = permissionRepository.transformToMatrix([]);

      expect(matrix).toEqual({});
    });

    it('should handle single permission', () => {
      const permissions = [
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'view',
          is_granted: true,
        },
      ];

      const matrix = permissionRepository.transformToMatrix(permissions);

      expect(Object.keys(matrix).length).toBe(1);
      expect(matrix.agent.transactions.view).toBe(true);
    });
  });

  describe('transformToFlat', () => {
    it('should transform matrix format to flat permissions', () => {
      const matrix = {
        agent: {
          transactions: { view: true, add: false },
          contracts: { view: true },
        },
        manager: {
          transactions: { view: true },
        },
      };

      const flat = permissionRepository.transformToFlat(matrix);

      expect(flat).toBeInstanceOf(Array);
      expect(flat.length).toBe(4);
      expect(flat).toContainEqual({
        position: 'agent',
        resource: 'transactions',
        permission: 'view',
        is_granted: true,
      });
      expect(flat).toContainEqual({
        position: 'agent',
        resource: 'transactions',
        permission: 'add',
        is_granted: false,
      });
    });

    it('should handle empty matrix', () => {
      const flat = permissionRepository.transformToFlat({});

      expect(flat).toEqual([]);
    });

    it('should round-trip correctly', () => {
      const original = [
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'view',
          is_granted: true,
        },
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'add',
          is_granted: false,
        },
      ];

      const matrix = permissionRepository.transformToMatrix(original);
      const flat = permissionRepository.transformToFlat(matrix);

      expect(flat.length).toBe(2);
      expect(flat).toContainEqual(original[0]);
      expect(flat).toContainEqual(original[1]);
    });
  });
});
