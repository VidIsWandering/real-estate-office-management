const multer = require('multer');
const {CloudinaryStorage} = require("multer-storage-cloudinary")
const cloudinary = require("../config/cloudinary.js")

// ⚙️ Storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',               // folder trên cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'pdf'],
    resource_type: 'auto',            // image / video auto
  },
});

// 📤 Multer middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

module.exports =  upload

