const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const League = mongoose.model('League');

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
  leagueId: {type: Schema.ObjectId, ref: 'League'},
})

FixtureSchema.methods = {
  async submitScore(params) {
    this.homeTeam.score = params.homeTeam.score;
    this.awayTeam.score = params.awayTeam.score;
    this.played = true;

    if (this.league) {
      await this.submitLeagueScore(params)
    }

    await this.save();
  },

  async submitLeagueScore(params) {
    const league = await League.findById(this.leagueId);

    if (params.homeTeam.score > params.awayTeam.score) {
      await league.updateTeamStatistics({
        id: params.homeTeam._id,
        win: true,
        loss: false,
        goalsScored: params.homeTeam.score,
        goalsConceded: params.awayTeam.score,
      });

      await league.updateTeamStatistics({
        id: params.awayTeam._id,
        win: false,
        loss: true,
        goalsScored: params.awayTeam.score,
        goalsConceded: params.homeTeam.score,
      });
    } else {
      await league.updateTeamStatistics({
        id: params.awayTeam._id,
        win: true,
        loss: false,
        goalsScored: params.awayTeam.score,
        goalsConceded: params.homeTeam.score,
      });

      await league.updateTeamStatistics({
        id: params.homeTeam._id,
        win: false,
        loss: true,
        goalsScored: params.homeTeam.score,
        goalsConceded: params.awayTeam.score,
      });
    }
  }
}

module.exports = mongoose.model('Fixture', FixtureSchema);
