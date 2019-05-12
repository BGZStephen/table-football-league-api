import { Request, Response, NextFunction } from "express-serve-static-core";

export function asyncwrap(fn) {
  const ctx = this;

  return function (req: Request, res: Response, next: NextFunction) {
    return fn.call(ctx, req, res, next).catch(next);
  };
}