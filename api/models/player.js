const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlayerSchema = Schema({
  createdOn: {type: Date, default: () => new Date()},
  createdBy: {type: Schema.ObjectId, rer: 'User'},
  name: {type: String, required: true},
  statistics: {
    wins: Number,
    losses: Number,
  },
  position: {
    striker: {type: Boolean, default: false},
    defender: {type: Boolean, default: false},
  },
  userId: {type: Schema.ObjectId, rer: 'User'},
})

module.exports = mongoose.model('Player', PlayerSchema);
