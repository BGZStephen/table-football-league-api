const mongoose = require('mongoose');
const League = mongoose.model('League');
const ObjectId = mongoose.Types.ObjectId;

async function create(req, res) {
  try {
    const league = new League({
      createdOn: Date.now(),
      name: req.body.name,
      administrators: [req.body.userId],
    });

    await league.save();
    res.json(league);
  } catch (error) {
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
    res.status(500).json(error);
  }
}

async function fetchLeague(req, res, next) {
  const id = req.params.id;
  if (!id) {
    return res.status(500).json({message: 'League ID is required'});
  }

  const league = await League.findById(ObjectId(id));
  if (!league) {
    return res.status(404).json({message: 'League not found'});
  }

  req.league = league;
  next();
}

module.exports = {
  create,
  fetchLeague,
  getOne,
  getAll
}
