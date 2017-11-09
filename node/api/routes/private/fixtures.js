const winston = require('winston');
const mongoose = require('mongoose');
const Fixture = mongoose.model('Fixture');
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
}
