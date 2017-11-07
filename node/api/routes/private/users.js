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
    res.status(500).json(error);
  }
}

async function updateOne(req, res) {
  const user = req.user;
  const updateFields = 'firstName lastName email password'.split(' ');
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
    res.status(500).json(error);
  }
}

async function validateUser(req, res, next) {
  try {
    const decoded = jwt.verify(req.body.token, config.jwtSecret);
    if(!ObjectId(decoded._id).equals(ObjectId(req.params.id))) {
      return res.status(403).json({message: 'Invalid token'});
    }
  } catch(err) {
    return res.status(500).json({message: 'Invalid token'});
  }

  next();
}

function createHash(string) {
  return bcrypt.hashSync(string, 8)
}

module.exports = {
  updateOne,
  deleteOne,
  validateUser,
}
