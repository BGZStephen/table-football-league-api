const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FixtureSchema = Schema({
  createdOn: Date,
  fixtureDate: Date,
  teams: {
    home: {type: Schema.ObjectId, ref: 'Team'},
    away: {type: Schema.ObjectId, ref: 'Team'},
  },
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
  type: String,
  league: {type: Schema.ObjectId, ref: 'League'},
})

FixtureSchema.methods = {
  async submitScore(params) {
    this.score.homeTeam = params.score.homeTeam;
    this.score.awayTeam = params.score.awayTeam;
    this.played = true;

    await this.save();
  }
}

module.exports = mongoose.model('Fixture', FixtureSchema);
