const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = Schema({
  admin: {type: Boolean, default: false},
  firstName: {type: String, required: true},
  lastName: {type: String},
  email: {type: String, required: true, unique: true},
  password: String,
  createdOn: {type: Date, default: () => new Date()},
  lastSignIn: Date,
  profileImageUrl: String,
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

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 8)
  }

  next();
})

UserSchema.methods = {
  addWin() {
    this.statistics.wins += 1;
  },

  addLoss() {
    this.statistics.loss += 1;
  },

  isPasswordValid(password) {
    return bcrypt.compareSync(password, this.password)
  }
}

module.exports = mongoose.model('User', UserSchema);
