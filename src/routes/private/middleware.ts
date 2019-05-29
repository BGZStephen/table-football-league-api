import { Request, Response, NextFunction } from "express";
import { UserService } from "../../domain/user/service";

export function needsUser(req: Request, res: Response, next: NextFunction) {
  const user = UserService.get();

  if (!user) {
    return res.sendStatus(403);
  }

  next();
}