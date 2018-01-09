const mongoose = require('mongoose');
const League = mongoose.model('League');
const Team = mongoose.model('Team');
const User = mongoose.model('User');

const Schema = mongoose.Schema;

const FixtureSchema = Schema({
  createdOn: {type: Date, default: () => new Date()},
  fixtureDate: Date,
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
  type: String,
  leagueId: {type: Schema.ObjectId, ref: 'League'},
})

FixtureSchema.pre('save', async function(next) {
  if (this.isModified('teams')) {
    const teams = this.populate('teams').execPopulate();

    for (const team of this.teams) {
      const teamUpdates = team.addFixture(this._id);
      await teamUpdates.save();
    }
  }

  if (this.leagueId && this.isModified('leagueId')) {
    const league = await this.populate('leagueId').execPopulate();
    await league.addFixture(this._id);
    await league.save();
  }

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

    if (this.type === 'league') {
      await this.submitLeagueScore(params)
    }

    await this.save();
  },

  /**
   * submit a fixture score to it's league
   * @param {Object} params
   * @param {Object} params.homeTeam home team params
   * @param {Object} params.homeTeam.score home team score
   * @param {Object} params.awayTeam away team params
   * @param {Object} params.awayTeam.score away team score
   */
  async submitLeagueScore(params) {
    const league = await League.findById(this.leagueId);

    await league.updateTeamStatistics({
      id: params.homeTeam._id,
      win: params.homeTeam.score > params.awaytTeam.score ? true : false,
      loss: params.homeTeam.score < params.awaytTeam.score ? true : false,
      goalsScored: params.homeTeam.score,
      goalsConceded: params.awayTeam.score,
    });

    await league.updateTeamStatistics({
      id: params.awayTeam._id,
      win: params.homeTeam.score < params.awaytTeam.score ? true : false,
      loss: params.homeTeam.score > params.awaytTeam.score ? true : false,
      goalsScored: params.awayTeam.score,
      goalsConceded: params.homeTeam.score,
    });
  }
}

module.exports = mongoose.model('Fixture', FixtureSchema);
