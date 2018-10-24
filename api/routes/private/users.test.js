const {doMock} = require('../../../tests/jest-utils');
const ObjectId = require('mongoose').Types.ObjectId;

doMock('api/utils/rest');

doMock('mongoose', () => {
  const User = {
    save: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  };

  return {
    Types: {
      ObjectId,
    },
    model(modelName) {
      return {User}[modelName];
    },
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

const users = require('./users');

describe('users', () => {
  describe('updateOne()', () => {
    test('updates a user', async () => {
      const req = {
        context: {
          user: {
            firstName: 'stephen',
            lastName: 'wright',
            save: jest.fn().mockReturnThis()
          }
        },

        body: {
          firstName: 'isaac',
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      await users.__updateOne(req, res);
      expect(res.json).toHaveBeenCalledTimes(1);
    })
  })

  describe('search()', () => {
    test('throws error for missing search parameter', async () => {
      const req = {
        query: {},
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      await users.__search(req, res);
      expect(res.error).toHaveBeenCalledWith({message: 'Please enter an email address or name to search', statusCode: 400});
    })

    test('returns search results', async () => {
      const req = {
        query: {
          q: 'stephen@test.com'
        },
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('User')
      .find.mockResolvedValue([{email: 'stephen@test.com', password: 'DFGDFHTHESWS'}])

      await users.__search(req, res);
      expect(res.json).toHaveBeenCalledWith([{email: 'stephen@test.com', password: 'DFGDFHTHESWS'}]);
    })
  })

  describe('getOne()', () => {
    test('fails due to missing UserID', async () => {
      const req = {
        params: {}
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      await users.__getOne(req, res);
      expect(res.error).toHaveBeenCalledWith({message: 'UserID is required', statusCode: 400});
    })

    test('fails due to user not found', async () => {
      const req = {
        params: {
          id: '112233445566'
        },
        query: {}
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('User')
      .findById.mockResolvedValue(null)

      await users.__getOne(req, res);
      expect(res.error).toHaveBeenCalledWith({message: 'User not found', statusCode: 404});
    })

    test('returns an unpopulated user', async () => {
      const req = {
        params: {
          id: '112233445566'
        },
        query: {}
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('User')
      .findById.mockResolvedValue({email: 'stephen@test.com', password: 'DSFSDGDFSGFG'})

      await users.__getOne(req, res);
      expect(res.json).toHaveBeenCalledWith({email: 'stephen@test.com', password: 'DSFSDGDFSGFG'});
    })

    test('returns a unpopulated user', async () => {
      const req = {
        params: {
          id: '112233445566'
        },
        query: {
          teams: true,
          leagues: true,
          fixtures: true,
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('User')
      .findById.mockResolvedValue({
        email: 'stephen@test.com', 
        password: 'DSFSDGDFSGFG',
        teams: [{_id: '1234567890', name: 'Wriggle'}],
        leagues: [{_id: '1234567890', name: 'Premier league'}],
        fixtures: [{_id: '1234567890', teams: []}],
        populate: jest.fn().mockReturnThis(),
        execPopulate: jest.fn().mockReturnThis()
      })

      await users.__getOne(req, res);
      expect(res.json).toHaveBeenCalledTimes(1);
    })
  })
});