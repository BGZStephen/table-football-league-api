import * as _ from "lodash"
import { GameValidator } from "./validator";
import { IGame, GameModel } from "../../models/game";

export interface IGameCreateParams {
  homeTeam: string;
  awayTeam: string;
}

export interface IGameQuery {
  _id: string;
  teamId: string;
  userId: string;
  sort: string;
  limit: number;
  offset: number;
}

class GameDomainHelper {
  private game: IGame;

  constructor(game: IGame) {
    this.game = game;
  }

  public get() {
    this.hasGame("get");
    return this.game;
  }

  public async save() {
    this.hasGame("save");
    await this.game.save();
  }

  private hasGame(callingFunctionName: string) {
    if (!this.game) {
      throw new Error(`A Game has to be set for this function (${callingFunctionName}) to be called`)
    }
  }

  public clear() {
    this.game = undefined;
  }

  public getPublicFields() {
    this.hasGame("getPublicFields");
    return this.game;
  }

  static async create(params: IGameCreateParams) {
    GameValidator.validateNewGame(params);

    const game = await GameModel.create({
      homeTeam: params.homeTeam,
      awayTeam: params.awayTeam,
    });
  
    return new GameDomainHelper(game)
  }

  static async list(query: IGameQuery) {
    GameValidator.validateListQuery(query);

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

    if (query.sort) {
      const sortKey = query.sort.startsWith('-') ? query.sort.substr(1, query.sort.length) : query.sort;
      dbSort[sortKey] = query.sort.startsWith('-') ? 'desc' : 'asc';
    }

    const results = await GameModel.find(dbQuery, dbFields, dbFilter).sort(query.sort ? dbSort : null);
    const totalCount = await GameModel.count({});

    const response = {
      count: results.length,
      totalCount,
      data: results,
    }

    return response;
  }
}

export const Game = GameDomainHelper;