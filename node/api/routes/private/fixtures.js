const validate = require('../../services/validate')
const winston = require('winston');
const mongoose = require('mongoose');
const Fixture = mongoose.model('Fixture');
const ObjectId = mongoose.Types.ObjectId;

async function create(req, res) {
  try {
    validate(req.body, {
      fixtureDate: 'A date is required for the fixture',
      teams: 'Teams are required',
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

async function getAll() {
  try {
    const fixtures = await Fixture.find({});
    res.json(fixtures);
  } catch (error) {
    winston.error(error);
    res.status(500).json(error);
  }
}

async function getOne() {
  const fixture = req.fixture;
  res.json(fixture);
}

async function deleteOne() {
  try {
    const fixture = req.fixture;
    await fixture.remove();
    res.status(200).send()
  } catch (error) {
    winston.error(error);
    res.status(500).json(error);
  }
}

async function updateOne(req, res) {
  const updateFields = 'score teams fixtureDate type'.split(' ');
  const updateParams = {};

  try {
    Object.keys(req.body).forEach(function (key) {
      if(updateFields.indexOf(key)) {
        updateParams[key] = req.body[key]
      }
    })

    await Fixture.update({_id: ObjectId(req.params.id)}, updateParams);
    const fixture = await Fixture.findById(ObjectId(req.params.id));
    res.json(fixture);
  } catch (error) {
    winston.error(error);
    res.status(500).json(error);
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  deleteOne,
  updateOne,
}
