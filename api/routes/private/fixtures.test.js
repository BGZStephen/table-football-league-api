const {doMock} = require('../../../tests/jest-utils');
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment');

doMock('api/utils/rest');
doMock('validate.js');

doMock('mongoose', () => {
  const Fixture = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
  };

  const Team = {
    findById: jest.fn(),
  }

  return {
    Types: {
      ObjectId,
    },
    model(modelName) {
      return {Fixture, Team}[modelName];
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

  describe('create()', () => {
    test('fails due to no fixture date being sent', async() => {

      const req = {
        context: {
          user: {
            _id: '112233445566'
          }
        },
        body: {}
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('validate.js').mockReturnValue('Date is required');

      await fixtures.__create(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'Date is required', statusCode: 400})
    })

    test('fails due to fixture date being in the past', async() => {

      const req = {
        context: {
          user: {
            _id: '112233445566'
          }
        },
        body: {
          date: moment().subtract(2, 'days')
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await fixtures.__create(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'Fixture dates must be in the future', statusCode: 400})
    })

    test('fails due no teams being sent', async() => {
      const req = {
        context: {
          user: {
            _id: '112233445566'
          }
        },
        body: {
          date: moment().add(1, 'days'),
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await fixtures.__create(req, res)
      expect(res.error).toHaveBeenCalledWith({message: '2 Teams are required for a fixture', statusCode: 400})
    })

    test('fails due to minimum of 2 teams not being met', async() => {
      const req = {
        context: {
          user: {
            _id: '112233445566'
          }
        },
        body: {
          date: moment().add(1, 'days'),
          teams: []
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await fixtures.__create(req, res)
      expect(res.error).toHaveBeenCalledWith({message: '2 Teams are required for a fixture', statusCode: 400})
    })

    test('fails due to one or both teams not being found', async() => {
      const req = {
        context: {
          user: {
            _id: '112233445566'
          }
        },
        body: {
          date: moment().add(1, 'days'),
          teams: ['112233445566', '998877665544']
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('Team').findById.mockResolvedValue(null)

      await fixtures.__create(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'Team not found', statusCode: 400})
    })

    test('fails due to both teams containing the same player', async() => {
      const req = {
        context: {
          user: {
            _id: '112233445566'
          }
        },
        body: {
          date: moment().add(1, 'days'),
          teams: ['112233445566', '998877665544']
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('Team').findById
      .mockReturnValueOnce({
        players: [
          {
            _id: '112233445566'
          },
          {
            _id: '223344556677'
          }
        ]
      })
      .mockReturnValueOnce({
        players: [
          {
            _id: '112233445566'
          },
          {
            _id: '334455667788'
          }
        ]
      })

      await fixtures.__create(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'Fixtures cannot contain teams with the same players', statusCode: 400})
    })

    test('creates a fixture', async() => {
      const req = {
        context: {
          user: {
            _id: '112233445566'
          }
        },
        body: {
          date: moment().add(1, 'days'),
          teams: ['112233445566', '998877665544']
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('Team').findById
      .mockReturnValueOnce({
        players: [
          {
            _id: '112233445566'
          },
          {
            _id: '223344556677'
          }
        ]
      })
      .mockReturnValueOnce({
        players: [
          {
            _id: '445566778899'
          },
          {
            _id: '334455667788'
          }
        ]
      })

      require('mongoose').model('Fixture').create.mockResolvedValue({
        save: jest.fn().mockResolvedValue({
          date: moment().add(1, 'days'),
          teams: ['112233445566', '998877665544']
        }),
      })

      await fixtures.__create(req, res)
      expect(res.json).toHaveBeenCalledTimes(1)
    })
  })

  describe('search()', () => {
    test('returns unpopulated search', async () => {
      const req = {
        query: {}
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('Fixture').find.mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([{date: moment().startOf('d').valueOf}])
      })
    

      await fixtures.__search(req, res)
      expect(res.json).toHaveBeenCalledWith([{date: moment().startOf('d').valueOf}])
    })

    test('returns populated search', async () => {
      const req = {
        query: {
          teams: true
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('Fixture').find.mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([
          {
            date: moment().startOf('d').valueOf,
            teams: [{name: 'WRIGGLE FC'}, {name: 'WRIGGLE UTD'}]
          }
        ])
      })
    

      await fixtures.__search(req, res)
      expect(res.json).toHaveBeenCalledWith([
        {
          date: moment().startOf('d').valueOf,
          teams: [{name: 'WRIGGLE FC'}, {name: 'WRIGGLE UTD'}]
        }
      ])
    })

    test('returns limited search', async () => {
      const req = {
        query: {
          limit: 1,
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('Fixture').find.mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([
          {
            date: moment().startOf('d').valueOf,
            teams: [{name: 'WRIGGLE FC'}, {name: 'WRIGGLE UTD'}]
          }
        ])
      })
    

      await fixtures.__search(req, res)
      expect(res.json).toHaveBeenCalledWith([
        {
          date: moment().startOf('d').valueOf,
          teams: [{name: 'WRIGGLE FC'}, {name: 'WRIGGLE UTD'}]
        }
      ])
    })

    test('returns populated search with player filtering', async () => {
      const req = {
        query: {
          limit: 1,
          teams: true,
          player: '112233445566'
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('Fixture').find.mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([
          {
            date: moment().startOf('d').valueOf,
            teams: [
              {
                name: 'WRIGGLE FC',
                players: ['112233445566', '223344556677']
              }, 
              {
                name: 'WRIGGLE UTD',
                players: ['334455667788', '445566778899']
              }
            ]
          },
          {
            date: moment().startOf('d').valueOf,
            teams: [
              {
                name: 'FC WRIGGLE',
                players: ['223344556677', '334455667788']
              }, 
              {
                name: 'AFC WRIGGLE',
                players: ['445566778899', '556677889900']
              }
            ]
          }
        ])
      })
    

      await fixtures.__search(req, res)
      expect(res.json).toHaveBeenCalledWith([
        {
          date: moment().startOf('d').valueOf,
          teams: [
            {
              name: 'WRIGGLE FC',
              players: ['112233445566', '223344556677']
            }, 
            {
              name: 'WRIGGLE UTD',
              players: ['334455667788', '445566778899']
            }
          ]
        }
      ])
    })
  })

  describe('updateOne()', () => {
    test('update fails as fixture date is in the past', async () => {
      const req = {
        body: {
          date: moment().subtract(2, 'd').startOf('d').valueOf()
        },
        context: {
          fixture: {
            date: moment().add(1, 'd').startOf('d').valueOf()
          }
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await fixtures.__updateOne(req, res);
      expect(res.error).toHaveBeenCalledWith({message: 'Fixture dates must be in the future', statusCode: 400})
    })

    test('fails due to minimum of 2 teams not being met', async() => {
      const req = {
        context: {
          user: {
            _id: '112233445566'
          },
          fixture: {
            date: moment().add(1, 'days').valueOf(),
          }
        },
        body: {
          date: moment().add(2, 'days').valueOf(),
          teams: []
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await fixtures.__updateOne(req, res)
      expect(res.error).toHaveBeenCalledWith({message: '2 Teams are required for a fixture', statusCode: 400})
    })

    test('fails due to one or both teams not being found', async() => {
      const req = {
        context: {
          user: {
            _id: '112233445566'
          },
          fixture: {
            teams: []
          }
        },
        body: {
          teams: ['112233445566', '998877665544']
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('Team').findById.mockResolvedValue(null)

      await fixtures.__updateOne(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'Team not found', statusCode: 400})
    })

    test('fails due to both teams containing the same player', async() => {
      const req = {
        context: {
          user: {
            _id: '112233445566'
          },
          fixture: {
            date: moment().add(1, 'days'),
            teams: [],
          }
        },
        body: {
          date: moment().add(1, 'days'),
          teams: ['112233445566', '998877665544']
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('Team').findById
      .mockReturnValueOnce({
        players: [
          {
            _id: '112233445566'
          },
          {
            _id: '223344556677'
          }
        ]
      })
      .mockReturnValueOnce({
        players: [
          {
            _id: '112233445566'
          },
          {
            _id: '334455667788'
          }
        ]
      })

      await fixtures.__updateOne(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'Fixtures cannot contain teams with the same players', statusCode: 400})
    })

    test('updates a fixtures teams', async() => {
      const req = {
        context: {
          user: {
            _id: '112233445566'
          },
          fixture: {
            date: moment().add(1, 'days'),
            teams: ['223344556677', '334455667788'],
            save: jest.fn(),
          }
        },
        body: {
          date: moment().add(1, 'days'),
          teams: ['112233445566', '998877665544']
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('Team').findById
      .mockReturnValueOnce({
        players: [
          {
            _id: '112233445566'
          },
          {
            _id: '223344556677'
          }
        ]
      })
      .mockReturnValueOnce({
        players: [
          {
            _id: '445566778899'
          },
          {
            _id: '334455667788'
          }
        ]
      })

      await fixtures.__updateOne(req, res)
      expect(req.context.fixture.teams).toEqual(['112233445566', '998877665544'])
      expect(res.json).toHaveBeenCalledTimes(1)
    })
  })
})