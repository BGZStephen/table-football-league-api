const {doMock} = require('../../../tests/jest-utils');
const ObjectId = require('mongoose').Types.ObjectId;

doMock('api/utils/rest');

doMock('mongoose', () => {
  const User = {
    save: jest.fn(),
    find: jest.fn(),
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
});