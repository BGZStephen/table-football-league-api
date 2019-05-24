import * as _ from "lodash"
import { TeamValidator } from "./validator";
import { ITeam, TeamModel } from "../../models/team";

export interface ITeamCreateParams {
  name: string;
  userIds: string[];
}

export interface ITeamQuery {
  _id: string;
  userId: string;
  name: string;
  sort: string;
  limit: number;
  offset: number;
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

  static async list(query: ITeamQuery) {
    TeamValidator.validateListQuery(query);

    const dbQuery: any = {};
    const dbSort: any = {};
    const dbFields: any = {};
    const dbFilter: any = {
      limit: query.limit || 20,
      skip: query.offset || 0,
    }

    if (query._id) {
      dbQuery._id = {$in: query._id.split(',')}
    }

    if (query.userId) {
      dbQuery.userIds = {$in: query.userId.split(',')}
    }

    if (query.name) {
      dbQuery.name = {$in: query.name.split(',')}
    }

    if (query.sort) {
      const sortKey = query.sort.startsWith('-') ? query.sort.substr(1, query.sort.length) : query.sort;
      dbSort[sortKey] = query.sort.startsWith('-') ? 'desc' : 'asc';
    }

    const results = await TeamModel.find(dbQuery, dbFields, dbFilter).sort(query.sort ? dbSort : null);
    const totalCount = await TeamModel.count({});

    const response = {
      count: results.length,
      totalCount,
      data: results,
    }

    return response;
  }
}

export const Team = TeamDomainHelper;