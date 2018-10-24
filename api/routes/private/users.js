const { Router } = require('express');
const mongoose = require('mongoose');
const rest = require('api/utils/rest');
const _ = require('lodash');

const router = Router();
const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;

async function getOne(req, res) {
  const userId = req.params.id;

  if (!userId) {
    return res.error({message: 'UserID is required', statusCode: 400});
  }
  
  let populators = '';
  
  if (req.query.teams) {
    populators += 'teams ';
  }
  
  if (req.query.leagues) {
    populators += 'leagues ';
  }
  
  if (req.query.fixtures) {
    populators += 'fixtures ';
  }
  
  const user = await User.findById(ObjectId(userId))
  
  if (populators) {
    await user.populate(populators).execPopulate();
  }
  
  if (!user) {
    return res.error({message: 'User not found', statusCode: 404});
  }

  res.json(user);
}

async function search(req, res) {
  if (!req.query.q) {
    return res.error({message: 'Please enter an email address or name to search', statusCode: 400});
  }
  
  const searchRegexp = new RegExp(req.query.q, 'i');

  const users = await User.find({
    $or: [
      {name: searchRegexp},
      {email: searchRegexp}
    ]
  })

  res.json(users);
}

async function updateOne(req, res) {
  const user = req.context.user;
  const updateFields = ['firstName', 'lastName', 'email', 'password', 'username', 'position'];

  Object.assign(user, _.pick(req.body, updateFields))

  await user.save();
  res.json(user);
}

router.get('/search', rest.asyncwrap(search));
router.get('/:id', rest.asyncwrap(getOne));
router.put('/:id', rest.asyncwrap(updateOne));

module.exports = {
  router,
  // jest exports
  __getOne: getOne,
  __updateOne: updateOne,
  __search: search
};
