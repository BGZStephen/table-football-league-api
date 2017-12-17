const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeagueSchema = Schema({
  createdOn: Date,
  name: {
    type: String,
    unique: true
  },
  administrators: [{type: Schema.ObjectId, ref: 'User'}],
  teams: [{
    _id: {
      type: Schema.ObjectId, ref: 'Team'
    },
    wins: Number,
    losees: Number,
    goalsScored: Number,
    goalsConceded: Number,
  }],
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}],
})

LeagueSchema.methods = {
  async updateTeamStatistics(params) {
    const team = this.getTeamById(params._id);
    if (params.win) {
      team.wins += 1;
    }

    if (params.loss) {
      team.losses += 1;
    }

    if (params.goalsScored) {
      team.goalsScored += params.goalsScored;
    }

    if (params.goalsConceded) {
      team.goalsConceded += params.goalsConceded;
    }

    await this.save();
  },

  async getTeamById(id) {
    this.teams.forEach(function (team) {
      if (team._id === id) {
        return team;
      }
    })
  }
}

module.exports = mongoose.model('League', LeagueSchema);
