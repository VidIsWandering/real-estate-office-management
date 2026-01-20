const { STAFF_ROLES } = require('../config/constants');
const clientRepository = require('../repositories/client.repository');
const fileRepository = require('../repositories/file.repository');
const realEstateRepository = require('../repositories/real-estate.repository');
const staffRepository = require('../repositories/staff.repository');
const fileService = require('./file.service');

class RealEstateService {
  async create(data, user) {
    const existingOwner = await clientRepository.findById(data.owner_id);
    if (!existingOwner) throw new Error('Owner does not exist');

    const position = String(user?.position ?? '').toLowerCase();
    const canManageAll =
      position === STAFF_ROLES.MANAGER || position === STAFF_ROLES.ADMIN;

    if (!canManageAll && existingOwner.staff_id != user.staff_id) {
      throw new Error('You do not have permission to manage this customer');
    }

    const media_files = await fileService.createManyFiles(data.media_files);
    const legal_docs = await fileService.createManyFiles(data.legal_docs);

    const mediaFileIds = media_files.items.map((item) => item.id);
    const legalDocIds = legal_docs.items.map((item) => item.id);

    const res = await realEstateRepository.create({
      ...data,
      media_files: mediaFileIds,
      legal_docs: legalDocIds,
    });
    return {
      realEstate: res.toJSON(),
    };
  }

  async getRealEstates(query, user) {
    const position = String(user?.position ?? '').toLowerCase();
    const canSeeAll =
      position === STAFF_ROLES.MANAGER || position === STAFF_ROLES.ADMIN;

    // Avoid mutating req.query directly.
    const normalizedQuery = { ...query };

    // Default behavior: agent only sees their own listings.
    if (!canSeeAll) {
      normalizedQuery.staff_id = user.staff_id;
    } else {
      // Admin/Manager default: show all listings.
      // If a caller accidentally passes staff_id, ignore it.
      delete normalizedQuery.staff_id;
    }

    const res = await realEstateRepository.findAll(normalizedQuery);
    return res;
  }

  async getRealEstateById(realEstateId, user) {
    const realEstate = await realEstateRepository.findById(realEstateId);
    if (!realEstate) throw new Error('Real estate not found');

    const canManageAll =
      user.position === STAFF_ROLES.MANAGER ||
      user.position === STAFF_ROLES.ADMIN;

    if (realEstate.staff_id != user.staff_id && !canManageAll) {
      throw new Error('You do not have permission to manage this real estate');
    }
    const mediaFilesPromise = realEstate.media_files.map((item) =>
      fileRepository.findById(item)
    );
    const media_files = await Promise.all(mediaFilesPromise);
    const legalDocsPromise = realEstate.legal_docs.map((item) =>
      fileRepository.findById(item)
    );
    const legal_docs = await Promise.all(legalDocsPromise);

    const owner = await clientRepository.findById(realEstate.owner_id);
    const staff = await staffRepository.findById(owner.staff_id);
    return {
      realEstate: { ...realEstate.toJSON(), media_files, legal_docs },
      owner: owner.toJSON(),
      staff: staff.toJSON(),
    };
  }

  async updateRealEstateById(realEstateId, updateData, user) {
    // 1️⃣ Lấy bản ghi hiện tại
    const existingRealEstate =
      await realEstateRepository.findById(realEstateId);
    if (!existingRealEstate) throw new Error('Real estate not found');

    const canManageAll =
      user.position === STAFF_ROLES.MANAGER ||
      user.position === STAFF_ROLES.ADMIN;

    if (existingRealEstate.staff_id != user.staff_id && !canManageAll) {
      throw new Error('You do not have permission to manage this real estate');
    }
    // 2️⃣ Kiểm tra location để tránh trùng
    if (updateData.location) {
      const otherRealEstates = await realEstateRepository.findByLocation(
        updateData.location
      );
      const isIncluded = otherRealEstates.some(
        (item) => item.id === realEstateId
      );
      if (otherRealEstates.length > 0 && !isIncluded) {
        throw new Error(
          'A real estate property already exists at this location'
        );
      }
    }

    // 3️⃣ Upload media files và legal docs (only when provided)
    let mediaFileIds;
    if (Array.isArray(updateData.media_files)) {
      mediaFileIds = (
        await fileService.createManyFiles(updateData.media_files)
      ).items.map((item) => item.id);
    }

    let legalDocIds;
    if (Array.isArray(updateData.legal_docs)) {
      legalDocIds = (
        await fileService.createManyFiles(updateData.legal_docs)
      ).items.map((item) => item.id);
    }

    const updateFields = { ...updateData };
    delete updateFields.media_files;
    delete updateFields.legal_docs;

    // Backend derives staff_id from token
    updateFields.staff_id = user.staff_id;

    // Only overwrite media/legal docs when explicitly provided.
    if (mediaFileIds !== undefined) {
      updateFields.media_files = mediaFileIds.length > 0 ? mediaFileIds : null;
    }
    if (legalDocIds !== undefined) {
      updateFields.legal_docs = legalDocIds.length > 0 ? legalDocIds : null;
    }

    // 4️⃣ Cập nhật bản ghi
    await realEstateRepository.update(realEstateId, updateFields);

    // 5️⃣ Nếu price thay đổi, lưu lịch sử giá
    if (updateData.price && updateData.price !== existingRealEstate.price) {
      await realEstateRepository.addPriceHistory({
        real_estate_id: realEstateId,
        price: updateData.price,
        changed_by: user.staff_id,
      });
    }

    // 6️⃣ Trả về thông tin full, kèm media, legal docs
    return await this.getRealEstateById(realEstateId, user);
  }

  /**
   * Legal check - chuyển status sang 'listed'
   */
  async legalCheck(realEstateId, staffId, note) {
    const realEstate = await realEstateRepository.findById(realEstateId);
    if (!realEstate) throw new Error('Real estate not found');

    const oldStatus = realEstate.status;

    // Cập nhật status sang 'listed'
    const updatedRealEstate = await realEstateRepository.updateStatus(
      realEstateId,
      'listed'
    );

    // Lưu lịch sử status
    await realEstateRepository.addStatusHistory({
      real_estate_id: realEstateId,
      old_status: oldStatus,
      new_status: 'listed',
      reason: note,
      changed_by: staffId,
    });

    return updatedRealEstate;
  }

  // --- 2. Update status manually
  async updateStatus(realEstateId, status, user, reason) {
    const realEstate = await realEstateRepository.findById(realEstateId);
    if (!realEstate) throw new Error('Real estate not found');

    const canManageAll =
      user.position === STAFF_ROLES.MANAGER ||
      user.position === STAFF_ROLES.ADMIN;

    if (realEstate.staff_id != user.staff_id && !canManageAll) {
      throw new Error('You do not have permission to manage this real estate');
    }

    const oldStatus = realEstate.status;
    const updatedRealEstate = await realEstateRepository.updateStatus(
      realEstateId,
      status
    );

    // Lưu lịch sử status
    await realEstateRepository.addStatusHistory({
      real_estate_id: realEstateId,
      old_status: oldStatus,
      new_status: status,
      reason,
      changed_by: user.staff_id,
    });

    return updatedRealEstate;
  }

  /**
   * Get price history
   */
  async getPriceHistory(realEstateId) {
    const realEstate = await realEstateRepository.findById(realEstateId);
    if (!realEstate) throw new Error('Real estate not found');

    return await realEstateRepository.getPriceHistory(realEstateId);
  }
}

module.exports = new RealEstateService();
