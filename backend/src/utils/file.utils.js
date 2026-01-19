function formatUploadedFile(file) {
  return {
    url: file.path, // Cloudinary URL
    name: file.originalname, // Tên file gốc
    type: file.mimetype, // mime type
    uploaded_at: new Date(), // thời điểm upload
  };
}

function formatUploadedFiles(files = []) {
  return files.map(formatUploadedFile);
}

module.exports = {
  formatUploadedFile,
  formatUploadedFiles,
};
