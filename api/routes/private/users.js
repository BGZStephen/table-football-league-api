const mongoose = require('mongoose');
const User = mongoose.model('User');

/**
 * @api {get} /users/:id Get one user
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.user} User object.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {Object} mongoose User object.
 */
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

/**
 * @api {put} /users/:id Update one user
 * @apiName GetAllUsers
 * @apiGroup User
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.user} User object.
 * @apiParam {req.body} Update parameters object.
 * @apiParam {req.body.firstName} first name to update.
 * @apiParam {req.body.lastName} last name to update.
 * @apiParam {req.body.email} email to update.
 * @apiParam {req.body.password} password to update.
 * @apiParam {req.body.username} username to update.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {Object} updated User object.
 */
async function updateOne(req, res) {
  const user = req.user;
  const updateFields = 'firstName lastName email password username position'.split(' ');

  Object.keys(req.body).forEach(function (key) {
    if(updateFields.indexOf(key) > -1) {
      user[key] = req.body[key];
    }
  })

  await user.save();
  res.json(user);
}

module.exports = {
  getOne,
  search,
  updateOne,
}
