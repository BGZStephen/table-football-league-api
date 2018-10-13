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
  players: [{type: Schema.ObjectId, ref: 'Player'}],
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}],
  leagues: [{type: Schema.ObjectId, ref: 'League'}],
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

  async removeUser(userId) {
    const userIndex = this.users.indexOf(userId)
    if (userIndex >= 0) {
      this.users.splice(userIndex, 1);
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
    this.goalsConceded += goals;
  },
}

module.exports = mongoose.model('Team', TeamSchema);
