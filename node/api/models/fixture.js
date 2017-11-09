const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FixtureSchema = Schema({
  createdOn: Date,
  fixtureDate: Date,
  teams: {
    one: {type: Schema.ObjectId, ref: 'Team'},
    two: {type: Schema.ObjectId, ref: 'Team'},
  },
  score: {
    teamOne: {
      type: Number,
      default: 0
    },
    teamTwo: {
      type: Number,
      default: 0
    },
  },
  type: String,
  league: {type: Schema.ObjectId, ref: 'League'},
})

module.exports = mongoose.model('Fixture', FixtureSchema);
