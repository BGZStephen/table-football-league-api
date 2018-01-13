const mongoose = require('mongoose');
const League = mongoose.model('League');
const Team = mongoose.model('Team');
const User = mongoose.model('User');

const Schema = mongoose.Schema;

const FixtureSchema = Schema({
  createdOn: {type: Date, default: () => new Date()},
  fixtureDate: Date,
  teams: [{type: Schema.ObjectId, ref: 'Team'}],
  score: {
    homeTeam: {
      type: Number,
      default: 0
    },
    awayTeam: {
      type: Number,
      default: 0
    },
  },
  played: {
    type: Boolean,
    default: false,
  },
  type: String,
  leagueId: {type: Schema.ObjectId, ref: 'League'},
})

FixtureSchema.pre('save', async function(next) {
  if (this.isModified('teams')) {
    await this.populate('teams').execPopulate();

    for (const team of this.teams) {
      const teamUpdates = await team.addFixture(this._id);
      await teamUpdates.save();
    }
  }

  if (this.isModified('leagueId')) {
    if (this.leagueId) {
      await this.populate('leagueId').execPopulate();
      await this.leagueId.addFixture(this._id);
      await this.leagueId.save();
    }
  }

  if (this.isModified('type')) {
    // check for type change and remove fixture from league if changing to friendly
    if (this.type === 'friendly' && this.leagueId) {
      await this.populate('leagueId').execPopulate();
      this.leagueId.removeFixture(this._id);
      await this.leagueId.save();
    }
  }

  next();
})

FixtureSchema.post('remove', function(fixture) {
  for (const teamId of fixture.teams) {
    const team = await Team.findById(teamId);
    await team.removeFixture();
    await team.save();
  }

  if (fixture.leagueId) {
    const league = League.findById(fixture.leagueId);
    await league.removeFixture();
    await league.save();
  }
})

FixtureSchema.methods = {
  /**
   * submit a score for this fixture and set it to played
   * @param {Object} params
   * @param {Object} params.homeTeam home team params
   * @param {Object} params.homeTeam.score home team score
   * @param {Object} params.awayTeam away team params
   * @param {Object} params.awayTeam.score away team score
   */
  async submitScore(params) {
    this.homeTeam.score = params.homeTeam.score;
    this.awayTeam.score = params.awayTeam.score;
    this.played = true;

    if (this.type === 'league') {
      await this.submitLeagueScore(params)
    }

    await this.save();
  },

  /**
   * submit a fixture score to it's league
   * @param {Object} params
   * @param {Object} params.homeTeam home team params
   * @param {Object} params.homeTeam.score home team score
   * @param {Object} params.awayTeam away team params
   * @param {Object} params.awayTeam.score away team score
   */
  async submitLeagueScore(params) {
    const league = await League.findById(this.leagueId);

    await league.updateTeamStatistics({
      id: params.homeTeam._id,
      win: params.homeTeam.score > params.awaytTeam.score ? true : false,
      loss: params.homeTeam.score < params.awaytTeam.score ? true : false,
      goalsScored: params.homeTeam.score,
      goalsConceded: params.awayTeam.score,
    });

    await league.updateTeamStatistics({
      id: params.awayTeam._id,
      win: params.homeTeam.score < params.awaytTeam.score ? true : false,
      loss: params.homeTeam.score > params.awaytTeam.score ? true : false,
      goalsScored: params.awayTeam.score,
      goalsConceded: params.homeTeam.score,
    });
  },

  async removeTeam(teamId) {
    this.teams.splice(this.teams.indexOf(teamId), 1);

    const team = await Team.findById(teamId);
    await team.removeFixture(this._id);
    await team.save();
  }
}

module.exports = mongoose.model('Fixture', FixtureSchema);
