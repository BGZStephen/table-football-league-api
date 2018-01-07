const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    for (const team of this.teams) {
      await this.addLeagueToTeam(team._id)
    }
  }
})

LeagueSchema.methods = {
  async addLeagueToTeam(teamId) {
    const team = await Team.findById(teamId)
    if (team && team.leagues.indexOf(this._id) === -1) {
      team.leagues.push(this._id);
      await team.save();
    }
  },

  async removeLeagueFromTeam(teamId) {
    const team = await Team.findById(teamId)
    const leagueIndex = team.leagues.indexOf(this._id);

    if (leagueIndex) {
      team.leagues.splice(leagueIndex, 1);
      await league.save();
    }
  },

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

  /**
   * get a team by passing an ID
   * @param {Object} params
   * @param {ObjectId} id team ID
   */
  async getTeamById(id) {
    this.teams.forEach(function (team) {
      if (team._id === id) {
        return team;
      }
    })
  },

  /**
   * update a leagues fixtures
   * @param {Object} params
   * @param {Object} params update params
   * @param {Array} params.add Array of fixture ID's to add
   * @param {Array} params.remove Array of fixture ID's to remove
   */
  async updateFixtures(params) {
    params.add.forEach(function (fixture) {
      if (this.fixtures.indexOf(fixture) === -1) {
        this.fixtures.push(fixture);
      }
    })

    params.remove.forEach(function (fixture) {
      if (this.fixtures.indexOf(fixture) >= 0) {
        this.fixtures.splice(this.fixtures.indexOf(fixture), 1);
      }
    })

    await this.save();
  },

  /**
   * update a leagues Administrators
   * @param {Object} params
   * @param {Object} params update params
   * @param {Array} params.add Array of User ID's to add
   * @param {Array} params.remove Array of User ID's to remove
   */
  async updateAdministrators(params) {
    params.add.forEach(function (administrator) {
      if (this.administrators.indexOf(administrator) === -1) {
        this.administrators.push(administrator);
      }
    })

    params.remove.forEach(function (administrator) {
      if (this.administrators.indexOf(administrator) >= 0) {
        this.administrators.splice(this.administrators.indexOf(administrator), 1);
      }
    })

    await this.save();
  },

  /**
   * update a leagues Teams
   * @param {Object} params
   * @param {Object} params update params
   * @param {Array} params.add Array of Team ID's to add
   * @param {Array} params.remove Array of Team ID's to remove
   */
  async updateTeams(params) {
    params.add.forEach(function (team) {
      if (this.teams.indexOf(team) === -1) {
        this.teams.push(team);
      }
    })

    params.remove.forEach(function (team) {
      if (this.teams.indexOf(team) >= 0) {
        this.teams.splice(this.teams.indexOf(team), 1);
      }
    })

    await this.save();
  },
}

module.exports = mongoose.model('League', LeagueSchema);
