const cloudinary = require('cloudinary');

/**
 * upload a single file to cloudinary
 * @param {Object} file object captured by multer for upload.
 */
async function uploadOne(file) {
  const cloudinaryFile = await cloudinary.uploader.upload(file);
  return cloudinaryFile
}

module.exports = {
  uploadOne,
}
