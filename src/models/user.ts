import { Schema, Model, model, Document } from 'mongoose';
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';

export interface IUser extends Document {
  createdOn: string;
  updatedOn?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  lastSignIn: string,

  isPasswordValid(password: string): boolean;
  getPublicFields(): IPublicUser;
}

type IPublicUser = Pick<IUser, '_id' | 'createdOn' | 'updatedOn' | 'firstName' | 'lastName' | 'email' | 'lastSignIn'>

const UserSchema = new Schema({
  createdOn: {type: Date, default: () => new Date().toISOString()},
  updatedOn: {type: Date},
  firstName: {type: String, required: true},
  lastName: {type: String},
  email: {type: String, required: true, unique: true},
  password: String,
  lastSignIn: Date,
})

UserSchema.pre('save', function(this: IUser, next: Function) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 8)
  }

  next();
})

UserSchema.methods = {
  isPasswordValid(this: IUser, password: string) {
    return bcrypt.compareSync(password, this.password)
  },

  getPublicFields(this: IUser): IPublicUser {
    return _.pick(this, ['_id', 'createdOn', 'updatedOn', 'firstName', 'lastName', 'email', 'lastSignIn']);
  }
}

export const UserModel: Model<IUser> = model<IUser>('User', UserSchema);
