import * as joi from 'joi';
import * as joiUtils from '../../utils/joi';
import { ITeamCreateParams, ITeamQuery } from './team';

class TeamValidatorService {
  public validateNewTeam(params: ITeamCreateParams) {
    const schema = joi.object().keys({
      name: joi.string().alphanum().required().label('Team Name'),
      userIds: joi.array().items(joi.string().alphanum()).label('User IDs'),
    });
  
    joiUtils.validateThrow(params, schema);
  }

  public validateListQuery(params: ITeamQuery) {
    const schema = joi.object().keys({
      name: joi.string().alphanum().label('Team Name'),
      _id: joi.string().label('Team IDs'),
      userId: joi.string().label('User IDs'),
    });
  
    joiUtils.validateThrow(params, schema);
  }
}

export const TeamValidator = new TeamValidatorService();