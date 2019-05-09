import { IUser } from "../models/user";
import { IProperty } from "../models/property";

declare global {
  namespace Express {
    export interface Request {
      context: {
        authenticatedUser: IUser,
        user: IUser,
        property: IProperty,
      }
    }
  
    export interface Response {
      error(params: any): void;
    }
  }
}