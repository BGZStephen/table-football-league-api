const {doMock} = require('../../../tests/jest-utils');
const ObjectId = require('mongoose').Types.ObjectId;

doMock('mongoose', () => {
  const User = {
    save: jest.fn(),
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
});