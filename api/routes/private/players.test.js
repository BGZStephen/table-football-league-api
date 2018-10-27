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

  const User = {
    findById: jest.fn(),
  }

  return {
    Types: {
      ObjectId,
    },
    model(modelName) {
      return {User, Player}[modelName];
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

  describe('getOne()', () => {
    test('returns user from context', async () => {
      const req = {
        context: {
          player: {
            name: 'stephen',
          }
        }
      }

      const res = {
        json: jest.fn(),
      }

      await players.__getOne(req, res)
      expect(res.json).toHaveBeenCalledWith({name: 'stephen'})
    })
  })

  describe('search()', () => {
    test('returns users from search', async () => {
      const req = {
        query: {}
      }

      const res = {
        json: jest.fn(),
      }

      require('mongoose').model('Player').find.mockResolvedValue([{name: 'stephen'}, {name: 'lydia'}])

      await players.__search(req, res)
      expect(res.json).toHaveBeenCalledWith([{name: 'stephen'}, {name: 'lydia'}])
    })

    test('returns users from name based search', async () => {
      const req = {
        query: {
          name: 'stephen'
        }
      }

      const res = {
        json: jest.fn(),
      }

      require('mongoose').model('Player').find.mockResolvedValue([{name: 'stephen'}])

      await players.__search(req, res)
      expect(res.json).toHaveBeenCalledWith([{name: 'stephen'}])
    })
  })

  describe('updateOne()', () => {
    test('update fails as cannot find user to assign to player', async () => {
      const req = {
        body: {
          userId: '112233445566'
        },
        context: {
          player: {
            name: 'stephen',
          }
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('User').findById.mockResolvedValue(null);
      await players.__updateOne(req, res)
      expect(res.error).toHaveBeenCalledWith({statusCode: 400, message: 'User not found'})
    })

    test('update fails as user is already assigned to another player', async () => {
      const req = {
        body: {
          userId: '112233445566'
        },
        context: {
          player: {
            name: 'stephen',
          }
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('User').findById.mockResolvedValue({_id: '112233445566', firstName: 'stephen'});
      require('mongoose').model('Player').findOne.mockResolvedValue({name: 'lydia'});
      await players.__updateOne(req, res)
      expect(res.error).toHaveBeenCalledWith({statusCode: 400, message: 'User already has an assigned player'})
    })

    test('update to userID passes', async () => {
      const req = {
        body: {
          userId: '112233445566'
        },
        context: {
          player: {
            name: 'stephen',
            save: jest.fn(),
          }
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      require('mongoose').model('User').findById.mockResolvedValue({_id: '112233445566', firstName: 'stephen'});
      require('mongoose').model('Player').findOne.mockResolvedValue(null);
      await players.__updateOne(req, res)
      expect(req.context.player.save).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledTimes(1)
    })

    test('update to name passes', async () => {
      const req = {
        body: {
          name: 'lydia'
        },
        context: {
          player: {
            name: 'stephen',
            save: jest.fn(),
          }
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await players.__updateOne(req, res)
      expect(req.context.player.name).toBe('lydia')
      expect(res.json).toHaveBeenCalledTimes(1)
    })

    test('removes userId linked with player', async () => {
      const req = {
        body: {
          userId: null
        },
        context: {
          player: {
            name: 'stephen',
            userId: '112233445566',
            save: jest.fn(),
          }
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await players.__updateOne(req, res)
      expect(req.context.player.userId).toBe(null)
      expect(res.json).toHaveBeenCalledTimes(1)
    })

    test('updates user positions with true values', async () => {
      const req = {
        body: {
          position: {
            striker: true,
            defender: true,
          }
        },
        context: {
          player: {
            name: 'stephen',
            save: jest.fn(),
            position: {
              striker: false,
              defender: false,
            }
          }
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await players.__updateOne(req, res)
      expect(req.context.player.position).toEqual({striker: true, defender: true})
      expect(res.json).toHaveBeenCalledTimes(1)
    })

    test('updates user positions with strict false values', async () => {
      const req = {
        body: {
          position: {
            striker: false,
            defender: false,
          }
        },
        context: {
          player: {
            name: 'stephen',
            save: jest.fn(),
            position: {
              striker: true,
              defender: true,
            }
          }
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await players.__updateOne(req, res)
      expect(req.context.player.position).toEqual({striker: false, defender: false})
      expect(res.json).toHaveBeenCalledTimes(1)
    })

    test('doesn\'t update user positions of they are null', async () => {
      const req = {
        body: {
          position: {
            striker: null,
            defender: null,
          }
        },
        context: {
          player: {
            name: 'stephen',
            save: jest.fn(),
            position: {
              striker: false,
              defender: false,
            }
          }
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      await players.__updateOne(req, res)
      expect(req.context.player.position).toEqual({striker: false, defender: false})
      expect(res.json).toHaveBeenCalledTimes(1)
    })
  })
})