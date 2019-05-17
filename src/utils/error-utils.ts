import { config } from '../config'
import { Request, Response, NextFunction } from "express";
import * as Debug from "debug";
import { HTTPError } from '../domain/errors/http-error';

const debug = Debug("api")

export function logErrors (err: HTTPError, req: Request, res: Response, next: NextFunction) {
  if (config.env === 'development') {
    debug(err);
  }
  
  errorHandler(err, req, res)
}

// handle all express generated errors with stacks
export function errorHandler (err: HTTPError, req: Request, res: Response) {
  res.statusMessage = err.message || "Something went wrong";
  return res.status(err.statusCode || 500).send(err.message);
}