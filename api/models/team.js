const mongoose = require('mongoose');
const Fixture = mongoose.model('League')
const League = mongoose.model('League')
const User = mongoose.model('User')

const ObjectId = mongoose.Types.ObjectId;
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
  async addUser(userId) {
    const userIndex = this.users.indexOf(userId)
    if (userIndex === -1) {
      this.users.push(userId);
      await this.save();
    }
  },

  async removeUser(userId) {
    const userIndex = this.users.indexOf(userId)
    if (userIndex >= 0) {
      this.users.splice(userIndex, 1);
      await this.save();
    }
  },

  async addLeague(leagueId) {
    const leagueIndex = this.leagues.indexOf(leagueId)
    if (leagueIndex === -1) {
      this.leagues.push(leagueId);
      await this.save();
    }
  },

  async removeLeague(leagueId) {
    const leagueIndex = this.leagues.indexOf(leagueId)
    if (leagueIndex >= 0) {
      this.leagues.splice(leagueIndex, 1);
      await this.save();
    }
  },

  async addFixture(fixtureId) {
    const fixtureIndex = this.fixtures.indexOf(fixtureId)
    if (fixtureIndex === -1) {
      this.leagues.push(fixtureId);
      await this.save();
    }
  },

  async removeFixture(fixtureId) {
    const fixtureIndex = this.fixtures.indexOf(fixtureId)
    if (fixtureIndex >= 0) {
      this.fixtures.splice(fixtureIndex, 1);
      await this.save();
    }
  },

  addWin() {
    this.statistics.wins += 1;
  },

  addLoss() {
    this.statistics.losses += 1;
  },

  updateGoalsScored(goals) {
    this.goalsScored += goals
  },

  updateGoalsConceded(goals) {
    this.goalsConceded += params.goalsConceded;
  },
}

module.exports = mongoose.model('Team', TeamSchema);
