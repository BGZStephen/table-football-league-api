import * as joi from 'joi';
import * as Debug from 'debug';

const debugApi = Debug('api');

export function validateThrow(value: any, schema: joi.SchemaLike, options?: joi.ValidationOptions): void {
  const results = joi.validate(value, schema);

  if (results && results.error) {
    debugApi(results.error.details);
    throw new Error(results.error.details[0].message);
  }
}