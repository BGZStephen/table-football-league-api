const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('api/config');
const validate = require('validate.js');

const User = mongoose.model('User');

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
 *
 * @apiSuccess {User, JWT} new User object + json web token.
 */
async function create(req, res) {
  const validatorErrors = validate(req.body, {
    email: {
      presence: {message() {return validate.format('Email address is required')}}
    },
    firstName: {
      presence: {message() {return validate.format('First name is required')}}
    },
    lastName: {
      presence: {message() {return validate.format('Last name is required')}}
    },
    password: {
      presence: {message() {return validate.format('Email address is required')}}
    }
  }, {format: "flat"})

  if (validatorErrors) {
    return res.error({message: validatorErrors, statusCode: 403});
  }

  const existingUser = await User.findOne({email: req.body.email})

  if (existingUser) {
    return res.error({message: 'Email address already in use', statusCode: 400});
  }

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  })

  await user.save();

  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365),
    data: {
      id: user._id,
    }
  }, config.jwtSecret);

  res.json({
    token: token,
    user: {
      _id: user._id,
    }
  });
}

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
async function authenticate(req, res) {
  const validatorErrors = validate(req.body, {
    email: {
      presence: {message() {return validate.format('Email address is required')}}
    },
    password: {
      presence: {message() {return validate.format('Email address is required')}}
    },
  }, {format: "flat"})

  if (validatorErrors) {
    return res.error({message: validatorErrors, statusCode: 403});
  }

  const user = await User.findOne({email: req.body.email});

  if (!user) {
    return res.error({message: 'Invalid email address or password', statusCode: 403});
  }

  if (!user.isPasswordValid(req.body.password)) {
    return res.error({message: 'Invalid email address or password', statusCode: 403});
  }

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
}

module.exports = {
  create,
  authenticate,
}
