const {doMock} = require('../../../tests/jest-utils');
const ObjectId = require('mongoose').Types.ObjectId;

doMock('api/utils/rest');

doMock('mongoose', () => {
  const Team = {
    save: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  };

  const Player = {
    findById: jest.fn(),
  };

  return {
    Types: {
      ObjectId,
    },
    model(modelName) {
      return {Team, Player}[modelName];
    },
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

const teams = require('./teams');

describe('teams', () => {
  describe('updateOne()', () => {
    test('fails to update a team because of insufficient teams', async () => {
      const req = {
        context: {
          team: {}
        },

        body: {
          players: [],
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      await teams.__updateOne(req, res);
      expect(res.error).toHaveBeenCalledWith({message: 'Teams require at least 2 players', statusCode: 400});
    })

    test('updates a team name', async () => {
      const saveFunction = function() {}
      const req = {
        context: {
          team: {
            name: 'WRIGGLE UNITED',
            save: jest.fn().mockReturnValue(saveFunction)
          }
        },

        body: {
          name: 'WRIGGLE FC'
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      await teams.__updateOne(req, res);
      expect(req.context.team.name).toEqual('WRIGGLE FC')
      expect(res.json).toHaveBeenCalledTimes(1);
    })

    test('fails to update a team as one / multiple players cannot be found', async () => {
      const saveFunction = function() {}
      const req = {
        context: {
          team: {
            name: 'WRIGGLE UNITED',
            players: ['112233445566', '223344556677'],
            save: jest.fn().mockReturnValue(saveFunction)
          }
        },

        body: {
          players: ['334455667788', '445566778899'],
        }
      }

      require('mongoose').model('Player').findById.mockResolvedValue(null)

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      await teams.__updateOne(req, res);
      expect(res.error).toHaveBeenCalledWith({message: 'Player not found', statusCode: 403});
    })

    test('updates a team players', async () => {
      const saveFunction = function() {}
      const req = {
        context: {
          team: {
            name: 'WRIGGLE UNITED',
            players: ['112233445566', '223344556677'],
            save: jest.fn().mockReturnValue(saveFunction)
          }
        },

        body: {
          players: ['334455667788', '445566778899'],
        }
      }

      require('mongoose').model('Player').findById.mockResolvedValue({
        _id: '334455667788'
      })

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      await teams.__updateOne(req, res);
      expect(req.context.team.players).toEqual(['334455667788', '445566778899'])
      expect(res.json).toHaveBeenCalledTimes(1);
    })
  })

  describe('search()', () => {
    test('returns search results', async () => {
      const req = {
        query: {},
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('Team')
      .find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([{name: 'WRIGGLE UTD'}])
      })

      await teams.__search(req, res);
      expect(res.json).toHaveBeenCalledWith([{name: 'WRIGGLE UTD'}]);
    })

    test('returns search results filtered by team name', async () => {
      const req = {
        query: {
          name: 'WRIGGLE FC',
        },
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('Team')
      .find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([{name: 'WRIGGLE FC'}])
      })

      await teams.__search(req, res);
      expect(res.json).toHaveBeenCalledWith([{name: 'WRIGGLE FC'}]);
    })

    test('returns search results with populators', async () => {
      const req = {
        query: {
          players: true,
        },
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('Team')
      .find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([{name: 'WRIGGLE UTD', players: [{firstName: 'stephen'}, {firstName: 'lydia'}]}])
      })

      await teams.__search(req, res);
      expect(res.json).toHaveBeenCalledWith([{name: 'WRIGGLE UTD', players: [{firstName: 'stephen'}, {firstName: 'lydia'}]}]);
    })
  })

  describe('search()', () => {
    test('returns a loaded team', async () => {
      const req = {
        context: {
          team: {
            name: 'WRIGGLE FC'
          },
        },
        query: {}
      }

      const res = {
        json: jest.fn(),
      }

      await teams.__getOne(req, res);
      expect(res.json).toHaveBeenCalledWith({
        name: 'WRIGGLE FC',
      })
    })

    test('returns a populated loaded team', async () => {
      const req = {
        context: {
          team: {
            name: 'WRIGGLE FC',
            players: ['112233445566', '223344556677'],
            populate: jest.fn().mockReturnThis(),
            execPopulate: jest.fn().mockResolvedValue({}),
          },
        },
        query: {
          players: true,
        }
      }

      const res = {
        json: jest.fn(),
      }

      await teams.__getOne(req, res);
      expect(req.context.team.execPopulate).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1)
    })
  })
});