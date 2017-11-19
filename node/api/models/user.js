const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  email: {
    type: String,
    required: true,
  },
  username: String,
  password: String,
  createdOn: Date,
  profileImage: String,
  teams: [{type: Schema.ObjectId, ref: 'Team'}],
  fixtures: [{type: Schema.ObjectId, ref: 'Fixture'}],
  leagues: [{type: Schema.ObjectId, ref: 'League'}],
})

module.exports = mongoose.model('User', UserSchema);
