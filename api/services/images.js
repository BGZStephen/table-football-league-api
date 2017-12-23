const cloudinary = require('cloudinary');
const winston = require('winston');
const errorHandler = require

/**
 * upload a single file to cloudinary
 * @param {Object} file object captured by multer for upload.
 */
async function uploadOne(file) {
  try {
    const cloudinaryFile = await cloudinary.uploader.upload(file);
    return cloudinaryFile
  } catch(error) {
    winston.error(error)
    throw new Error(error);
  }
}

module.exports = {
  uploadOne,
}
