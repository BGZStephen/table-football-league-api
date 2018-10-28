const {doMock} = require('../../../tests/jest-utils');
const ObjectId = require('mongoose').Types.ObjectId;

doMock('api/utils/rest');
doMock('validate.js');

doMock('mongoose', () => {
  const League = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
  };

  return {
    Types: {
      ObjectId,
    },
    model(modelName) {
      return {League}[modelName];
    },
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

const leagues = require('./leagues');

describe('leagues', () => {
  describe('load()', () => {
    test('fails to load a league due to a missing leagueID', async () => {
      const req = {
        body: {},
        params: {},
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await leagues.__load(req, res);
      expect(res.error).toHaveBeenCalledWith({statusCode: 400, message: 'LeagueID is required'})
    })

    test('fails to load as league not found', async () => {
      const req = {
        body: {
          id: '665544332211'
        },
        params: {},
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('League').findById.mockResolvedValue(null)

      await leagues.__load(req, res);
      expect(res.error).toHaveBeenCalledWith({statusCode: 404, message: 'League not found'})
    })

    test('loads a league into context', async () => {
      const req = {
        body: {
          id: '112233445566'
        },
        params: {},
        context: {},
      }
  
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }
  
      const next = jest.fn();
  
      require('mongoose').model('League').findById.mockResolvedValue({
        id: '112233445566',
        name: 'PREMIER LEAGUE'
      })
  
      await leagues.__load(req, res, next);
      expect(req.context.league).toEqual({
        id: '112233445566',
        name: 'PREMIER LEAGUE'
      })
      expect(next).toHaveBeenCalledTimes(1);
    })
  })
})