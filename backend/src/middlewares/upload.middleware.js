/**
 * Upload Middleware - Handle file uploads
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ValidationError } = require('../utils/error.util');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: accountId-timestamp.ext
    const accountId = req.user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${accountId}-${timestamp}${ext}`);
  },
});

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new ValidationError(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      )
    );
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

/**
 * Middleware for single avatar upload
 */
const uploadAvatar = upload.single('avatar');

/**
 * Error handler for multer
 */
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ValidationError('File size exceeds 5MB limit'));
    }
    return next(new ValidationError(`Upload error: ${err.message}`));
  }
  next(err);
};

module.exports = {
  uploadAvatar,
  handleUploadError,
};
