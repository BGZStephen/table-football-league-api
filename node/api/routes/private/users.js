const mongoose = require('mongoose');
const winston = require('winston');
const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;

async function deleteOne(req, res) {
  const user = req.user;

  try {
    await user.remove();
    res.status(200).send();
  } catch (error) {
    winston.error(error);
    res.statusMessage = error;
    res.sendStatus(500);
  }
}

async function getAll(req, res, next) {
  try {
    const users = await User.find({})

    if (users.length === 0) {
      return res.status(200).json({message: 'No users found'})
    }

    res.json(users);
  } catch (error) {
    winston.error(error)
    res.statusMessage = error;
    res.sendStatus(500);
  }
}

async function getOne(req, res, next) {
  res.json(req.user);
}

function comparePassword(password, passwordComparison) {
  if (password !== passwordComparison) {
    throw new Error('Passwords do not match')
  }
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
    res.statusMessage = error;
    res.sendStatus(500);
  }
}

async function validateUser(req, res, next) {
  try {
    const decoded = jwt.verify(req.body.token, config.jwtSecret);
    if(!ObjectId(decoded._id).equals(ObjectId(req.params.id))) {
      res.statusMessage = 'Invalid token';
      return res.sendStatus(403);
    }
  } catch (err) {
    res.statusMessage = 'Invalid token';
    return res.sendStatus(500);
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
