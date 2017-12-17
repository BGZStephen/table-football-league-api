const mongoose = require('mongoose');
const winston = require('winston');
const config = require('../../config');
const errorHandler = require('../../services/error-handler');
const validate = require('../../services/validate');

const User = mongoose.model('User');
const Team = mongoose.model('Team');
const ObjectId = mongoose.Types.ObjectId;

async function create(req, res) {
  try {
    validate(req.body, {
      name: 'Team name is required',
      players: 'At least one player is required',
    })

    await checkExistingTeam(null, {name: req.body.name});

    const team = new Team({
      name: req.body.name,
      players: req.body.players,
    })

    await team.save();
    res.json(team);
  } catch (error) {
    res.sendStatus(400);
  }
}

async function deleteOne(req, res) {
  const team = req.team;

  try {
    await team.remove();
    res.status(200).send();
  } catch (error) {
    winston.error(error);
    res.sendStatus(400);
  }
}

async function getAll(req, res, next) {
  try {
    const teams = await Team.find({})

    if (teams.length === 0) {
      return errorHandler.apiError(res, 'No teams found', 400);
    }

    res.json(teams);
  } catch (error) {
    winston.error(error)
    res.sendStatus(400);
  }
}

async function getOne(req, res) {
  res.json(req.team);
}

async function updateOne(req, res) {
  const team = req.team;
  const updateFields = 'name'.split(' ');
  const updateParams = {};

  try {

    if (req.body.players) {
      team.updatePlayers(req.body.players)
    }

    if (req.body.fixtures) {
      team.updateFixtures(req.body.fixtures)
    }

    if (req.body.leagues) {
      team.updateLeagues(req.body.leagues)
    }

    Object.keys(req.body).forEach(function (key) {
      if(updateFields.indexOf(key) > -1) {
        team[key] = req.body[key]
      }
    })

    await team.save();
    res.json(team);
  } catch (error) {
    winston.error(error);
    res.sendStatus(400);
  }
}

async function checkExistingTeam(expected, query) {
  const result = await Team.findOne(query)

  if (expected && result !== expected) {
    return errorHandler.apiError(res, 'User not found', 404);
  } else {
    return errorHandler.apiError(res, 'User already exists', 500);
  }
}

module.exports = {
  getOne,
  getAll,
  updateOne,
  deleteOne,
  validateUser,
  setProfileImage,
}
