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
  userIds: [{type: String}],
  name: {type: String, required: true}
})

TeamSchema.virtual('users', {
  ref: 'User',
  localField: 'userIds',
  foreignField: '_id',
});

export const TeamModel: Model<ITeam> = model<ITeam>('Team', TeamSchema);
