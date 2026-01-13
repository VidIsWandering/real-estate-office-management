const clientRepository = require("../repositories/client.repository");
const fileRepository = require("../repositories/file.repository");
const realEstateRepository = require("../repositories/real-estate.repository");
const staffRepository = require("../repositories/staff.repository");
const fileService = require("./file.service");


class RealEstateService {
  async create(data) {

    const existingRealEstate = await realEstateRepository.findByLocation(data.location)
    if (existingRealEstate.length > 0) throw new Error("A real estate property already exists at this location")

    const existingOwner = await clientRepository.findById(data.owner_id)
    if (!existingOwner) throw new Error('Owner does not exist');


    try {
      const media_files = await fileService.createManyFiles(data.media_files)
      const legal_docs = await fileService.createManyFiles(data.legal_docs)

      const mediaFileIds = media_files.items.map(item => item.id)
      const legalDocIds = legal_docs.items.map(item => item.id)

      console.log(mediaFileIds)
      const res = await realEstateRepository.create({ ...data, media_files: mediaFileIds, legal_docs: legalDocIds })
      return {
        realEstate: res.toJSON()
      }
    } catch (error) {
      throw error
    }

  };

  async getRealEstates(query) {
    const res = await realEstateRepository.findAll(query)
    return res
  }

  async getRealEstateById(realEstateId) {
    const realEstate = await realEstateRepository.findById(realEstateId)
    if (!realEstate) throw new Error("Real estate not found")
    const mediaFilesPromise = realEstate.media_files.map(item => fileRepository.findById(item))
    const media_files = await Promise.all(mediaFilesPromise)
    const legalDocsPromise = realEstate.legal_docs.map(item => fileRepository.findById(item))
    const legal_docs = await Promise.all(legalDocsPromise)

    const owner = await clientRepository.findById(realEstate.owner_id)
    const staff = await staffRepository.findById(owner.staff_id)
    return {
      realEstate: { ...realEstate.toJSON(), media_files, legal_docs },
      owner: owner.toJSON(),
      staff: staff.toJSON()
    }
  }

  async updateRealEstateById(realEstateId, updateData, staffId) {
    // 1️⃣ Lấy bản ghi hiện tại
    const existingRealEstate = await realEstateRepository.findById(realEstateId);
    if (!existingRealEstate) throw new Error("Real estate not found");

    // 2️⃣ Kiểm tra location để tránh trùng
    if (updateData.location) {
      const otherRealEstates = await realEstateRepository.findByLocation(updateData.location);
      const isIncluded = otherRealEstates.some(item => item.id === realEstateId);
      if (otherRealEstates.length > 0 && !isIncluded) {
        throw new Error("A real estate property already exists at this location");
      }
    }

    // 3️⃣ Upload media files và legal docs
    const media_files = updateData.media_files
      ? (await fileService.createManyFiles(updateData.media_files)).items.map(item => item.id)
      : null;

    const legal_docs = updateData.legal_docs
      ? (await fileService.createManyFiles(updateData.legal_docs)).items.map(item => item.id)
      : null;

    // 4️⃣ Cập nhật bản ghi
    const updatedRealEstate = await realEstateRepository.update(realEstateId, {
      ...updateData,
      media_files: media_files?.length > 0 ? media_files : null,
      legal_docs: legal_docs?.length > 0 ? legal_docs : null
    });

    // 5️⃣ Nếu price thay đổi, lưu lịch sử giá
    if (updateData.price && updateData.price !== existingRealEstate.price) {
      await realEstateRepository.addPriceHistory({
        real_estate_id: realEstateId,
        price: updateData.price,
        changed_by: staffId
      });
    }

    // 6️⃣ Trả về thông tin full, kèm media, legal docs
    return await this.getRealEstateById(realEstateId);
  }


  async legalCheck(realEstateId, staffId, note) {
    const realEstate = await realEstateRepository.findById(realEstateId);
    if (!realEstate) throw new Error('Real estate not found');

    const oldStatus = realEstate.status;

    // Cập nhật status sang 'listed'
    const updatedRealEstate = await realEstateRepository.updateStatus(realEstateId, 'listed');

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
  async updateStatus(realEstateId, status, staffId, reason) {
    const realEstate = await realEstateRepository.findById(realEstateId);
    if (!realEstate) throw new Error('Real estate not found');

    const oldStatus = realEstate.status;
    const updatedRealEstate = await realEstateRepository.updateStatus(realEstateId, status);

    // Lưu lịch sử status
    await realEstateRepository.addStatusHistory({
      real_estate_id: realEstateId,
      old_status: oldStatus,
      new_status: status,
      reason,
      changed_by: staffId,
    });

    return updatedRealEstate;
  }

  // --- 3. Get price history
  async getPriceHistory(realEstateId) {
    const realEstate = await realEstateRepository.findById(realEstateId);
    if (!realEstate) throw new Error('Real estate not found');

    return await realEstateRepository.getPriceHistory(realEstateId);
  }
}

module.exports = new RealEstateService()