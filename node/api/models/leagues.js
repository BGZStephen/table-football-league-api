const mongoose = require('mongoose');

const LeagueSchema = mongoose.Schema({
  createdOn: Date,
  name: String,
  administrators: [{type: Schema.ObjectId, ref: 'User'}]
  teams: [{type: Schema.ObjectId, ref: 'Team'}],
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}],
})

module.exports = mongoose.model('League', LeagueSchema);
