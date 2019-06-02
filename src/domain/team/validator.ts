import * as joi from 'joi';
import * as joiUtils from '../../utils/joi';
import { ITeamCreateParams, ITeamQuery } from './team';

class TeamValidatorService {
  public validateNewTeam(params: ITeamCreateParams) {
    const schema = joi.object().keys(newTeamConstraint);
    joiUtils.validateThrow(params, schema);
  }

  public validateListQuery(params: ITeamQuery) {
    const schema = joi.object().keys(teamListConstraint);
  
    joiUtils.validateThrow(params, schema);
  }
}

export const TeamValidator = new TeamValidatorService();

export const newTeamConstraint = {
  name: joi.string().required().label('Team Name'),
  userIds: joi.array().items(joi.string().alphanum()).label('User IDs'),
}

export const teamListConstraint = {
  name: joi.string().label('Team Name'),
  _id: joi.string().label('Team IDs'),
  userId: joi.string().label('User IDs'),
  excludeUserId: joi.string().label('Excluded User IDs'),
  sort: joi.string().label("Sort"),
  limit: joi.number().min(1).label("Limit"),
  offset: joi.number().min(0).label("Offset"),
}