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
  players: [{type: Schema.ObjectId, ref: 'User'}],
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}],
  leagues: [{type: Schema.ObjectId, ref: 'League'}],
})

TeamScheme.pre('save', function(next) {
  if (this.isModified('players')) {
    for (const player of this.players) {
      this.addTeamToUser(player)
    }
  }
  next();
})

TeamSchema.methods = {
  async addTeamToUser(userId) {
    const user = await User.findById(userId)
    user.teams.push(this._id);
    await user.save();
  },

  async removeTeamFromUser(userId) {
    const user = await User.findById(userId)
    const teamIndex = user.teams.indexOf(userId)

    if (teamIndex) {
      user.teams.splice(teamIndex, 1);
      await user.save();
    }
  }

  async updatePlayers(params) {
    params.add.forEach(function (userId) {
      if (this.players.indexOf(userId) === -1) {
        this.players.push(userId);
      }
    })

    params.remove.forEach(function (userId) {
      const userIndex = this.players.indexOf(userId)
      if (playerIndex >= 0) {
        this.removeTeamFromUser(userId)
        this.players.splice(userIndex, 1);
      }
    })

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
