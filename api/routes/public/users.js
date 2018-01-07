const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const winston = require('winston');
const config = require('../../config');
const mailer = require('../../services/mailer');
const errorHandler = require('../../services/error-handler');
const validate = require('../../services/validate');
const AsyncWrap = require('../../utils/async-wrapper');

const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;

/**
 * @api {post} /users Create a User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.body}
 * @apiParam {req.body.firstName} user first name
 * @apiParam {req.body.lastName} user last name
 * @apiParam {req.body.email} user email
 * @apiParam {req.body.password} user password
 * @apiParam {req.body.confirmPassword} password to check with
 *
 * @apiSuccess {User, JWT} new User object + json web token.
 */
const create = AsyncWrap(async function create(req, res) {
  validate(req.body, {
    firstName: {message: 'First name is required', type: 'string'},
    email: {message: 'Email address is required', type: 'string'},
    password: {message: 'Password is required', type: 'string'},
    confirmPassword: {message: 'Please re-enter your password', type: 'string'},
  })

  if (await userAlreadyExists({email: req.body.email})) {
    return errorHandler.apiError(res, 'Email address already in use', 400);
  };

  if (await userAlreadyExists({username: req.body.username})) {
    return errorHandler.apiError(res, 'Username already in use', 400);
  };

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: createHash(req.body.password),
  })

  await user.save();

  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365),
    data: {
      id: user._id,
    }
  }, config.jwtSecret);

  await mailer.welcomeEmail(user)
  res.json({
    token: token,
    user: {
      _id: user._id,
    }
  });
})

/**
 * @api {post} /users/authenticate authenticate a user
 * @apiName AuthenticateUser
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.body}
 * @apiParam {req.body.email} user email
 * @apiParam {req.body.password} entered password to compare against stored password
 *
 * @apiSuccess {User, JWT} User object + json web token.
 */
async function authenticate(req, res, next) {
  try {
    validate(req.body, {
      email: {message: 'Email address is required', type: 'string'},
      password: {message: 'Password is required', type: 'string'},
    })

    const user = await User.findOne({email: req.body.email});

    if (!user) {
      return errorHandler.apiError(res, 'User not found', 404);
    }

    // user.validatePassword(req.body.password);

    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365),
      data: {
        id: user._id,
      }
    }, config.jwtSecret);

    res.json({
      token: token,
      user: JSON.stringify({_id: user._id}),
    });
  } catch (error) {
    res.sendStatus(500);
  }
}

/**
 * Chexk existance of a user against an expected result
 * @param {Boolean} expected expected outcome
 * @param {Object} query an object representing a mongoose query to use for existance checking
 */
async function userAlreadyExists(query) {
  const user = await User.findOne(query);

  if (user) {
    return true;
  }
  return false;
}

module.exports = {
  create,
  authenticate,
}
