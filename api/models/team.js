const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = Schema({
  createdOn: {type: Date, default: () => new Date()},
  createdBy: {type: Schema.ObjectId, rer: 'User'},
  name: {type: String, unique: true},
  statistics: {
    wins: Number,
    losses: Number,
    goalsScored: Number,
    goalsConceded: Number,
  },
  players: [{type: Schema.ObjectId, ref: 'Player'}],
})

module.exports = mongoose.model('Team', TeamSchema);
