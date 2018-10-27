const {doMock} = require('../../../tests/jest-utils');
const ObjectId = require('mongoose').Types.ObjectId;

doMock('api/utils/rest');
doMock('validate.js');

doMock('mongoose', () => {
  const Player = {
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
      return {Player}[modelName];
    },
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

const players = require('./players');

describe('players', () => {
  describe('load()', () => {
    test('fails to load a player due to a missing playerID', async () => {
      const req = {
        body: {},
        params: {},
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await players.__load(req, res);
      expect(res.error).toHaveBeenCalledWith({statusCode: 400, message: 'PlayerID is required'})
    })

    test('fails to load as player not found', async () => {
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

      require('mongoose').model('Player').findById.mockResolvedValue(null)

      await players.__load(req, res);
      expect(res.error).toHaveBeenCalledWith({statusCode: 404, message: 'Player not found'})
    })

    test('loads a player into context', async () => {
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
  
      require('mongoose').model('Player').findById.mockResolvedValue({
        id: '112233445566',
        name: 'stephen'
      })
  
      await players.__load(req, res, next);
      expect(req.context.player).toEqual({
        id: '112233445566',
        name: 'stephen'
      })
      expect(next).toHaveBeenCalledTimes(1);
    })
  })

  describe('create()', () => {
    test('fails creation due to missing player name', async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      };
      require('validate.js').mockReturnValue('Player name is required')

      await players.__create(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'Player name is required', statusCode: 400})
    })

    test('fails creation due to player already existing with that name', async () => {
      const req = {
        body: {
          name: 'stephen'
        }
      };
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      };
      require('validate.js').mockReturnValue(null)
      require('mongoose').model('Player').findOne.mockResolvedValue({
        name: 'stephen'
      })

      await players.__create(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'Player already exists', statusCode: 400})
    })

    test('creates player', async () => {
      const req = {
        body: {
          name: 'reuben'
        },
        context: {
          user: {
            _id: '112233445566'
          }
        }
      };
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      };
      require('validate.js').mockReturnValue(null)
      require('mongoose').model('Player').findOne.mockResolvedValue(null)
      require('mongoose').model('Player').create.mockResolvedValue({
        name: 'reuben',
      })

      await players.__create(req, res)
      expect(res.json).toHaveBeenCalledWith({
        name: 'reuben',
      })
    })
  })
})