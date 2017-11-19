const cloudinary = require('cloudinary');
const winston = require('winston');

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
