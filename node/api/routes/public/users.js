const bcrypt = require('bcryptjs');
const config = require('../../config');
const winston = require('winston');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;
const validate = require('../../services/validate');
const mailer = require('../../services/mailer');

async function create(req, res, next) {
  try {
    validate(req.body, {
      firstName: 'First name is required',
      email: 'Email address is required',
      password: 'Password is required',
      confirmPassword: 'Please re-enter your password',
    })

    comparePassword(req.body.password, req.body.confirmPassword);
    await checkExistingUser(null, {email: req.body.email});

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
  } catch (error) {
    winston.error(error)
    res.statusMessage = error;
    res.sendStatus(500);
  }
}

async function authenticate(req, res, next) {
  try {
    validate(req.body, {
      email: 'Email address is required',
      password: 'Password is required',
    })

    const user = await User.findOne({email: req.body.email})

    if (!user) {
      throw new Error('User not found');
    }

    compareHash(user.password, req.body.password)

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
    winston.error(error)
    res.statusMessage = error;
    res.sendStatus(500);
  }
}

async function checkExistingUser(expected, query) {
  const result = await User.findOne(query)

  if (result !== expected) {
    if (expected) {
      throw new Error('User not found');
    } else {
      throw new Error('User already exists');
    }
  }
}

function createHash(string) {
  return bcrypt.hashSync(string, 8)
}

function compareHash(hash, comparison) {
  if (!bcrypt.compareSync(comparison, hash)) {
    throw new Error('Incorrect password');
  }
}

module.exports = {
  create,
  authenticate,
}
