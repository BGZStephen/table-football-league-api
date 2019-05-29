import * as joi from 'joi';
import * as Debug from 'debug';
import { HTTPError } from '../domain/errors/http-error';

const debugApi = Debug('api');

export function validateThrow(value: any, schema: joi.SchemaLike, options?: joi.ValidationOptions): void {
  const results = joi.validate(value, schema);

  if (results && results.error) {
    debugApi(results.error.details);
    throw HTTPError(results.error.details[0].message, 400);
  }
}