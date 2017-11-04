const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeagueSchema = Schema({
  createdOn: Date,
  name: String,
  administrators: [{type: Schema.ObjectId, ref: 'User'}],
  teams: [{type: Schema.ObjectId, ref: 'Team'}],
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}],
})

module.exports = mongoose.model('League', LeagueSchema);
