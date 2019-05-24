import * as _ from "lodash"
import { TeamValidator } from "./validator";
import { ITeam, TeamModel } from "../../models/team";

export interface ITeamCreateParams {
  name: string;
  userIds: string[];
}

class TeamDomainHelper {
  private team: ITeam;

  constructor(team: ITeam) {
    this.team = team;
  }

  public get() {
    this.hasTeam("get");
    return this.team;
  }

  public async save() {
    this.hasTeam("save");
    await this.team.save();
  }

  private hasTeam(callingFunctionName: string) {
    if (!this.team) {
      throw new Error(`A Team has to be set for this function (${callingFunctionName}) to be called`)
    }
  }

  public clear() {
    this.team = undefined;
  }

  public getPublicFields() {
    this.hasTeam("getPublicFields");
    return this.team;
  }

  static async create(params: ITeamCreateParams) {
    TeamValidator.validateNewTeam(params);

    const user = await TeamModel.create(_.pick(params, ['name', 'userIds']));
  
    return new TeamDomainHelper(user)
  }
}

export const Team = TeamDomainHelper;