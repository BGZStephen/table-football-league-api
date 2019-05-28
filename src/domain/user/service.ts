import { IUser } from "../../models/user";

export class UserService {
  user: IUser;

  public set(user: IUser) {
    this.user = user;
  }

  public get() {
    this.hasUser("get")
    return this.user;
  }

  private hasUser(callingFunctionName: string) {
    if (!this.user) {
      throw new Error(`A User has to be set for this function (${callingFunctionName}) to be called`)
    }
  }
}