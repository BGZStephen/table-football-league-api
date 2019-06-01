import { Request, Response, NextFunction } from "express";
import * as jwt from "../../utils/jwt";
import { ObjectId } from "bson";
import { UserModel } from "../../models/user";
import { HTTPError } from "../../domain/errors/http-error";
import { UserService } from "../../domain/user/service";

export async function setUserContext(req: Request, res: Response, next: NextFunction) {
  if (!req.headers["x-access-token"]) {
    return next();
  }

  const accessTokenContent = await jwt.decodeToken(req.headers["x-access-token"] as string)

  const userId = accessTokenContent.id;

  if (!userId || typeof userId !== "string" || !ObjectId.isValid(userId)) {
    throw new Error("Invalud User ID")
  }

  const user = await UserModel.findById(new ObjectId(userId));

  if (!user) {
    throw HTTPError("User not found", 404);
  }

  UserService.set(user);

  next();
}