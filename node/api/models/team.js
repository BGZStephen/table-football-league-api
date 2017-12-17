const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = Schema({
  createdOn: Date,
  name: String,
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

TeamSchema.methods = {
  async updatePlayers(params) {
    params.add.forEach(function (player) {
      if (this.players.indexOf(player) === -1) {
        this.players.push(player);
      }
    })

    params.remove.forEach(function (player) {
      if (this.players.indexOf(player) >= 0) {
        this.players.splice(this.players.indexOf(player), 1);
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
      this.goalsScored += params.goalsScored
    }

    if (params.goalsConceded) {
      this.goalsConceded += params.goalsConceded
    }

    await this.save()
    return;
  }
}

module.exports = mongoose.model('Team', TeamSchema);
