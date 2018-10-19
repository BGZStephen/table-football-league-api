const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PasswordResetSchema = Schema({
  createdOn: {type: Date, default: () => new Date()},
  userId: {type: Schema.ObjectId, rer: 'User', required: true},
  email: {type: String, required: true},
  token: {type: String, required: true},
  expiry: {type: Number, required: true}
})

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
