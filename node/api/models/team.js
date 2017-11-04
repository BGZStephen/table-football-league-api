const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = Schema({
  createdOn: Date,
  name: String,
  players: [{type: Schema.ObjectId, ref: 'User'}],
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}],
  leagues: [{type: Schema.ObjectId, ref: 'League'}],
})

module.exports = mongoose.model('Team', TeamSchema);
