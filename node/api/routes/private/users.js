const mongoose = require('mongoose');
const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;

async function deleteOne(req, res) {
  try {
    User.findById(ObjectId(req.params.id)).remove();
    res.sendstatus(200);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function updateOne(req, res) {
  const updateFields = 'firstName lastName email password'.split(' ');
  const updateParams = {};

  try {
    Object.keys(req.body).forEach(function (key) {
      if(updateFields.indexOf(key)) {
        updateParams[key] = req.body[key]
      }
    })

    if(updateParams.password) {
      updateParams.password = createHash(req.body.password);
    }

    await User.update({_id: ObjectId(req.params.id)}, updateParams);
    const user = await User.findById(ObjectId(req.params.id));
    res.json(user);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function validateUser(req, res, next) {
  try {
    const decoded = jwt.verify(req.body.token, config.jwtSecret);
    if(!ObjectId(decoded._id).equals(ObjectId(req.params.id))) {
      res.status(403).json({message: 'Invalid token'});
    }
  } catch(err) {
    res.status(500).json({message: 'Invalid token'});
  }

  next();
}

async function fetchUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if(!user) {
      res.status(404).json('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json(error);
  }
}

function createHash(string) {
  return bcrypt.hashSync(string, 8)
}

module.exports = {
  updateOne,
  deleteOne,
  validateUser,
  fetchUser,
}
