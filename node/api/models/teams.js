const mongoose = require('mongoose');

const TeamSchema = mongoose.Schema({
  createdOn: Date,
  name: String,
  players: [{type: Schema.ObjectId, ref: 'Player'}]
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}]
  leagues: [{type: Schema.ObjectId, ref: 'League'}]
})

module.exports = mongoose.model('Team', TeamSchema);
