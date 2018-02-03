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
  private: {type: Boolean, default: false},
  originatingMessage: {type: Schema.ObjectId, ref: 'Message'},
  read: {type: Boolean, default: false},
  userId: {type: Schema.ObjectId, ref: 'User'}
})

MessageSchema.pre('save', async function(next) {
  next();
})

MessageSchema.methods = {
  async sendMessages() {
    for (const recipient of this.recipients) {
      if (recipient !== this.userId) {
        const message = new Message({
          type: this.type,
          sender: this.sender,
          recipients: this.recipients,
          template: this.template,
          templateData: this.templateData,
          private: this.private,
          originatingMessage: this._id,
          userId: recipient
        })

        await message.save();
      }
    }
  },

  async markAsRead() {
    this.read = true;
    await this.save();
  }
}

module.exports = mongoose.model('Message', MessageSchema);
