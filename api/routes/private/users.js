const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const errorHandler = require('../../services/error-handler');
const images = require('../../services/images');
const AsyncWrap = require('../../utils/async-wrapper');

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
const deleteOne = AsyncWrap(async function (req, res, next) {
  const user = req.user;
  await user.remove();
  res.status(200).send();
})

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
  res.json(req.user);
})

const getByEmail = AsyncWrap(async function (req, res, next) {
  const query = req.body;
  const user = await User.findOne({email: req.body.email})

  if (!user) {
    errorHandler.apiError({message: 'User not found', statusCode: 404})
  }

  res.json(user);
})

const getTeams = AsyncWrap(async function (req, res) {
  const teams = await req.user.getTeams();

  res.json(teams);
})

const getFixtures = AsyncWrap(async function (req, res) {
  const fixtures = await req.user.getFixtures();

  res.json(fixtures);
})

const getLeagues = AsyncWrap(async function (req, res) {
  const leagues = await req.user.getLeagues();

  res.json(leagues);
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
  const updateParams = {};

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
  if (!profileImageUrl) {
    return errorHandler.apiError({message: 'Something went wrong uploading your image', statusCode: 500});
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
    return errorHandler.apiError({message: 'Invalid token', statusCode: 401});
  }
  next();
})

module.exports = {
  deleteOne,
  getByEmail,
  getOne,
  getLeagues,
  getFixtures,
  getTeams,
  setProfileImage,
  updateOne,
  validateUser,
}
