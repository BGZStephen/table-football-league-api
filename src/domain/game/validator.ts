import * as joi from 'joi';
import * as joiUtils from '../../utils/joi';
import { IGameCreateParams, IGameQuery } from './game';

class GameValidatorService {
  public validateNewGame(params: IGameCreateParams) {
    const schema = joi.object().keys(newGameConstraint);
  
    joiUtils.validateThrow(params, schema);
  }

  public validateListQuery(params: IGameQuery) {
    const schema = joi.object().keys(gameListConstraint);
  
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
}