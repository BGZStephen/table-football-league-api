const {doMock} = require('../../../tests/jest-utils');
const ObjectId = require('mongoose').Types.ObjectId;

doMock('api/utils/rest');
doMock('validate.js');

doMock('mongoose', () => {
  const Fixture = {
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
      return {Fixture}[modelName];
    },
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

const fixtures = require('./fixtures');

describe('fixtures', () => {
  describe('load()', () => {
    test('fails to load a fixture due to a missing fixtureID', async () => {
      const req = {
        body: {},
        params: {},
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await fixtures.__load(req, res);
      expect(res.error).toHaveBeenCalledWith({statusCode: 400, message: 'FixtureID is required'})
    })

    test('fails to load as fixture not found', async () => {
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

      require('mongoose').model('Fixture').findById.mockResolvedValue(null)

      await fixtures.__load(req, res);
      expect(res.error).toHaveBeenCalledWith({statusCode: 404, message: 'Fixture not found'})
    })

    test('loads a fixture into context', async () => {
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
  
      require('mongoose').model('Fixture').findById.mockResolvedValue({
        id: '112233445566',
        teams: [
          {name: 'WRIGGLE FC'},
          {name: 'WRIGGLE UNITED'}
        ]
      })
  
      await fixtures.__load(req, res, next);
      expect(req.context.fixture).toEqual({
        id: '112233445566',
        teams: [
          {name: 'WRIGGLE FC'},
          {name: 'WRIGGLE UNITED'}
        ]
      })
      expect(next).toHaveBeenCalledTimes(1);
    })
  })

  describe('getOne()', () => {
    test('returns a non-populated fixture', async () => {
      const req = {
        query: {},
        context: {
          fixture: {
            _id: '112233445566',
            teams: [{name: 'WRIGGLE FC'}, {name: 'WRIGGLE UTD'}]
          }
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await fixtures.__getOne(req, res)
      expect(res.json).toHaveBeenCalledWith({
        _id: '112233445566',
        teams: [
          {
            name: 'WRIGGLE FC'
          },
          {
            name: 'WRIGGLE UTD'
          }
        ]
      })
    })

    test('returns a populated fixture', async () => {
      const req = {
        query: {
          teams: true,
          players: true,
        },
        context: {
          fixture: {
            _id: '112233445566',
            teams: [{name: 'WRIGGLE FC'}, {name: 'WRIGGLE UTD'}],
            populate: jest.fn().mockReturnThis(),
            execPopulate: jest.fn().mockReturnThis()
          }
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await fixtures.__getOne(req, res)
      expect(req.context.fixture.execPopulate).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1)
    })
  })
})