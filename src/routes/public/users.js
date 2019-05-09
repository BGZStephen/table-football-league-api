const jwt = require('../../utils/jwt');
const mongoose = require('mongoose');
const validate = require('validate.js');
const User = mongoose.model('User');
const {Router} = require('express');
const rest = require('../../utils/rest');

const router = Router();

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

  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  })

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



router.post('/', rest.asyncwrap(create));

module.exports = {
  router,
  __create: create,
}
