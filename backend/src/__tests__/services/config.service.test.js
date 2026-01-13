/**
 * Config Service Tests
 * Unit tests for config service layer
 */

const configService = require('../../services/config.service');
const catalogRepository = require('../../repositories/catalog.repository');
const permissionRepository = require('../../repositories/permission.repository');

// Mock repositories
jest.mock('../../repositories/catalog.repository');
jest.mock('../../repositories/permission.repository');

describe('Config Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCatalogsByType', () => {
    it('should return catalogs for valid type', async () => {
      const mockCatalogs = [
        { id: 1, type: 'property_type', value: 'Căn hộ', display_order: 1 },
        { id: 2, type: 'property_type', value: 'Nhà phố', display_order: 2 },
      ];
      catalogRepository.findByType.mockResolvedValue(mockCatalogs);

      const result = await configService.getCatalogsByType('property_type');

      expect(result).toEqual(mockCatalogs);
      expect(catalogRepository.findByType).toHaveBeenCalledWith(
        'property_type'
      );
    });

    it('should throw error for invalid type', async () => {
      await expect(
        configService.getCatalogsByType('invalid_type')
      ).rejects.toThrow('Invalid catalog type');
    });
  });

  describe('createCatalog', () => {
    it('should create catalog with valid data', async () => {
      const mockCatalog = {
        id: 5,
        type: 'area',
        value: 'Quận 1',
        display_order: 999,
      };
      catalogRepository.existsByTypeAndValue.mockResolvedValue(false);
      catalogRepository.create.mockResolvedValue(mockCatalog);

      const result = await configService.createCatalog('area', 'Quận 1', 1);

      expect(result).toEqual(mockCatalog);
      expect(catalogRepository.existsByTypeAndValue).toHaveBeenCalledWith(
        'area',
        'Quận 1'
      );
      expect(catalogRepository.create).toHaveBeenCalledWith(
        'area',
        'Quận 1',
        1
      );
    });

    it('should throw error for invalid type', async () => {
      await expect(
        configService.createCatalog('invalid', 'value', 1)
      ).rejects.toThrow('Invalid catalog type');
    });

    it('should throw error for empty value', async () => {
      await expect(configService.createCatalog('area', '', 1)).rejects.toThrow(
        'Value is required'
      );
    });

    it('should throw error for duplicate value', async () => {
      catalogRepository.existsByTypeAndValue.mockResolvedValue(true);

      await expect(
        configService.createCatalog('area', 'Quận 1', 1)
      ).rejects.toThrow('Value "Quận 1" already exists for area');
    });

    it('should trim whitespace from value', async () => {
      const mockCatalog = { id: 5, type: 'area', value: 'Quận 1' };
      catalogRepository.existsByTypeAndValue.mockResolvedValue(false);
      catalogRepository.create.mockResolvedValue(mockCatalog);

      await configService.createCatalog('area', '  Quận 1  ', 1);

      expect(catalogRepository.create).toHaveBeenCalledWith(
        'area',
        'Quận 1',
        1
      );
    });
  });

  describe('updateCatalog', () => {
    it('should update catalog with valid data', async () => {
      const mockCatalog = { id: 5, type: 'area', value: 'Quận 1 Updated' };
      catalogRepository.findById.mockResolvedValue({
        id: 5,
        type: 'area',
        value: 'Quận 1',
      });
      catalogRepository.existsByTypeAndValue.mockResolvedValue(false);
      catalogRepository.update.mockResolvedValue(mockCatalog);

      const result = await configService.updateCatalog(5, 'Quận 1 Updated', 1);

      expect(result).toEqual(mockCatalog);
      expect(catalogRepository.findById).toHaveBeenCalledWith(5);
      expect(catalogRepository.existsByTypeAndValue).toHaveBeenCalledWith(
        'area',
        'Quận 1 Updated',
        5
      );
      expect(catalogRepository.update).toHaveBeenCalledWith(
        5,
        'Quận 1 Updated',
        1
      );
    });

    it('should throw error for non-existent catalog', async () => {
      catalogRepository.findById.mockResolvedValue(null);

      await expect(
        configService.updateCatalog(999, 'New Value', 1)
      ).rejects.toThrow('Catalog item not found');
    });

    it('should throw error for empty value', async () => {
      catalogRepository.findById.mockResolvedValue({
        id: 5,
        type: 'area',
        value: 'Old',
      });

      await expect(configService.updateCatalog(5, '', 1)).rejects.toThrow(
        'Value is required'
      );
    });

    it('should throw error for duplicate value', async () => {
      catalogRepository.findById.mockResolvedValue({
        id: 5,
        type: 'area',
        value: 'Old',
      });
      catalogRepository.existsByTypeAndValue.mockResolvedValue(true);

      await expect(
        configService.updateCatalog(5, 'Duplicate', 1)
      ).rejects.toThrow('Value "Duplicate" already exists for area');
    });
  });

  describe('deleteCatalog', () => {
    it('should delete existing catalog', async () => {
      catalogRepository.findById.mockResolvedValue({
        id: 5,
        type: 'area',
        value: 'Quận 1',
      });
      catalogRepository.delete.mockResolvedValue(true);

      await configService.deleteCatalog(5, 1);

      expect(catalogRepository.findById).toHaveBeenCalledWith(5);
      expect(catalogRepository.delete).toHaveBeenCalledWith(5, 1);
    });

    it('should throw error for non-existent catalog', async () => {
      catalogRepository.findById.mockResolvedValue(null);

      await expect(configService.deleteCatalog(999, 1)).rejects.toThrow(
        'Catalog item not found'
      );
    });
  });

  describe('getAllPermissions', () => {
    it('should return all permissions as matrix', async () => {
      const mockFlat = [
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'create',
          is_granted: true,
        },
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'read',
          is_granted: true,
        },
      ];
      const mockMatrix = {
        agent: {
          transactions: { create: true, read: true },
        },
      };
      permissionRepository.findAll.mockResolvedValue(mockFlat);
      permissionRepository.transformToMatrix.mockReturnValue(mockMatrix);

      const result = await configService.getAllPermissions();

      expect(result).toEqual(mockMatrix);
      expect(permissionRepository.findAll).toHaveBeenCalled();
      expect(permissionRepository.transformToMatrix).toHaveBeenCalledWith(
        mockFlat
      );
    });

    it('should return empty matrix when no permissions', async () => {
      permissionRepository.findAll.mockResolvedValue([]);
      permissionRepository.transformToMatrix.mockReturnValue({});

      const result = await configService.getAllPermissions();

      expect(result).toEqual({});
    });
  });

  describe('getPermissionsByPosition', () => {
    it('should return permissions for valid position', async () => {
      const mockFlat = [
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'create',
          is_granted: true,
        },
      ];
      const mockMatrix = {
        agent: { transactions: { create: true } },
      };
      permissionRepository.findByPosition.mockResolvedValue(mockFlat);
      permissionRepository.transformToMatrix.mockReturnValue(mockMatrix);

      const result = await configService.getPermissionsByPosition('agent');

      expect(result).toEqual(mockMatrix.agent);
      expect(permissionRepository.findByPosition).toHaveBeenCalledWith('agent');
    });

    it('should throw error for invalid position', async () => {
      await expect(
        configService.getPermissionsByPosition('invalid')
      ).rejects.toThrow('Invalid position');
    });

    it('should return empty object when no permissions', async () => {
      permissionRepository.findByPosition.mockResolvedValue([]);
      permissionRepository.transformToMatrix.mockReturnValue({});

      const result = await configService.getPermissionsByPosition('agent');

      expect(result).toEqual({});
    });
  });

  describe('updatePermissions', () => {
    it('should update permissions with valid data', async () => {
      const inputMatrix = {
        agent: {
          transactions: { view: true, add: true, edit: false },
        },
      };
      const flatPermissions = [
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
          is_granted: true,
        },
        {
          position: 'agent',
          resource: 'transactions',
          permission: 'edit',
          is_granted: false,
        },
      ];
      const resultMatrix = inputMatrix;

      permissionRepository.bulkUpsert.mockResolvedValue(true);
      permissionRepository.findAll.mockResolvedValue(flatPermissions);
      permissionRepository.transformToMatrix.mockReturnValue(resultMatrix);

      const result = await configService.updatePermissions(inputMatrix, 1);

      expect(result).toEqual(resultMatrix);
      expect(permissionRepository.bulkUpsert).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            position: 'agent',
            resource: 'transactions',
            permission: 'view',
            is_granted: true,
          }),
        ]),
        1
      );
    });

    it('should throw error for invalid position in matrix', async () => {
      const invalidMatrix = {
        invalid_position: {
          transactions: { view: true },
        },
      };

      await expect(
        configService.updatePermissions(invalidMatrix, 1)
      ).rejects.toThrow('Invalid position: invalid_position');
    });

    it('should throw error for invalid resource in matrix', async () => {
      const invalidMatrix = {
        agent: {
          invalid_resource: { view: true },
        },
      };

      await expect(
        configService.updatePermissions(invalidMatrix, 1)
      ).rejects.toThrow('Invalid resource: invalid_resource');
    });

    it('should throw error for invalid permission in matrix', async () => {
      const invalidMatrix = {
        agent: {
          transactions: { invalid_perm: true },
        },
      };

      await expect(
        configService.updatePermissions(invalidMatrix, 1)
      ).rejects.toThrow('Invalid permission: invalid_perm');
    });

    it('should coerce non-boolean permission value to boolean', async () => {
      const inputMatrix = {
        agent: {
          transactions: { view: 'yes' },
        },
      };

      permissionRepository.bulkUpsert.mockResolvedValue(true);
      permissionRepository.findAll.mockResolvedValue([]);
      permissionRepository.transformToMatrix.mockReturnValue({});

      await configService.updatePermissions(inputMatrix, 1);

      expect(permissionRepository.bulkUpsert).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            is_granted: true, // Boolean('yes') = true
          }),
        ]),
        1
      );
    });

    it('should handle empty permissions matrix', async () => {
      permissionRepository.bulkUpsert.mockResolvedValue(true);
      permissionRepository.findAll.mockResolvedValue([]);
      permissionRepository.transformToMatrix.mockReturnValue({});

      const result = await configService.updatePermissions({}, 1);

      expect(result).toEqual({});
    });
  });
});
