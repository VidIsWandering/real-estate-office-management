const fileRepository = require('../repositories/file.repository');

class FileService {
  /**
   * 📌 Create new file
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async createFile(data) {
    try {
      const file = await fileRepository.create(data);

      return {
        file: file.toJSON(),
      };
    } catch (error) {
      throw new Error('ERROR: FileService - createFile');
    }
  }

  /**
   * 📌 Get all files
   * @returns {Promise<Object>}
   */
  async getAllFiles() {
    try {
      const files = await fileRepository.findAll();

      return {
        items: files.map((file) => file.toJSON()),
      };
    } catch (error) {
      throw new Error('ERROR: FileService - getAllFiles');
    }
  }

  /**
   * 📌 Get file by id
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getFileById(id) {
    try {
      const file = await fileRepository.findById(id);
      if (!file) {
        throw new Error('File not found');
      }

      return {
        file: file.toJSON(),
      };
    } catch (error) {
      throw new Error('ERROR: FileService - getFileById');
    }
  }

  /**
   * 📌 Update file
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateFile(id, data) {
    try {
      const file = await fileRepository.update(id, data);
      if (!file) {
        throw new Error('File not found');
      }

      return {
        file: file.toJSON(),
      };
    } catch (error) {
      throw new Error('ERROR: FileService - updateFile');
    }
  }

  /**
   * 📌 Delete file
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async deleteFile(id) {
    try {
      const isDeleted = await fileRepository.delete(id);
      if (!isDeleted) {
        throw new Error('File not found');
      }

      return {
        message: 'File deleted successfully',
      };
    } catch (error) {
      throw new Error('ERROR: FileService - deleteFile');
    }
  }

  /**
   * 📌 Create many files (useful for upload multiple files)
   * @param {Array<Object>} files
   * @returns {Promise<Object>}
   */
  async createManyFiles(files) {
    try {
      const createdFiles = [];

      for (const fileData of files) {
        const file = await fileRepository.create(fileData);
        createdFiles.push(file.toJSON());
      }

      return {
        items: createdFiles,
      };
    } catch (error) {
      throw new Error('ERROR: FileService - createManyFiles');
    }
  }

  async getFilesByIds(ids) {
  const files = await fileRepository.findByIds(ids);
  return files.map(file => file.toJSON());
}

}

module.exports = new FileService();
