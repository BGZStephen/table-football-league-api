import { config } from '../config'
import { Request, Response, NextFunction } from "express";
import * as Debug from "debug";

const debug = Debug("api")

export function logErrors (err: Error, req: Request, res: Response, next: NextFunction) {
  if (config.env === 'development') {
    debug(err);
  }

  next(err)
}

// handle all express generated errors with stacks
export function errorHandler (err: Error, req: Request, res: Response) {
  res.status(500).send({message: err.message});
}