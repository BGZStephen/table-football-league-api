const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const images = require('../../services/images');
const AsyncWrap = require('../../utils/async-wrapper');

const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;

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
const getOne = AsyncWrap(async function (req, res) {
  let populators = '';

  if (req.query.teams) {
    populators += 'teams ';
  }

  if (req.query.leagues) {
    populators += 'leagues ';
  }

  if (req.query.fixtures) {
    populators += 'fixtures ';
  }

  if (populators) {
    await req.user.populate(populators).execPopulate();
  }

  res.json(req.user);
})

const getByEmail = AsyncWrap(async function (req, res, next) {
  const query = req.body;
  const user = await User.findOne({email: req.body.email})

  if (!user) {
    return res.error({message: 'User not found', statusCode: 404})
  }

  res.json(user);
})

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
const updateOne = AsyncWrap(async function (req, res) {
  const user = req.user;
  const updateFields = 'firstName lastName email password username'.split(' ');

  Object.keys(req.body).forEach(function (key) {
    if(updateFields.indexOf(key) > -1) {
      user[key] = req.body[key];
    }
  })

  await user.save();
  res.json(user);
})

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
const setProfileImage = AsyncWrap(async function (req, res) {
  const user = req.user;
  const cloudinaryImage = await images.uploadOne(req.file.path);

  if (!cloudinaryImage) {
    return res.error({message: 'Something went wrong uploading your image', statusCode: 500});
  }

  user.profileImageUrl = cloudinaryImage.url;
  await user.save();
  res.json(user);
})

/**
 * @api {all} /users/:id decode & validate a user JWT
 * @apiName ValidateUser
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
const validateUser = AsyncWrap(async function validateUser(req, res, next) {
  const decoded = await jwt.verify(req.headers.token, config.jwtSecret);
  if(!ObjectId(decoded.data.id).equals(ObjectId(req.params.id))) {
    return res.error({message: 'Invalid token', statusCode: 401});
  }
  next();
})

module.exports = {
  getByEmail,
  getOne,
  setProfileImage,
  updateOne,
  validateUser,
}
