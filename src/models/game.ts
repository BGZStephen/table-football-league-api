import { Schema, Model, model, Document } from 'mongoose';
import * as _ from 'lodash';
import { ITeam, TeamModel } from './team';
import { UserModel, IUser } from './user';

interface ITeamFormation {
  offence: IUser;
  defence: IUser;
}

export interface IGame extends Document {
  _id: string;
  createdOn: Date;
  updatedOn?: Date;
  homeTeam: ITeam;
  awayTeam: ITeam;
  score: {
    homeTeam: number;
    awayTeam: number;
  };
  startDate: Date;
  endDate: Date;
  startingPositions: {
    homeTeam: ITeamFormation;
    awayTeam: ITeamFormation;
  };
  submitted: {
    homeTeam: boolean;
    awayTeam: boolean;
  }
}

const GameSchema = new Schema({
  createdOn: {type: Date, default: () => new Date()},
  updatedOn: {type: Date},
  homeTeam: {type: TeamModel.schema},
  awayTeam: {type: TeamModel.schema},
  startDate: {type: Date},
  endDate: {type: Date},
  score: {
    homeTeam: {type: Number, required: true, default: 0},
    awayTeam: {type: Number, required: true, default: 0}
  },
  startingPositions: {
    homeTeam: {
      offence: {type: UserModel.schema},
      defence: {type: UserModel.schema}
    },
    awayTeam: {
      offence: {type: UserModel.schema},
      defence: {type: UserModel.schema}
    }
  },
  submitted: {
    homeTeam: {type: Boolean},
    awayTeam: {type: Boolean}
  }
})

export const GameModel: Model<IGame> = model<IGame>('Game', GameSchema);
