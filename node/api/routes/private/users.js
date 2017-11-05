async function deleteOne() {
  try {
    User.findById(ObjectId(req.params.id)).remove();
    res.sendstatus(200);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function updateOne() {
  const updateFields = 'firstName lastName email password'.split(' ');
  const updateParams = {};

  try {
    Object.keys(req.body).forEach(function (key) {
      if(updateFields.indexOf(key) {
        updateParams[key] = req.body[key]
      })
    })

    await User.update({_id: ObjectId(req.params.id)}, updateParams);
    const user = await User.findById(ObjectId(req.params.id));
    res.json(user);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function validateUser(req, res, next) {
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

module.exports = {
  updateOne,
  deleteOne,
  validateUser,
}
