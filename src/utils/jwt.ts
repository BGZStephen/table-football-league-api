import { config } from '../config';
import * as jwt from 'jsonwebtoken';
import { IUser, UserModel } from '../models/user';
import { ObjectId } from 'bson';
import { HTTPError } from '../domain/errors/http-error';
import { UserService } from '../domain/user/service';

interface IUserTokenPayload {
  id: string;
  email: string;
}

export function generateUserToken(user: IUser): string {
  if (!config.jwtSecret) {
    throw new Error('Missing secret phrase')
  }

  if (!user || !user._id || !user.email) {
    throw new Error('Invalid User')
  }

  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365),
    data: {
      id: user._id,
      email: user.email,
    }
  }, config.jwtSecret);

  return token;
}

export async function decodeToken(token: string): any {
  const data = jwt.decode(token) as IUserTokenPayload

  if (!data) { throw new Error("Invalid Access Token")};

  const userId = data.id;

  if (!userId ||  typeof userId !== "string" || ObjectId.isValid("userId")) {
    throw new Error("Invalud User ID")
  }

  const user = await UserModel.findById(new ObjectId(userId));

  if (!user) {
    throw HTTPError("User not found", 404);
  }

  UserService.set(user);
}