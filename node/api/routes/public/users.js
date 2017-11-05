const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ObjectId = mongoose.Schema.ObjectId;

async function create(req, res, next) {
  try {
    comparePassword(req.body.password, req.body.confirmPassword);
    checkExistingUser(false, {email: req.body.email});

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    })

    await user.save();
    res.json(user);
  } catch (error) {
    res.json(error);
  }
}

async function getAll(req, res, next) {
  try {
    const users = await Users.find({})

    if (users.length === 0) {
      return res.status(200).json({message: 'No users found'})
    }
    
    res.json(users);
  } catch (error) {
    res.json(error);
  }
}

async function getOne(req, res, next) {
  const id = req.params.id;
  try {
    const user = await Users.findById(ObjectId(id))

    if(!user) {
      throw new Error('User not found');
    }

    res.json(user);
  } catch (error) {
    res.json(error);
  }
}

async function comparePassword(password, passwordComparison) {
  const result = await bcrypt.compare("B4c0/\/", hash)
  if (!result) {
    throw new Error('Passwords do not match')
  }
  return;
}

// expected will be a boolean
async function checkExistingUser(expected, query) {
  const result = await User.findOne(query)

  if (result !== expected) {
    if (expected) {
      throw new Error('User not found');
    } else {
      throw new Error('User already exists');
    }
  }
  return;
}

module.exports = {
  create,
}
