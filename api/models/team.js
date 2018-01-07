const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const League = require('./league')

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
  addUser(userId) {
    const userIndex = this.users.indexOf(userId)
    if (userIndex === -1) {
      this.users.push(userId);
    }
  },

  removeUser(userId) {
    const userIndex = this.users.indexOf(userId)
    if (userIndex >= 0) {
      this.users.splice(userIndex, 1);
    }
  },

  async addTeamToLeague(leagueId) {
    const league = await League.findById(ObjectId(leagueId))

    if (league) {
      this.leagues.push(leagueId);
      await this.save();
      await league.addTeam(this._id);
      await league.save();

      for (const user of this.users) {
        await user.addLeague(leagueId);
        await user.save();
      }
    }
  },

  async removeTeamFromLeague(leagueId) {
    const league = await League.findById(leagueId);

    if (user) {
      await league.removeTeam(this._id);
      await league.save();
    }

    await this.populate('users');
    for (const user of this.users) {
      await user.removeLeague(leagueId);
      await user.save();
    }
  },

  async addTeamToFixture(fixtureId) {
    const fixture = await Fixture.findById(fixtureId)

    if (fixture) {
      await fixture.addTeam(this._id);
      await fixture.save();
    }

    await this.populate('users');
    for (const user of this.users) {
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

    await this.populate('users');
    for (const user of this.users) {
      await user.removeFixture(fixtureId);
      await user.save();
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
