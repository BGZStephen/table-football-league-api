const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const config = require('../../config');
const errorHandler = require('../../services/error-handler');
const images = require('../../services/images');

const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;

/**
 * @api {delete} /users/:id Delete a User
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.user} User object
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {StatusCode} 200.
 */
async function deleteOne(req, res) {
  const user = req.user;

  try {
    await user.remove();
    res.status(200).send();
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
}


/**
 * @api {get} /users Get all users
 * @apiName GetAllUsers
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {Object} mongoose Users object.
 */
async function getAll(req, res, next) {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return errorHandler.apiError(res, 'No users found', 404);
    }

    res.json(users);
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
}

/**
 * @api {get} /users/:id Get one user
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.user} User object.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {Object} mongoose User object.
 */
async function getOne(req, res) {
  res.json(req.user);
}

/**
 * @api {put} /users/:id Update one user
 * @apiName GetAllUsers
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.user} User object.
 * @apiParam {req.body} Update parameters object.
 * @apiParam {req.body.firstName} first name to update.
 * @apiParam {req.body.lastName} last name to update.
 * @apiParam {req.body.email} email to update.
 * @apiParam {req.body.password} password to update.
 * @apiParam {req.body.username} username to update.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {Object} updated User object.
 */
async function updateOne(req, res) {
  const user = req.user;
  const updateFields = 'firstName lastName email password username'.split(' ');
  const updateParams = {};

  try {
    Object.keys(req.body).forEach(function (key) {
      if(updateFields.indexOf(key) > -1) {
        user[key] = req.body[key];
      }
    })

    if(updateParams.password) {
      user.password = createHash(req.body.password);
    }

    await user.save();
    res.json(user);
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
}

/**
 * @api {post} /users/:id/profile-image Set a users profile image
 * @apiName SetProfileImage
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.user} User object.
 * @apiParam {req.file} Image file uploaded & caught by Multer.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {Object} updated User object.
 */
async function setProfileImage(req, res) {
  try {
    const user = req.user;
    const cloudinaryImage = await images.uploadOne(req.file.path);
    if (!profileImageUrl) {
      return errorHandler.apiError(res, 'Something went wrong uploading your image', 500);
    }
    user.profileImageUrl = cloudinaryImage.url;
    await user.save();
    res.json(user);
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
}

/**
 * @api {all} /users/:id decode & validate a user JWT
 * @apiName SetProfileImage
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.user} User object.
 * @apiParam {req.headers} Submitted http headers
 * @apiParam {req.headers.token} json web token to decode
 * @apiParam {res} Express response object object.
 * @apiParam {next} Express middleware progression callback.
 *
 * @apiSuccess {next} continue to next middleware.
 */
async function validateUser(req, res, next) {
  const decoded = await jwt.verify(req.headers.token, config.jwtSecret);
  if(!ObjectId(decoded.data.id).equals(ObjectId(req.params.id))) {
    return errorHandler.apiError(res, 'Invalid token', 401);
  }
  next();
}

/**
 * Return a hash of a string
 * @param {String} string
 */
function createHash(string) {
  return bcrypt.hashSync(string, 8);
}

module.exports = {
  getOne,
  getAll,
  updateOne,
  deleteOne,
  validateUser,
  setProfileImage,
}
