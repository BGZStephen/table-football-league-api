const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const LeagueSchema = Schema({
  createdOn: {type: Date, default: () => new Date()},
  name: {type: String, unique: true},
  gamesPerSeason: {type: Number, required: true},
  teams: [{type: Schema.ObjectId, ref: 'Team'}],
})

LeagueSchema.methods = {
  async generateFixtures() {
    const Fixture = mongoose.model('Fixture');
    let i = 0;

    do {
      for (const homeTeam of this.teams) {
        for (const awayTeam of this.teams) {
          if (homeTeam !== awayTeam) {
            const fixture = new Fixture({
              date: moment().startOf('day'),
              teams: [homeTeam, awayTeam],
              type: 'league',
              league: this._id
            })

            await fixture.save();
          }
        }
      }
      i += 2;
    } while (i < this.gamesPerSeason)
  }
}

module.exports = mongoose.model('League', LeagueSchema);
