const { cloudinary } = require('../config/cloudinary');

/**
 * Delete a file from Cloudinary by its public ID
 */
const deleteFile = async (publicId, resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Get file info from Cloudinary
 */
const getFileInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary fetch error:', error);
    throw error;
  }
};

module.exports = { deleteFile, getFileInfo };
