const mongoose = require('mongoose');
const League = mongoose.model('League');
const { Router } = require('express');
const rest = require('api/utils/rest');

const ObjectId = mongoose.Types.ObjectId;
const router = Router();

async function load(req, res, next) {
  const leagueId = req.body.id || req.params.id;

  if (!leagueId) {
    return res.error({statusCode: 400, message: 'LeagueID is required'})
  }

  const league = await League.findById(ObjectId(leagueId))

  if (!league) {
    return res.error({statusCode: 404, message: 'League not found'})
  }

  req.context.league = league;

  next();
}

async function create(req, res) {
  if (!req.body.name) {
    return res.error({message: 'League name is required', statusCode: 400});
  }

  const existingLeagueWithName = await League.findOne({name: req.body.name})

  if (existingLeagueWithName) {
    return res.error({message: 'A league with that name already exists', statusCode: 400})
  }

  if (req.body.teams.length < 3) {
    return res.error({message: 'A league requires a minimum of 3 teams', statusCode: 400})
  }

  if (!req.body.gamesPerSeason) {
    return res.error({message: 'Games Per Season is required', statusCode: 400})
  }

  const league = await League.create({
    createdBy: req.context.user._id,
    name: req.body.name,
    gamesPerSeason: req.body.gamesPerSeason,
    teams: req.body.teams,
  });

  await league.generateFixtures();

  res.json(league);
}

async function getOne(req, res) {
  const league = req.context.league;

  let populators = '';

  if (req.query.teams) {
    populators = populators + 'teams ';
  }

  if (populators) {
    await league.populate(populators).execPopulate();
  }

  res.json(league);
}

async function search(req, res) {
  const query = {}

  if (req.query.name) {
    query.name = req.query.name;
  }

  const leagues = await League.find(query)
  res.json(leagues);
}

async function updateOne(req, res) {
  const league = req.league;

  if (req.body.name) {
    const existingLeagueWithName = await League.findOne({name: req.body.name})

    if (existingLeagueWithName) {
      return res.error({message: 'A league with that name already exists', statusCode: 400})
    }

    league.name = name;
  }

  await league.save();

  res.json(league);
}

router.post('/', rest.asyncwrap(create));
router.get('/search', rest.asyncwrap(search));
router.all('/leagues/:id*', rest.asyncwrap(load));
router.get('/leagues/:id', rest.asyncwrap(getOne));
router.put('/leagues/:id', rest.asyncwrap(updateOne));

module.exports = {
  router,
  __getOne: getOne,
  __load: load,
  __create: create,
  __search: search,
  __updateOne: updateOne,
};
