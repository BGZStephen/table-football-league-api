const bcrypt = require('bcryptjs');
const winston = require('winston');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;

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
      password: createHash(req.body.password),
    })

    await user.save();
    res.json(user);
  } catch (error) {
    winston.error(error)
    res.status(500).json(error)
  }
}

async function authenticate(req, res, next) {
  try {
    validate(req.body, {
      email: 'Email address is required',
      password: 'Password is required',
    })

    const user = Users.findOne({email: req.body.email})
    compareHash(user.password, req.body.password)

    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365),
      data: {
        id: user._id,
      }
    }, config.jwtSecret);

    res.json({token});
  } catch (error) {
    winston.error(error)
    res.status(500).json(error)
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
    res.status(500).json(error)
  }
}

async function getOne(req, res, next) {
  const id = req.params.id;
  try {
    if (!/[A-Fa-f0-9]{24}/g.test(id)) {
      throw new Error('Invalid User Id');
    }

    const user = await User.findById(ObjectId(id))

    if(!user) {
      return res.status(404).json({message: 'User not found'});
    }

    res.json(user);
  } catch (error) {
    winston.error(error)
    res.status(500).json(error);
  }
}

function comparePassword(password, passwordComparison) {
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
  getOne,
  getAll,
  authenticate,
}
