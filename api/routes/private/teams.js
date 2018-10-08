const mongoose = require('mongoose');
const AsyncWrap = require('../../utils/async-wrapper');

const User = mongoose.model('User');
const Team = mongoose.model('Team');
const ObjectId = mongoose.Types.ObjectId;

/**
 * @api {post} /teams create a new Team
 * @apiName CreateTeam
 * @apiGroup Team
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.body} team parameters object object.
 * @apiParam {req.body.name} new Team name.
 * @apiParam {req.body.players} Array of player ID's to form the team.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} new Team object.
 */
const create = AsyncWrap(async function (req, res) {
  // validate(req.body, {
  //   name: {message: 'Team name is required', type: 'string'},
  //   users: {message: 'At least one player is required', type: 'array'}
  // })

  if (await teamAlreadyExists({name: req.body.name})) {
    return res.error({message: 'A team with that name already exists', statusCode: 400});
  }

  const users = await checkUsersExist(req.body.users);

  const team = new Team({
    name: req.body.name
  })

  const updatedTeam = await team.addUsers(users);
  await updatedTeam.save()
  res.json(team);
})

/**
 * @api {get} /teams/:id get a team
 * @apiName GetOne
 * @apiGroup Team
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.team} Team onject fetched by middleware
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} Team object.
 */
const getOne = AsyncWrap(async function (req, res) {
  let populators = '';

  if (req.query.users) {
    populators = populators + 'users ';
  }

  if (req.query.leagues) {
    populators = populators + 'leagues ';
  }

  if (req.query.fixtures) {
    populators = populators + 'fixtures ';
  }

  if (populators) {
    await req.team.populate(populators).execPopulate();
  }

  res.json(req.team);
})

const search = AsyncWrap(async function (req, res) {
  if (!req.query.name) {
    return res.error({message: 'Please provide a name to search with', statusCode: 400});
  }

  const searchRegexp = new RegExp(req.query.name, 'i');

  const teams = await Team.find({
    name: searchRegexp,
  })

  res.json(teams);
})

/**
 * @api {put} /teams/:id update a team
 * @apiName UpdateOne
 * @apiGroup Team
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.team} Team onject fetched by middleware
 * @apiParam {req.body} Team update params object.
 * @apiParam {req.body.name} updated Team name.
 * @apiParam {req.body.players} players params object.
 * @apiParam {req.body.players.add} array of players to add.
 * @apiParam {req.body.players.remove} array of players to remove.
 * @apiParam {req.body.fixtures} fixtures params object.
 * @apiParam {req.body.fixtures.add} array of fixtures to add.
 * @apiParam {req.body.fixtures.remove} array of fixtures to remove.
 * @apiParam {req.body.leagues} leagues params object.
 * @apiParam {req.body.leagues.add} array of leagues to add.
 * @apiParam {req.body.leagues.remove} array of leagues to remove.
 * @apiParam {res} Express response object object.
 *
 * @apiSuccess {object} updated Team object.
 */
const updateOne = AsyncWrap(async function (req, res) {
  const team = req.team;
  const updateFields = 'name'.split(' ');

  Object.keys(req.body).forEach(function (key) {
    if(updateFields.indexOf(key) > -1) {
      team[key] = req.body[key];
    }
  });

  await team.save();
  res.json(team);
})

async function teamAlreadyExists(query) {
  return await Team.findOne(query) ? true : false;
}

/**
 * check that an array of userId's corresponds to valid users. If users exist, return them.
 * @param {Array} users array of users
 * @param {String} errorMessage error message to show if check fails
 */
async function checkUsersExist(users, errorMessage) {
  const validUsers = []
  for (const user of users) {
    const validUser = await User.findOne(ObjectId(user._id))
    if (!validUser) {
      return res.error({message: `${errorMessage} Player not found.`, statusCode: 400});
    } else {
      validUsers.push(validUser);
    }
  }

  return validUsers;
}

module.exports = {
  create,
  getOne,
  updateOne,
  search,
}
