const mongoose = require('mongoose');
const League = mongoose.model('League');
const { Router } = require('express');
const rest = require('api/utils/rest');

const router = Router();

async function create(req, res) {
  if (!req.body.name) {
    return res.error({message: 'League name is required', statusCode: 400});
  }

  const existingLeague = await League.findOne({name: req.body.name})

  if (existingLeague) {
    return res.error({message: 'A league with that name already exists', statusCode: 400})
  }

  if (req.body.teams.length < 3) {
    return res.error({message: 'A league requires a minimum of 3 teams', statusCode: 400})
  }

  if (!req.body.gamesPerSeason) {
    return res.error({message: 'Games Per Season is required', statusCode: 400})
  }

  const league = new League({
    createdBy: req.context.user._id,
    name: req.body.name,
    gamesPerSeason: req.body.gamesPerSeason,
    teams: req.body.teams,
  });

  await league.save();
  await league.generateFixtures();

  res.json(league);
}

async function getOne(req, res) {
  let populators = '';

  if (req.query.administrators) {
    populators = populators + 'administrators ';
  }

  if (req.query.teams) {
    populators = populators + 'teams ';
  }

  if (req.query.fixtures) {
    populators = populators + 'fixtures ';
  }

  if (populators) {
    await req.league.populate(populators).execPopulate();
  }

  res.json(req.league);
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
  const updateFields = 'name'.split(' ');
  const updateParams = {};

  Object.keys(req.body).forEach(function (key) {
    if(updateFields.indexOf(key)) {
      league[key] = req.body[key];
    }
  })

  if (req.body.administrators) {
    for (const userId of league.administrators) {
      if (req.body.administrators.indexOf(userId) === -1) {
        leage.removeAdministrator(userId);
      } else {
        leage.addAdministrator(userId);
      }
    }
  }

  if (req.body.teams) {
    for (const teamId of req.body.teams) {
      const team = await Team.findById(teamId)
      await team.addLeague(league._id).save();
    }
  }

  if (!req.body.teams) {
    await league.save();
  }

  res.json(league);
}

router.post('/', rest.asyncwrap(create));
router.get('/search', rest.asyncwrap(search));
// router.get('/leagues/:id', Leagues.getOne);
// router.put('/leagues/:id', Leagues.updateOne);

module.exports = router;
