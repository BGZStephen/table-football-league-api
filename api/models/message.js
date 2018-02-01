const mongoose = require('mongoose');
const mongooseUtils = require('../utils/mongoose');

const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

const MessageSchema = Schema({
  createdOn: {type: Date, default: () => new Date()},
  sentOn: {type: Date, default: () => new Date()},
  type: {type: String},
  sender: {type: Schema.ObjectId, ref: 'User'},
  recipients: [{type: Schema.ObjectId, ref: 'User'}],
  template: {type: String},
  templateData: {type: Object},
  private: {type: Boolean},
  originatingMessage: {type: Schema.ObjectId, ref: 'Message'},
  read: {type: Boolean},
})

MessageSchema.pre('save', async function(next) {
  next();
})

MessageSchema.methods = {}

module.exports = mongoose.model('Message', MessageSchema);
