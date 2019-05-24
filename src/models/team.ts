import { Schema, Model, model, Document } from 'mongoose';
import * as _ from 'lodash';
import { IUser } from './user';

export interface ITeam extends Document {
  _id: string;
  createdOn: Date;
  updatedOn?: Date;
  userIds: string[];
  users?: IUser[];
}

const TeamSchema = new Schema({
  createdOn: {type: Date, default: () => new Date()},
  updatedOn: {type: Date},
  userIds: {type: String}
})

TeamSchema.virtual('users', {
  ref: 'User',
  localField: 'userIds',
  foreignField: '_id',
});

export const TeamModel: Model<ITeam> = model<ITeam>('Team', TeamSchema);
