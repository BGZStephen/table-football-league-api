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

  describe('getOne()', () => {
    test('gets an unpopulated league', async () => {
      const req = {
        context: {
          league: {
            name: 'PREMIER LEAGUE'
          }
        },
        query: {}
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await leagues.__getOne(req, res)
      expect(res.json).toHaveBeenCalledWith({name: 'PREMIER LEAGUE'})
    })

    test('gets an populated league', async () => {
      const req = {
        context: {
          league: {
            name: 'PREMIER LEAGUE',
            populate: jest.fn().mockReturnThis(),
            execPopulate: jest.fn(),
          }
        },
        query: {
          teams: true,
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await leagues.__getOne(req, res)
      expect(req.context.league.execPopulate).toHaveBeenCalledTimes(1);
    })
  })

  describe('search()', () => {
    test('returns an unfiltered search', async () => {
      const req = {
        query: {}
      }
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose')
      .model('League')
      .find.mockResolvedValue({
        name: 'PREMIER LEAGUE'
      })

      await leagues.__search(req, res);
      expect(res.json).toHaveBeenCalledWith({
        name: 'PREMIER LEAGUE'
      })
    })

    test('returns an filtered search', async () => {
      const req = {
        query: {
          name: 'EUROPA LEAGUE'
        }
      }
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose')
      .model('League')
      .find.mockResolvedValue({
        name: 'EUROPA LEAGUE'
      })

      await leagues.__search(req, res);
      expect(res.json).toHaveBeenCalledWith({
        name: 'EUROPA LEAGUE'
      })
    })
  })

  describe('create()', () => {
    test('fails creation as no league name is provided', async () => {
      const req = {
        body: {},
      }
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await leagues.__create(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'League name is required', statusCode: 400})
    })

    test('fails creation as a league already exists with the name supplied', async () => {
      const req = {
        body: {
          name: 'PREMIER LEAGUE'
        },
      }
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose')
      .model('League')
      .findOne.mockResolvedValue({name: 'PREMIER LEAGUE'})

      await leagues.__create(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'A league with that name already exists', statusCode: 400})
    })

    test('fails creation as a league doesn\'t have the minimum 3 teams', async () => {
      const req = {
        body: {
          name: 'PREMIER LEAGUE',
          teams: []
        },
      }
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose')
      .model('League')
      .findOne.mockResolvedValue(null)

      await leagues.__create(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'A league requires a minimum of 3 teams', statusCode: 400})
    })

    test('fails creation as a league doesn\'t have a defined number of games per season', async () => {
      const req = {
        body: {
          name: 'PREMIER LEAGUE',
          teams: [{id: '112233445566'}, {id: '223344556677'}, {id: '334455667788'}]
        },
      }
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose')
      .model('League')
      .findOne.mockResolvedValue(null)

      await leagues.__create(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'Games Per Season is required', statusCode: 400})
    })

    test('creates a league', async () => {
      const req = {
        body: {
          name: 'PREMIER LEAGUE',
          teams: [{id: '112233445566'}, {id: '223344556677'}, {id: '334455667788'}],
          gamesPerSeason: 2,
        },
        context: {
          user: {
            _id: '112233445566'
          }
        }
      }
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose')
      .model('League')
      .findOne.mockResolvedValue(null)

      require('mongoose')
      .model('League')
      .create.mockResolvedValue({
        name: 'PREMIER LEAGUE',
        teams: [{id: '112233445566'}, {id: '223344556677'}, {id: '334455667788'}],
        gamesPerSeason: 2,
        generateFixtures: jest.fn(),
      })

      await leagues.__create(req, res)
      expect(res.json).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateOne()', () => {
    test('fails update as a league with that name already exists', async () => {
      const req = {
        body: {
          name: 'ROAD TO WORLD CUP'
        },
        context: {
          league: {
            name: 'ROAD TO WORLD CUP',
          }
        }
      }
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('League').findOne.mockResolvedValue({
        name: 'ROAD TO WORLD CUP'
      })

      await leagues.__updateOne(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'A league with that name already exists', statusCode: 400})
    })

    test('updates a leagues name', async () => {
      const req = {
        body: {
          name: 'ROAD TO WORLD CUP'
        },
        context: {
          league: {
            name: 'WORLD CUP 2018',
            save: jest.fn()
          }
        }
      }
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('League').findOne.mockResolvedValue(null)

      await leagues.__updateOne(req, res)
      expect(req.context.league.name).toEqual('ROAD TO WORLD CUP')
      expect(req.context.league.save).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1)
    })

    test('update passes with no changes', async () => {
      const req = {
        body: {},
        context: {
          league: {
            name: 'WORLD CUP 2018',
            save: jest.fn()
          }
        }
      }
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('League').findOne.mockResolvedValue(null)

      await leagues.__updateOne(req, res)
      expect(res.json).toHaveBeenCalledTimes(1)
    })
  })
})