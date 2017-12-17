const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  email: {
    type: String,
    required: true,
  },
  username: String,
  password: String,
  createdOn: Date,
  profileImage: String,
  statistics: {
    wins: Number,
    losses: Number,
  },
  teams: [{type: Schema.ObjectId, ref: 'Team'}],
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}],
  leagues: [{type: Schema.ObjectId, ref: 'League'}],
})

UserSchema.methods = {
  async updateStatistics(params) {
    if (params.win) {
      this.statistics.wins += 1;
    }

    if (params.loss) {
      this.statistics.loss += 1;
    }

    await this.save();
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
  }
}

module.exports = mongoose.model('User', UserSchema);
