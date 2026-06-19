const { upload } = require('../config/cloudinary');

const uploadSingle = upload.single('file');

const handleUpload = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

module.exports = { handleUpload };
