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

doMock('jsonwebtoken', () => {
  return {
    verify: jest.fn(),
  }
})

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

  describe('validateUser()', async () => {
    test('fails due to invalid token', async () => {
      const req = {}
  
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }
  
      require('jsonwebtoken').verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
  
      await authentication.validateUser(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'Unauthorized', statusCode: 403})
    })

    test('fails due to lack of id within decoded token', async () => {
      const req = {
        headers: {
          'x-access-token': 'valid-access-token'
        }
      }
  
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }
  
      require('jsonwebtoken').verify.mockResolvedValue({
        data: {}
      });
  
      await authentication.validateUser(req, res)
      expect(res.error).toHaveBeenCalledWith({message: 'Invalid token', statusCode: 401})
    })

    test('fails due to lack of id within decoded token', async () => {
      const req = {
        headers: {
          'x-access-token': 'valid-access-token'
        },
        context: {}
      }
  
      const res = {
        json: jest.fn(),
        error: jest.fn(),
      }

      const next = jest.fn()
  
      require('jsonwebtoken').verify.mockResolvedValue({
        data: {
          id: '112233445566'
        }
      });
  
      await authentication.validateUser(req, res, next)
      expect(next).toHaveBeenCalledTimes(1)
    })
  })
})