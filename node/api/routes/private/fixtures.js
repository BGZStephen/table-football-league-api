const validate = require('../../services/validate')
const winston = require('winston');
const mongoose = require('mongoose');
const Fixture = mongoose.model('Fixture');
const ObjectId = mongoose.Types.ObjectId;

async function create(req, res, next) {
  try {
    validate(req.body, {
      fixtureDate: 'A date is required for the fixture',
      teams: 'Teams are required'
      type: 'Fixture type is required',
    })

    const fixture = new Fixture({
      createdOn: Date.now(),
      fixtureDate: req.body.fixtureDate,
      teams: req.body.teams,
      type: req.body.type,
    })

    await fixture.save();
    res.json(fixture);
  } catch (error) {
    winston.error(error)
    res.status(500).json(error)
  }
}
