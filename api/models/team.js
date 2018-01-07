const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = Schema({
  createdOn: {type: Date, default: () => new Date()},
  name: {type: String, unique: true},
  statistics: {
    wins: Number,
    losses: Number,
    goalsScored: Number,
    goalsConceded: Number,
  },
  users: [{type: Schema.ObjectId, ref: 'User'}],
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}],
  leagues: [{type: Schema.ObjectId, ref: 'League'}],
})

TeamSchema.pre('save', async function(next) {
  next();
})

TeamSchema.methods = {
  async addTeamToLeague(leagueId) {
    const league = await League.findById(leagueId)

    if (league) {
      await league.addTeam(this._id);
      await league.save();
    }

    await this.users.populate();
    for (const user of users) {
      await user.addLeague(leagueId);
      await user.save();
    }
  },

  async removeTeamFromLeague(leagueId) {
    const league = await League.findById(leagueId);

    if (user) {
      await league.removeTeam(this._id);
      await league.save();
    }

    await this.users.populate();
    for (const user of users) {
      await user.removeLeague(leagueId);
      await user.save();
    }
  },

  addUser(userId) {
    const userIndex = this.teams.indexOf(teamId)
    if (teamIndex === -1) {
      this.teams.push(teamId);
    }
  },

  removeUser(userId) {
    const userIndex = this.teams.indexOf(teamId)
    if (teamIndex >= 0) {
      this.teams.splice(userIndex, 1);
    }
  },

  async addTeamToFixture(fixtureId) {
    const fixture = await Fixture.findById(fixtureId)

    if (fixture) {
      await fixture.addTeam(this._id);
      await fixture.save();
    }

    await this.users.populate();
    for (const user of users) {
      await user.addFixture(fixtureId);
      await user.save();
    }
  },

  async removeTeamFromFixture(fixtureId) {
    const fixture = await Fixture.findById(fixtureId);

    if (fixture) {
      await fixture.removeTeam(this._id);
      await fixture.save();
    }

    await this.users.populate();
    for (const user of users) {
      await user.removeFixture(fixtureId);
      await user.save();
    }
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

  async updateLeagues(params) {
    params.add.forEach(function (league) {
      if (this.leagues.indexOf(league) === -1) {
        this.leagues.push(league);
      }
    })

    params.remove.forEach(function (league) {
      if (this.leagues.indexOf(league) >= 0) {
        this.leagues.splice(this.leagues.indexOf(league), 1);
      }
    })

    await this.save();
  },

  async updateStatistics(params) {
    if (params.win) {
      this.statistics.wins += 1;
    }

    if (params.loss) {
      this.statistics.wins += 1;
    }

    if (params.goalsScored) {
      this.goalsScored += params.goalsScored;
    }

    if (params.goalsConceded) {
      this.goalsConceded += params.goalsConceded;
    }

    await this.save();
  }
}

module.exports = mongoose.model('Team', TeamSchema);
