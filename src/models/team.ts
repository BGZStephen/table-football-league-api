import { Schema, Model, model, Document } from 'mongoose';
import * as _ from 'lodash';
import { IUser } from './user';

export interface ITeam extends Document {
  _id: string;
  createdOn: string;
  updatedOn?: string;
  userIds: string[];
  users?: IUser[];
}

const TeamSchema = new Schema({
  createdOn: {type: Date, default: () => new Date().toISOString()},
  updatedOn: {type: Date},
  userIds: [{type: Schema.Types.ObjectId, ref: 'User'}],
  name: {type: String, required: true}
}, {
  toJSON: {virtuals: true}, toObject: { virtuals: true }
})

TeamSchema.virtual('users', {
  ref: 'User',
  localField: 'userIds',
  foreignField: '_id',
});

export const TeamModel: Model<ITeam> = model<ITeam>('Team', TeamSchema);
