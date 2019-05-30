import { Schema, Model, model, Document } from 'mongoose';
import * as _ from 'lodash';
import { IUser } from './user';

export interface IMessage extends Document {
  _id: string;
  createdOn: Date;
  viewedOn: Date;
  createdBy: string;
  senderId: string;
  recipientId: string;
  sender: IUser;
  recipient: IUser;
  content: string;
  title: string;
}

const MessageSchema = new Schema({
  createdOn: {type: Date, required: true, default: () => new Date()},
  viewedOn: {type: Date, required: true, default: () => new Date()},
  createdBy: {type: String},
  senderId: {type: String},
  recipientId: {type: String},
  title: {type: String},
  content: {type: String},
})

MessageSchema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
});

MessageSchema.virtual('recipient', {
  ref: 'User',
  localField: 'recipientID',
  foreignField: '_id',
});

export const MessageModel: Model<IMessage> = model<IMessage>('Message', MessageSchema);
