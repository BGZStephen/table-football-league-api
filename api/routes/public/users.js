const jwt = require('api/utils/jwt');
const mongoose = require('mongoose');
const validate = require('validate.js');
const mailer = require('api/services/mail');
const User = mongoose.model('User');

async function create(req, res) {
  const validatorErrors = validate(req.body, {
    email: {presence: {message: 'Email address is required'}},
    firstName: {presence: {message: 'First name is required'}},
    lastName: {presence: {message: 'Last name is required'}},
    password: {presence: {message: 'Email address is required'}}
  }, {format: "flat"})

  if (validatorErrors) {
    return res.error({message: validatorErrors, statusCode: 403});
  }

  const existingUser = await User.findOne({email: req.body.email})

  if (existingUser) {
    return res.error({message: 'Email address already in use', statusCode: 400});
  }

  const user = User.create({
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

async function authenticate(req, res) {
  const validateConstraints = {
    email: {presence: {message: 'Email address is required'}},
    password: {presence: {message: 'Password is required'}},
  }

  const validatorErrors = validate(req.body, validateConstraints, {format: "flat"})

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

async function checkPasswordResetToken(req, res) {
  const token = req.query.token;

  if (!token) {
    return res.error({message: 'Invalid password reset token', statusCode: 400});
  }

  const passwordResetToken = await mongoose.model('PasswordReset').findOne({token});

  if (!passwordResetToken || passwordResetToken.expiry < Date.now()) {
    return res.error({message: 'Invalid password reset token', statusCode: 400});
  }

  res.sendStatus(200);
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

  const {createPasswordReset, generatePasswordResetUrl} = require('api/domain/user/password-reset');

  const passwordResetToken = await createPasswordReset(user);
  const passwordResetUrl = generatePasswordResetUrl(passwordResetToken);

  await mailer.passwordResetEmail({
    recipients: [email],
    passwordResetUrl
  })

  return res.sendStatus(200);
}

async function updateUserFromPasswordReset(req, res) {
  const validateConstraints = {
    email: {presence: {message: 'Email address is required'}},
    password: {presence: {message: 'Password is required'}},
    token: {presence: {message: 'Token is required'}},
  }

  const validatorErrors = validate(req.body, validateConstraints, {format: "flat"})

  if (validatorErrors) {
    return res.error({message: validatorErrors, statusCode: 403});
  }

  const user = await User.findOne({email: req.body.email});

  if (!user) {
    return res.error({message: 'User not found', statusCode: 404});
  }

  const passwordReset = await mongoose.model('PasswordReset').findOne({token: req.body.token})
  
  if (!passwordReset || passwordReset.email !== user.email || passwordReset.expiry < Date.now()) {
    return res.error({message: 'Unauthorized update', statusCode: 403});
  }

  user.password = req.body.password;

  await user.save();

  res.sendStatus(200);
}

module.exports = {
  create,
  authenticate,
  checkPasswordResetToken,
  createPasswordReset,
  updateUserFromPasswordReset,
}
