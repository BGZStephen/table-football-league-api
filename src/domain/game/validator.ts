import * as joi from 'joi';
import * as joiUtils from '../../utils/joi';
import { IGameCreateParams, IGameQuery, IGameUpdateParams } from './game';

class GameValidatorService {
  public validateNewGame(params: IGameCreateParams) {
    const schema = joi.object().keys(newGameConstraint);
  
    joiUtils.validateThrow(params, schema);
  }

  public validateListQuery(params: IGameQuery) {
    const schema = joi.object().keys(gameListConstraint);
  
    joiUtils.validateThrow(params, schema);
  }

  public validateUpdate(params: IGameUpdateParams) {
    const schema = joi.object().keys(gameUpdateConstraint);
  
    joiUtils.validateThrow(params, schema);
  }
}

export const GameValidator = new GameValidatorService();

export const newGameConstraint = {
  homeTeam: joi.string().alphanum().required().label('Home team'),
  awayTeam: joi.array().items(joi.string().alphanum()).label('Away team'),
}

export const gameListConstraint = {
  name: joi.string().alphanum().label('Game Name'),
  _id: joi.string().label('Game IDs'),
  userId: joi.string().label('User IDs'),
  sort: joi.string().label("Sort"),
  limit: joi.number().min(1).label("Limit"),
  offset: joi.number().min(0).label("Offset"),
}

export const gameUpdateConstraint = {
  score: joi.object().keys({
    homeTeam: joi.number().min(-10).max(10),
    awayTeam: joi.number().min(-10).max(10),
  }),
  submitted: joi.object().keys({
    homeTeam: joi.boolean(),
    awayTeam: joi.boolean(),
  }),
  positions: joi.object().keys({
    homeTeam: joi.object().keys({
      offence: joi.string().alphanum().required(),
      defence: joi.string().alphanum().required()
    }),
    awayTeam: joi.object().keys({
      offence: joi.string().alphanum().required(),
      defence: joi.string().alphanum().required()
    }),
  }),
}