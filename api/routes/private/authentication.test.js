const {doMock} = require('../../../tests/jest-utils');
const ObjectId = require('mongoose').Types.ObjectId;

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

const authentication = require('./authentication');


describe('authentication', () => {
  const res = {
    json: jest.fn(),
    error: jest.fn(),
  }

  const next = jest.fn();

  describe('loadUser()', () => {
    test('fails due to missing userID', async () => {
      const req = {
        context: {}
      }    

      await authentication.loadUser(req, res);
      expect(res.error).toHaveBeenCalledWith({statusCode: 403, message: 'Unauthorized'})
    })

    test('fails due to user not being found', async () => {
      const req = {
        context: {
          userId: '112233445566',
        }
      }

      require('mongoose')
      .model('User')
      .findById.mockResolvedValue(null)

      await authentication.loadUser(req, res);
      expect(res.error).toHaveBeenCalledWith({statusCode: 403, message: 'Unauthorized'})
    })

    test('passes with a user loaded in to context', async () => {
      const req = {
        context: {
          userId: '112233445566',
        },
        user: null
      }

      require('mongoose')
      .model('User')
      .findById.mockResolvedValue({
        email: 'stephen@test.com',
        firstName: 'stephen',
        lastName: 'wright',
      })

      await authentication.loadUser(req, res, next);
      expect(req.context.user).toEqual({
        email: 'stephen@test.com',
        firstName: 'stephen',
        lastName: 'wright',
      })
      expect(next).toHaveBeenCalledTimes(1)
    })
  })
})