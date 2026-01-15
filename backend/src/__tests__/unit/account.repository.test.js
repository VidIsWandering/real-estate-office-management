/**
 * Unit Tests for Account Repository
 * Tests all database operations for user accounts
 */

const accountRepository = require('../../repositories/account.repository');
const bcrypt = require('bcryptjs');
const {
  setupTestDatabase,
  cleanDatabase,
  closeTestDatabase,
} = require('../helpers/db.helper');

describe('Account Repository Unit Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('create', () => {
    it('should create a new account', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);

      const account = await accountRepository.create(
        'testuser',
        hashedPassword
      );

      expect(account).toBeDefined();
      expect(account.id).toBeDefined();
      expect(account.username).toBe('testuser');
      expect(account.password).toBe(hashedPassword);
      expect(account.created_at).toBeDefined();
    });

    it('should throw error on duplicate username', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);

      await accountRepository.create('testuser', hashedPassword);

      // Try to create duplicate
      await expect(
        accountRepository.create('testuser', hashedPassword)
      ).rejects.toThrow();
    });

    it('should allow different usernames', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);

      const account1 = await accountRepository.create('user1', hashedPassword);
      const account2 = await accountRepository.create('user2', hashedPassword);

      expect(account1.username).toBe('user1');
      expect(account2.username).toBe('user2');
      expect(account1.id).not.toBe(account2.id);
    });
  });

  describe('findByUsername', () => {
    it('should find account by username', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const created = await accountRepository.create(
        'testuser',
        hashedPassword
      );

      const found = await accountRepository.findByUsername('testuser');

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.username).toBe('testuser');
      expect(found.password).toBe(hashedPassword);
    });

    it('should return null if username not found', async () => {
      const found = await accountRepository.findByUsername('nonexistent');

      expect(found).toBeNull();
    });

    it('should be case-sensitive', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await accountRepository.create('testuser', hashedPassword);

      const found = await accountRepository.findByUsername('TestUser');

      expect(found).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find account by id', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const created = await accountRepository.create(
        'testuser',
        hashedPassword
      );

      const found = await accountRepository.findById(created.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
      expect(found.username).toBe('testuser');
    });

    it('should return null if id not found', async () => {
      const found = await accountRepository.findById(99999);

      expect(found).toBeNull();
    });

    it('should handle multiple accounts correctly', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const account1 = await accountRepository.create('user1', hashedPassword);
      const account2 = await accountRepository.create('user2', hashedPassword);

      const found1 = await accountRepository.findById(account1.id);
      const found2 = await accountRepository.findById(account2.id);

      expect(found1.username).toBe('user1');
      expect(found2.username).toBe('user2');
    });
  });

  describe('existsByUsername', () => {
    it('should return true if username exists', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await accountRepository.create('testuser', hashedPassword);

      const exists = await accountRepository.existsByUsername('testuser');

      expect(exists).toBe(true);
    });

    it('should return false if username does not exist', async () => {
      const exists = await accountRepository.existsByUsername('nonexistent');

      expect(exists).toBe(false);
    });

    it('should be case-sensitive', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await accountRepository.create('testuser', hashedPassword);

      const exists = await accountRepository.existsByUsername('TestUser');

      expect(exists).toBe(false);
    });

    it('should work with multiple accounts', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await accountRepository.create('user1', hashedPassword);
      await accountRepository.create('user2', hashedPassword);

      expect(await accountRepository.existsByUsername('user1')).toBe(true);
      expect(await accountRepository.existsByUsername('user2')).toBe(true);
      expect(await accountRepository.existsByUsername('user3')).toBe(false);
    });
  });

  describe('updatePassword', () => {
    it('should update account password', async () => {
      const oldPassword = await bcrypt.hash('oldpassword', 10);
      const account = await accountRepository.create('testuser', oldPassword);

      const newPassword = await bcrypt.hash('newpassword', 10);
      const updated = await accountRepository.updatePassword(
        account.id,
        newPassword
      );

      expect(updated).toBeDefined();
      expect(updated.id).toBe(account.id);
      expect(updated.password).toBe(newPassword);
      expect(updated.password).not.toBe(oldPassword);
    });

    it('should return null if account not found', async () => {
      const newPassword = await bcrypt.hash('newpassword', 10);
      const updated = await accountRepository.updatePassword(
        99999,
        newPassword
      );

      expect(updated).toBeNull();
    });

    it('should not affect other accounts', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const account1 = await accountRepository.create('user1', hashedPassword);
      const account2 = await accountRepository.create('user2', hashedPassword);

      const newPassword = await bcrypt.hash('newpassword', 10);
      await accountRepository.updatePassword(account1.id, newPassword);

      const found1 = await accountRepository.findById(account1.id);
      const found2 = await accountRepository.findById(account2.id);

      expect(found1.password).toBe(newPassword);
      expect(found2.password).toBe(hashedPassword);
    });
  });

  describe('delete', () => {
    it('should delete account successfully', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const account = await accountRepository.create(
        'testuser',
        hashedPassword
      );

      const deleted = await accountRepository.delete(account.id);

      expect(deleted).toBe(true);

      // Verify account is actually deleted
      const found = await accountRepository.findById(account.id);
      expect(found).toBeNull();
    });

    it('should return false if account not found', async () => {
      const deleted = await accountRepository.delete(99999);

      expect(deleted).toBe(false);
    });

    it('should only delete specified account', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const account1 = await accountRepository.create('user1', hashedPassword);
      const account2 = await accountRepository.create('user2', hashedPassword);

      await accountRepository.delete(account1.id);

      const found1 = await accountRepository.findById(account1.id);
      const found2 = await accountRepository.findById(account2.id);

      expect(found1).toBeNull();
      expect(found2).not.toBeNull();
      expect(found2.username).toBe('user2');
    });

    it('should handle double delete gracefully', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const account = await accountRepository.create(
        'testuser',
        hashedPassword
      );

      const deleted1 = await accountRepository.delete(account.id);
      const deleted2 = await accountRepository.delete(account.id);

      expect(deleted1).toBe(true);
      expect(deleted2).toBe(false);
    });
  });
});
