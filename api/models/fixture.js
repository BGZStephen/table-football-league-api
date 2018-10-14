const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FixtureSchema = Schema({
  createdOn: {type: Date, default: () => new Date()},
  date: Date,
  teams: [{type: Schema.ObjectId, ref: 'Team'}],
  score: {
    homeTeam: {
      type: Number,
      default: 0
    },
    awayTeam: {
      type: Number,
      default: 0
    },
  },
  played: {
    type: Boolean,
    default: false,
  },
  type: {type: String, default: 'friendly'},
  league: {type: Schema.ObjectId, ref: 'League'},
})

module.exports = mongoose.model('Fixture', FixtureSchema);
