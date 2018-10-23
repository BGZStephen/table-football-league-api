const mongoose = require('mongoose');
const User = mongoose.model('User');
const { Router } = require('express');
const rest = require('api/utils/rest');

const router = Router();

async function getOne(req, res) {
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

  if (populators) {
    await req.user.populate(populators).execPopulate();
  }

  res.json(req.user);
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

  Object.keys(req.body).forEach(function (key) {
    if(updateFields.indexOf(key) > -1) {
      user[key] = req.body[key];
    }
  })

  await user.save();
  res.json(user);
}

router.get('/search', rest.asyncwrap(search));
router.get('/:id', rest.asyncwrap(getOne));
router.put('/:id', rest.asyncwrap(updateOne));

module.exports = {
  router,
  // jest exports
  __updateOne: updateOne
};
