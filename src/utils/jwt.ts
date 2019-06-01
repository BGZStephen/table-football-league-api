import { config } from '../config';
import * as jwt from 'jsonwebtoken';
import { IUser } from '../models/user';

interface IUserTokenPayload {
  id: string;
  email: string;
}

interface IDecodedJWT {
  exp: number;
  data: IUserTokenPayload
  iat: number;
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

export async function decodeToken(token: string): Promise<IUserTokenPayload> {
  const decodedJwt = jwt.decode(token) as IDecodedJWT

  if (!decodedJwt) { throw new Error("Invalid Access Token")};

  return decodedJwt.data;
}