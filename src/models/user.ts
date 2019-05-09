import { Schema, Model, model, Document } from 'mongoose';
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';

export interface IUser extends Document {
  createdOn: Date;
  updatedOn?: Date;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  lastSignIn: Date,

  isPasswordValid(password: string): Promise<boolean>;
}

const UserSchema = new Schema({
  createdOn: {type: Date, default: () => new Date()},
  updatedOn: {type: Date},
  firstName: {type: String, required: true},
  lastName: {type: String},
  email: {type: String, required: true, unique: true},
  password: String,
  lastSignIn: Date,
})

UserSchema.pre('save', function(this: IUser, next) {
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

export const UserModel: Model<IUser> = model<IUser>('User', UserSchema);
