import * as joi from 'joi';
import * as joiUtils from '../../utils/joi';
import { ITeamCreateParams } from './team';

class TeamValidatorService {
  public validateNewTeam(params: ITeamCreateParams) {
    const schema = joi.object().keys({
      name: joi.string().alphanum().required().label('Team Name'),
      userIds: joi.alternatives().try(joi.array().items(joi.string().alphanum()), joi.string().alphanum()).label('User IDs'),
    });
  
    joiUtils.validateThrow(params, schema);
  }
}

export const TeamValidator = new TeamValidatorService();