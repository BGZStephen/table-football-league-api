const mongoose = require('mongoose');
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

module.exports = mongoose.model('Team', TeamSchema);
