const mongoose = require('mongoose');
const League = mongoose.model('League');
const ObjectId = mongoose.Types.ObjectId;

async function create(req, res) {
  try {
    if (!req.body.name) {
      return res.status(500).json({message: 'League name is required'});
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
    res.status(500).json(error);
  }
}

async function getOne(req, res) {
  if(!req.league) {
    return res.status(404).json({message: 'League not found'});
  }
  res.json(req.league);
}

async function getAll(req, res) {
  try {
    const leagues = await League.find({});
    res.json(leagues);
  } catch (error) {
    winston.error(error)
    res.status(500).json(error);
  }
}

async function fetchLeague(req, res, next) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(500).json({message: 'League ID is required'});
    }

    if (!/[A-Fa-f0-9]{24}/g.test(id)) {
      return res.status(500).json({message: 'Invalid League Id'});
    }

    const league = await League.findById(ObjectId(id));
    if (!league) {
      return res.status(404).json({message: 'League not found'});
    }

    req.league = league;
    next();
  } catch (error) {
    winston.error(error);
    res.status(500).json(error);
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
