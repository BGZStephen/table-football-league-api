const jwt = require('api/utils/jwt');
const mongoose = require('mongoose');
const config = require('api/config');
const validate = require('validate.js');
const mailer = require('api/services/mail');

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

  const token = await jwt.generateUserToken(user);

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

  const token = await jwt.generateUserToken(user);

  res.json({
    token: token,
    user: JSON.stringify({_id: user._id}),
  });
}

async function checkPasswordResetToken(req, res, next) {
  const token = req.query.token;
  if (!token || !token.match(/^([A-z]|[a-z]|[0-9]){20}$/)) {
    return res.error({message: 'Invalid password reset token', statusCode: 400});
  }

  const token = await mongoose.model('PasswordReset').findOne({token})

  if (!token) {
    return res.error({message: 'Invalid password reset token', statusCode: 400});
  }

  return res.statusCode(200).send();
}

async function createPasswordReset(req, res) {
  const email = req.body.email;

  if (!email) {
    return res.error({message: 'Email address is required', statusCode: 400});
  }

  const user = await User.findOne({email})

  if (!user) {
    return res.error({message: 'No account with this email exists', statusCode: 404});
  }

  const { createPasswordReset, generatePasswordResetUrl} = require('api/domain/user/password-reset');

  const passwordResetToken = await createPasswordReset(user._id);
  const passwordResetUrl = generatePasswordResetUrl(passwordResetToken);

  await mailer.passwordResetEmail({
    recipients: [email],
    data: {
      passwordResetUrl
    }
  })

  return res.statusCode(200).send();
}

module.exports = {
  create,
  authenticate,
  checkPasswordResetToken
}
