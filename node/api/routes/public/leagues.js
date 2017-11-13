const mongoose = require('mongoose');
const League = mongoose.model('League');
const ObjectId = mongoose.Types.ObjectId;

async function create(req, res) {
  try {
    if (!req.body.name) {
      throw new Error ('League name is required');
    }

    await duplicateLeagueCheck(req.body.name);

    const league = new League({
      createdOn: Date.now(),
      name: req.body.name,
      administrators: [req.body.userId],
    });

    await league.save();
    res.json(league);
  } catch (error) {
    winston.error(error);
    res.statusMessage = error;
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
    res.statusMessage = error;
    res.sendStatus(500);
  }
}

async function duplicateLeagueCheck(leagueName) {
  const league = await League.findOne({name: leagueName});
  if (league) {
    throw new Error('League name already in use');
  }
}

module.exports = {
  create,
  getOne,
  getAll
}
