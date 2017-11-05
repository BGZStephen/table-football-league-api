const bcrypt = require('bcryptjs');
const winston = require('winston');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ObjectId = mongoose.Schema.ObjectId;

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
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    })

    await user.save();
    res.json(user);
  } catch (error) {
    winston.error(error)
    res.status(500).json(error)
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
    res.status(500).json(error)
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
    res.status(500).json(error);
  }
}

async function comparePassword(password, passwordComparison) {
  if (password !== passwordComparison) {
    throw new Error('Passwords do not match')
  }
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
}

function validate(object, params) {
  const errorArray = [];
  Object.keys(params).forEach(function(param) {
    if(!object[param]) {
      errorArray.push(params[param])
    }
  })

  if(errorArray.length > 0) {
    throw new Error(errorArray)
  }
}

module.exports = {
  create,
}
