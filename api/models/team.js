const mongoose = require('mongoose');
const mongooseUtils = require('../utils/mongoose');
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
  fixtures: {type: [{type: Schema.ObjectId, ref: 'Fixture'}], default: []},
  leagues: [{type: Schema.ObjectId, ref: 'League'}],
})

TeamSchema.pre('save', async function(next) {
  next();
})

TeamSchema.methods = {
  async addUser(userId) {
    const userIndex = this.users.indexOf(userId)
    const currentDocs = [this]
    const updatedDocs = []
    if (userIndex === -1) {
      this.users.push(userId);
    }

    updatedDocuments.push(this);

    const user = await User.findById(ObjectId(userId));
    currentDocs.push(user);
    user.addTeam(this._id);
    updatedDocuments.push(user);

    return mongooseUtils.wrapUpdate({currentDocs, updatedDocs});
  },

  async addUsers(userIds) {
    userIds = userIds.filter((userId) => this.users.indexOf(userId) === -1);
    const users = await User.find({_id: {$in: userIds}}).select('_id teams');
    const updatedDocuments = [];

    for (const user of users) {
      this.users.push(user._id);
      await user.addTeam(this._id);
      updatedDocuments.push(user);
    }

    updatedDocuments.push(this);

    return {
      documents: updatedDocuments,
      save: async function () {
        for (const document of this.documents) {
          await document.save();
        }
      }
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
    const leagueIndex = this.leagues.indexOf(leagueId);
    const updatedDocuments = [];

    if (leagueIndex === -1) {
      this.leagues.push(leagueId);
    }

    await this.populate('users').execPopulate();
    for (const user of this.users) {
      await user.addLeague(leagueId);
      updatedDocuments.push(user)
    }

    updatedDocuments.push(this);

    return {
      documents: updatedDocuments,
      save: async function () {
        for (const document of this.documents) {
          await document.save();
        }
      }
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
    const updatedDocuments = [];

    if (fixtureIndex === -1) {
      this.fixtures.push(fixtureId);
    }

    await this.populate('users').execPopulate();
    for (const user of this.users) {
      user.addFixture(fixtureId)
      updatedDocuments.push(user);
    }

    updatedDocuments.push(this);

    return {
      documents: updatedDocuments,
      save: async function () {
        for (const document of this.documents) {
          await document.save();
        }
      }
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
