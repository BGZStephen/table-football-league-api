const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../../config');
const mailer = require('../../services/mailer');
const errorHandler = require('../../services/error-handler');
const validate = require('../../services/validate');
const AsyncWrap = require('../../utils/async-wrapper');

const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;

/**
 * @api {post} /admin/users/authenticate authenticate an admin user
 * @apiName AuthenticateAdminUser
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.body}
 * @apiParam {req.body.email} user email
 * @apiParam {req.body.password} entered password to compare against stored password
 *
 * @apiSuccess {User, JWT} User object + json web token.
 */
const authenticateAdminUser = AsyncWrap(async function (req, res) {
  validate(req.body, {
    email: {message: 'Email address is required', type: 'string'},
    password: {message: 'Password is required', type: 'string'},
  })

  const user = await User.findOne({email: req.body.email});

  if (!user) {
    return errorHandler.apiError({message: 'User not found', statusCode: 404});
  }

  compareHash(user.password, req.body.password);

  if (!user.admin) {
    return errorHandler.apiError({message: 'Unauthorized access', statusCode: 401});
  }

  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365),
    data: {
      id: user._id,
      admin: true,
    }
  }, config.jwtSecret);

  res.json({
    token: token,
    user: JSON.stringify({_id: user._id}),
  });
})

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
const deleteOne = AsyncWrap(async function (req, res) {
  await req.user.remove();
  res.status(200).send();
})

/**
 * @api {get} /admin/users Get all users
 * @apiName GetAllUsers
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {Object} mongoose Users object.
 */
const getAll = AsyncWrap(async function (req, res) {
  const users = await User.find({});
  res.json(users);
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

  if(updateParams.password) {
    user.password = createHash(req.body.password);
  }

  await user.save();
  res.json(user);
})

/**
 * Compare a hash with a string to check validity
 * @param {Hash} hash hash to check
 * @param {String} comparison string to validate hash with
 */
function compareHash(hash, comparison) {
  if (!bcrypt.compareSync(comparison, hash)) {
    return errorHandler.apiError({message: 'Incorrect password', statusCode: 403});
  }
}

module.exports = {
  authenticateAdminUser,
  getAll,
  getOne,
  updateOne,
  deleteOne,
}
