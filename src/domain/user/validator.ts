import * as joi from 'joi';
import * as joiUtils from '../../utils/joi';
import { IUserCreateParams, IUserAuthenticationParams } from './user';

class UserValidatorService {
  public validateNewUser(params: IUserCreateParams) {
    const schema = joi.object().keys({
      firstName: joi.string().alphanum().required().label('First name'),
      lastName: joi.string().alphanum().required().label('Last name'),
      email: joi.string().email({ minDomainAtoms: 2 }).required().label('Email'),
      password: joi.string().required().label('Password'),
    });
  
    joiUtils.validateThrow(params, schema);
  }

  public validateAuthenticationCredentials(params: IUserAuthenticationParams) {
    const schema = joi.object().keys({
      email: joi.string().email().required().label('Email'),
      password: joi.string().required().label('Password'),
    });
  
    joiUtils.validateThrow(params, schema);
  }
}

export const UserValidator = new UserValidatorService();