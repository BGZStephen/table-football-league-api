import * as _ from "lodash"
import * as bcrypt from "bcryptjs";
import { UserValidator } from "./validator";
import { HTTPError } from "../errors/http-error";
import { IUser, UserModel } from "../../models/user";
import jwt = require('../../utils/jwt');
import * as Debug from "debug";

const debugAuth = Debug('authentication');

class UserDomainHelper {
  private user: IUser;

  constructor(user: IUser) {
    this.user = user;
  }

  public get() {
    this.hasUser("get");
    return this.user;
  }

  public async save() {
    this.hasUser("save");
    await this.user.save();
  }

  private hasUser(callingFunctionName) {
    if (!this.user) {
      throw new Error(`A User has to be set for this function (${callingFunctionName}) to be called`)
    }
  }

  public clear() {
    this.user = undefined;
  }

  public getPublicFields() {
    this.hasUser("getPublicFields");
    return this.user.getPublicFields();
  }

  public generateJwt() {
    this.hasUser("generateJwt");
    return jwt.generateUserToken(this.user);
  }

  static async create(params) {
    UserValidator.validateNewUser(params);

    // validate password regexp outside of joi to stop the string being sent back in plain test
    if (!params.password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)) {
      throw new HTTPError('Password is not strong enough', 400);
    }
    
    if (await UserModel.findOne({ email: params.email }).count()) {
      throw new HTTPError('Email address already in use', 400);
    }

    const user = await UserModel.create(_.pick(params, ['firstName', 'lastName', 'email', 'password']));
  
    return new UserDomainHelper(user)
  }

  static async authenticate(params) {
    UserValidator.validateAuthenticationCredentials(params);
    const user = await UserModel.findOne({ email: params.email });

    if (!user) {
      debugAuth('unrecognised email address');
      throw new HTTPError('Incorrect email address or password', 400);
    }

    if (!await user.isPasswordValid(params.password)) {
      debugAuth('Incorrect password');
      throw new HTTPError('Incorrect email address or password', 400)
    }

    return new UserDomainHelper(user);
  }
}

export const User = UserDomainHelper;