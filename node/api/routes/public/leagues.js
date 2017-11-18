const mongoose = require('mongoose');
const errorHandler = require('../../services/error-handler');

const League = mongoose.model('League');
const ObjectId = mongoose.Types.ObjectId;

async function create(req, res) {
  try {
    if (!req.body.name) {
      return errorHandler.apiError(res, 'League name is required', 500);
    }

    const noDuplicateLeague = await duplicateLeagueCheck(req.body.name);
    if (!noDuplicateLeague) {
      errorHandler.apiError(res, 'League name already in use', 500);
    }

    const league = new League({
      createdOn: Date.now(),
      name: req.body.name,
      administrators: [req.body.userId],
    });

    await league.save();
    res.json(league);
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
}

async function getOne(req, res) {
  res.json(req.league);
}

async function getAll(req, res) {
  try {
    const leagues = await League.find({});
    res.json(leagues);
  } catch (error) {
    winston.error(error)
    res.sendStatus(500);
  }
}

async function duplicateLeagueCheck(leagueName) {
  const league = await League.findOne({name: leagueName});
  if (league) {
    return false;
  }
  return true;
}

module.exports = {
  create,
  getOne,
  getAll
}
