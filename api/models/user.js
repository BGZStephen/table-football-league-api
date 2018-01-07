const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = Schema({
  admin: {type: Boolean, default: false},
  firstName: {type: String, required: true},
  lastName: String,
  email: {type: String, required: true, unique: true},
  username: String,
  password: String,
  createdOn: {type: Date, default: () => new Date()},
  lastSignIn: Date,
  profileImageUrl: String,
  statistics: {
    wins: Number,
    losses: Number,
  },
  poisition: {
    striker: {type: Boolean, default: false},
    defender: {type: Boolean, default: false},
  },
  teams: [{type: Schema.ObjectId, ref: 'Team'}],
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}],
  leagues: [{type: Schema.ObjectId, ref: 'League'}],
})

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 8)
  }

  next();
})

UserSchema.methods = {
  addWin() {
    this.statistics.wins += 1;
  },

  addLoss() {
    this.statistics.loss += 1;
  },

  addFixture(fixtureId) {
    this.fixtures.push(fixtureId);
  },

  addFixtures(fixtureIds) {
    for (const fixtureId of fixtureIds) {
      const fixtureIndex = this.fixtures.indexOf(fixtureId)
      if (fixtureIndex === -1) {
        this.fixtures.push(fixtureId);
      }
    }
  },

  removeFixture(fixtureId) {
    const fixtureIndex = this.fixtures.indexOf(fixtureId)
    if (fixtureIndex >= 0) {
      this.fixtures.splice(fixtureIndex, 1);
    }
  },

  removeFixtures(fixtureIds) {
    for (const fixtureId of fixtureIds) {
      const fixtureIndex = this.fixtures.indexOf(fixtureId)
      if (fixtureIndex >= 0) {
        this.fixtures.splice(fixtureIndex, 1);
      }
    }
  },

  addLeague(leagueId) {
    const leagueIndex = this.leagues.indexOf(leagueId)
    if (leagueIndex === -1) {
      this.leagues.push(leagueId);
    }
  },

  removeLeague(leagueId) {
    const leagueIndex = this.leagues.indexOf(leagueId)
    if (leagueIndex >= 0) {
      this.leagues.splice(leagueIndex, 1);
    }
  },

  addTeam(teamId) {
    const teamIndex = this.teams.indexOf(teamId)
    if (teamIndex === -1) {
      this.teams.push(teamId);
    }
  },

  removeTeam(teamId) {
    const teamIndex = this.teams.indexOf(teamId)
    if (teamIndex >= 0) {
      this.teams.splice(teamIndex, 1);
    }
  },

  validatePassword(password) {
    if (!bcrypt.compareSync(password, this.password)) {
      throw new Error({message: 'Incorrect password', statusCode: 403});
    }
  }
}

module.exports = mongoose.model('User', UserSchema);
