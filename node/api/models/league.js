const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeagueSchema = Schema({
  createdOn: Date,
  name: {
    type: String,
    unique: true,
  },
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
  },

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
