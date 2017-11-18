const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const config = require('../../config');
const errorHandler = require('../../services/error-handler');

const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;

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

async function getAll(req, res, next) {
  try {
    const users = await User.find({})

    if (users.length === 0) {
      return errorHandler.apiError(res, 'No users found', 404);
    }

    res.json(users);
  } catch (error) {
    winston.error(error)
    res.sendStatus(500);
  }
}

async function getOne(req, res, next) {
  res.json(req.user);
}

async function updateOne(req, res) {
  const user = req.user;
  const updateFields = 'firstName lastName email password username'.split(' ');
  const updateParams = {};

  try {
    Object.keys(req.body).forEach(function (key) {
      if(updateFields.indexOf(key)) {
        user[key] = req.body[key]
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

async function validateUser(req, res, next) {
  const decoded = await jwt.verify(req.headers.token, config.jwtSecret);
  if(!ObjectId(decoded.data.id).equals(ObjectId(req.params.id))) {
    return errorHandler.apiError(res, 'Invalid token', 401);
  }
  next();
}

function createHash(string) {
  return bcrypt.hashSync(string, 8)
}

module.exports = {
  getOne,
  getAll,
  updateOne,
  deleteOne,
  validateUser,
}
