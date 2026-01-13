const clientRepository = require('../repositories/client.repository');
const fileRepository = require('../repositories/file.repository');
const realEstateRepository = require('../repositories/real-estate.repository');
const staffRepository = require('../repositories/staff.repository');
const fileService = require('./file.service');

class RealEstateService {
  async create(data) {
    const existingRealEstate = await realEstateRepository.findByLocation(
      data.location
    );
    if (existingRealEstate.length > 0)
      throw new Error('A real estate property already exists at this location');

    const existingOwner = await clientRepository.findById(data.owner_id);
    if (!existingOwner) throw new Error('Owner does not exist');

    try {
      const media_files = await fileService.createManyFiles(data.media_files);
      const legal_docs = await fileService.createManyFiles(data.legal_docs);

      const mediaFileIds = media_files.items.map((item) => item.id);
      const legalDocIds = legal_docs.items.map((item) => item.id);

      console.log(mediaFileIds);
      const res = await realEstateRepository.create({
        ...data,
        media_files: mediaFileIds,
        legal_docs: legalDocIds,
      });
      return {
        realEstate: res.toJSON(),
      };
    } catch (error) {
      throw error;
    }
  }

  async getRealEstates(query) {
    const res = await realEstateRepository.findAll(query);
    return res;
  }

  async getRealEstateById(realEstateId) {
    const realEstate = await realEstateRepository.findById(realEstateId);
    if (!realEstate) throw new Error('Real estate not found');
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

  async updateRealEstateById(realEstateId, updateData) {
    const existingRealEstate = await realEstateRepository.findByLocation(
      updateData.location
    );
    const isIncluded = existingRealEstate.find((item) => {
      console.log(item.id);
      return (item.id = realEstateId);
    })
      ? true
      : false;
    console.log(isIncluded);
    if (existingRealEstate.length > 0 && !isIncluded)
      throw new Error('A real estate property already exists at this location');
    const media_files = await fileService.createManyFiles(
      updateData.media_files
    );
    const legal_docs = await fileService.createManyFiles(updateData.legal_docs);

    const mediaFileIds = media_files.items.map((item) => item.id);
    const legalDocIds = legal_docs.items.map((item) => item.id);

    await realEstateRepository.update(realEstateId, {
      ...updateData,
      media_files: mediaFileIds.length > 0 ? mediaFileIds : null,
      legal_docs: legalDocIds.length > 0 ? legalDocIds : null,
    });

    const res = await this.getRealEstateById(realEstateId);

    return res;
  }
}

module.exports = new RealEstateService();
