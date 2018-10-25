const jwt = require('jsonwebtoken');
const config = require('api/config');
const mongoose = require('mongoose');

const User = mongoose.model('User')
const ObjectId = mongoose.Types.ObjectId;

async function validateUser(req, res, next) {
  try {
    const decoded = await jwt.verify(req.headers['x-access-token'], config.jwtSecret);

    if(!decoded.data.id) {
      return res.error({message: 'Invalid token', statusCode: 401});
    }
    
    req.context.userId = decoded.data.id;
    next();
  } catch (err) {
    return res.error({message: 'Unauthorized', statusCode: 403});
  }
}

async function loadUser(req, res, next) {
  const userId = req.context.userId;

  if (!userId) {
    return res.error({statusCode: 403, message: 'Unauthorized'})
  }

  const user = await User.findById(ObjectId(userId));

  if (!user) {
    return res.error({statusCode: 403, message: 'Unauthorized'})
  }

  req.context.user = user;

  next();
}

module.exports = {
  validateUser,
  loadUser
}