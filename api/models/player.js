const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const PlayerSchema = Schema({
  createdOn: {type: Date, default: () => new Date()},
  name: {type: String, required: true},
  statistics: {
    wins: Number,
    losses: Number,
  },
  position: {
    striker: {type: Boolean, default: false},
    defender: {type: Boolean, default: false},
  },
  teams: [{type: Schema.ObjectId, ref: 'Team'}],
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}],
  leagues: [{type: Schema.ObjectId, ref: 'League'}],
})

PlayerSchema.methods = {
  addWin() {
    this.statistics.wins += 1;
  },

  addLoss() {
    this.statistics.loss += 1;
  },
}

module.exports = mongoose.model('Player', PlayerSchema);
