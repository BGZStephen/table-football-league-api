import { Request, Response, NextFunction } from "express";

export async function setUserContext(req: Request, res: Response, next: NextFunction) {
  if (!req.header("x-access-token")) {
    return next();
  }
}