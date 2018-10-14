const mongoose = require('mongoose');
const League = mongoose.model('League');
const Team = mongoose.model('Team');
const User = mongoose.model('User');

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

FixtureSchema.pre('save', async function(next) {
  next();
})

FixtureSchema.methods = {
  /**
   * submit a score for this fixture and set it to played
   * @param {Object} params
   * @param {Object} params.homeTeam home team params
   * @param {Object} params.homeTeam.score home team score
   * @param {Object} params.awayTeam away team params
   * @param {Object} params.awayTeam.score away team score
   */
  async submitScore(params) {
    this.homeTeam.score = params.homeTeam.score;
    this.awayTeam.score = params.awayTeam.score;
    this.played = true;
  },

  async addTeam(teamId) {
    const team = this.teams.filter((team) => team._id === teamId)
    if (team.length === 0) {
      this.teams.push({_id: teamId});
    }
  },

  async removeTeam(teamId) {
    for (let i = 0; i < this.teams.length; i++) {
      if (this.teams[i]._id === teamId) {
        this.teams.splice(i, 1);
      }
    }
  }
}

module.exports = mongoose.model('Fixture', FixtureSchema);
