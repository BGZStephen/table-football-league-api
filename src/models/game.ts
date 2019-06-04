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
  createdOn: string;
  updatedOn?: string;
  homeTeam: ITeam;
  awayTeam: ITeam;
  homeTeamReady: boolean;
  awayTeamReady: boolean;
  score: {
    homeTeam: number;
    awayTeam: number;
  };
  startDate: string;
  endDate: string;
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
  createdOn: {type: Date, required: true, default: () => new Date().toISOString()},
  updatedOn: {type: Date},
  homeTeam: {type: TeamModel.schema, required: true},
  awayTeam: {type: TeamModel.schema, required: true},
  startDate: {type: Date},
  endDate: {type: Date},
  score: {
    homeTeam: {type: Number, required: true, default: 0},
    awayTeam: {type: Number, required: true, default: 0}
  },
  homeTeamReady: {type: Boolean, default: false},
  awayTeamReady: {type: Boolean, default: false},
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
    homeTeam: {type: Boolean, required: true, default: false},
    awayTeam: {type: Boolean, required: true, default: false}
  }
})

export const GameModel: Model<IGame> = model<IGame>('Game', GameSchema);
