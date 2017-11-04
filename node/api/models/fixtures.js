const mongoose = require('mongoose');

const FixtureSchema = mongoose.Schema({
  createdOn: Date,
  fixtureDate: Date,
  teams: {
    one: {type: Schema.ObjectId, ref: 'Team'},
    two: {type: Schema.ObjectId, ref: 'Team'}
  }
  score: {
    teamOne: Number,
    teamTwo: Number
  }
  type: String,
  league: {type: Schema.ObjectId, ref: 'League'}
})

module.exports = mongoose.model('Fixture', FixtureSchema);
