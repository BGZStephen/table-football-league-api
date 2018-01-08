const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Team = mongoose.model('Team');

const LeagueSchema = Schema({
  createdOn: {type: Date, default: () => new Date()},
  name: {type: String, unique: true},
  administrators: [{type: Schema.ObjectId, ref: 'User'}],
  teams: [{
    _id: {
      type: Schema.ObjectId, ref: 'Team',
    },
    wins: Number,
    losees: Number,
    goalsScored: Number,
    goalsConceded: Number,
  }],
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}],
})

LeagueSchema.pre('save', async function(next) {
  if (this.isModified('teams')) {
    await this.populate('teams').execPopulate();

    for (const team of this.teams) {
      await team.addLeague(this._id);
      await team.save();
    }
  }

  next();
})

LeagueSchema.methods = {
  /**
   * updated a teams statistics in the league
   * @param {Object} params
   * @param {ObjectId} params._id team ID
   * @param {Boolean} params.win boolean depicting a win
   * @param {Boolean} params.loss boolean depicting a loss
   * @param {Number} params.goalsScored goals scored by team
   * @param {Number} params.goalsConceded goals conceded by team
   */
  async updateTeamStatistics(params) {
    const team = this.teams.filter((team) => team._id === params._id)[0];

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

  addFixture(fixtureId) {
    const fixtureIndex = this.fixtures.indexOf(fixture);
    if (fixtureIndex === -1) {
      this.fixtures.push(fixtureId);
    }
  },

  removeFixture(fixtureId) {
    const fixtureIndex = this.fixtures.indexOf(fixture);
    if (fixtureIndex >= 0) {
      this.fixtures.splice(fixtureIndex, 1);
    }
  },

  addAdministrator(userId) {
    const userIndex = this.administrators.indexOf(userId)
    if (userIndex === -1) {
      this.administrators.push(userId)
    }
  },

  removeAdministrator(userId) {
    const userIndex = this.administrators.indexOf(userId)
    if (userIndex >= 0) {
      this.administrators.splice(userIndex, 1)
    }
  },

  addTeam(teamId) {
    const team = this.teams.filter((team) => team._id === teamId)
    if (team.length === 0) {
      this.teams.push({_id: teamId});
    }
  },

  removeTeam(teamId) {
    for (let i = 0; i < this.teams.length; i++) {
      if (this.teams[i]._id === teamId) {
        this.teams.splice(i, 1);
      }
    }
  },
}

module.exports = mongoose.model('League', LeagueSchema);
