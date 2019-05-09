const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = Schema({
  admin: {type: Boolean, default: false},
  createdOn: {type: Date, default: () => new Date()},
  firstName: {type: String, required: true},
  lastName: {type: String},
  email: {type: String, required: true, unique: true},
  password: String,
  lastSignIn: Date,
  profileImageUrl: String,
  statistics: {
    wins: Number,
    losses: Number,
  },
})

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 8)
  }

  next();
})

UserSchema.methods = {
  isPasswordValid(password) {
    return bcrypt.compareSync(password, this.password)
  }
}

module.exports = mongoose.model('User', UserSchema);
