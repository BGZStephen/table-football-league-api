const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const Team = mongoose.model('Team');
const League = mongoose.model('League');
const Fixture = mongoose.model('Fixture');
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = Schema({
  admin: {type: Boolean, default: false},
  firstName: {type: String, required: true},
  lastName: String,
  email: {type: String, required: true},
  username: String,
  password: String,
  createdOn: Date,
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

UserSchema.pre('save', function() {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(string, 8)
  }
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
  },

  async getTeams() {
    const teams = await Team.find({players: ObjectId(this._id)});
    return teams;
  },

  async getLeagues() {
    const teams = await this.getTeams();
    let leagues = [];

    for (const team of teams) {
      let teamLeagues = await League.find({teams: {_id: ObjectId(team._id)}});
      if (teamLeagues) {
        leagues = leagues.concat(teamLeagues);
      }
    }

    return leagues;
  },

  async getFixtures() {
    const teams = await this.getTeams();
    let fixtures = [];

    for (team of teams) {
      let teamFixtures = await Fixture.find({teams: ObjectId(this._id)});
      if (teamFixtures) {
        fixtures = fixtures.concat(teamFixtures);
      }
    }

    return fixtures;
  },

  validatePassword(password) {
    if (!bcrypt.compareSync(password, this.password)) {
      throw new Error({message: 'Incorrect password', statusCode: 403});
    }
  }
}

module.exports = mongoose.model('User', UserSchema);
