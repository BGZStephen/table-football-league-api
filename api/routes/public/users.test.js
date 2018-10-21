const {doMock} = require('../../../tests/jest-utils');
const ObjectId = require('mongoose').Types.ObjectId;

doMock('validate.js')
doMock('api/domain/user/password-reset')
doMock('api/services/mail')
doMock('api/config', () => ({
  jwtSecret: 'working',
}));

doMock('mongoose', () => {
  const User = {
    find: jest.fn(),
    findOne: jest.fn(),
    isPasswordValid: jest.fn(),
  };

  const PasswordReset = {
    findOne: jest.fn(),
  };

  return {
    Types: {
      ObjectId,
    },
    model(modelName) {
      return {User, PasswordReset}[modelName];
    },
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

const users = require('./users');

describe('users', () => {
  describe('authenticate()', () => {
    test('authentication passes', async () => {    
      const req = {
        body: {
          email: 'stephen@test.com',
          password: 'password',
        }
      }

      const res = {
        json: jest.fn()
      }

      require('validate.js')
      .mockReturnValue(null);

      require('mongoose')
      .model('User')
      .findOne.mockResolvedValue({
        email: 'stephen@test.com',
        // password would be hashed
        password: 'FDSGFSGGNRSHRSA',
        isPasswordValid: jest.fn().mockReturnValue(true)
      });

      await users.authenticate(req, res);
      expect(res.json).toHaveBeenCalledTimes(1);
    })

    test('authentication fails with incorrect password', async () => {    
      const req = {
        body: {
          email: 'stephen@test.com',
          password: 'incorrect password',
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('User')
      .findOne.mockResolvedValue({
        email: 'stephen@test.com',
        // password would be hashed
        password: 'FDSGFSGGNRSHRSA',
        isPasswordValid: jest.fn().mockReturnValue(false)
      });

      await users.authenticate(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('authentication fails with missing email', async () => {    
      const req = {
        body: {
          password: 'password',
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
      .mockReturnValue('Email address is required');

      await users.authenticate(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('authentication fails with missing email', async () => {    
      const req = {
        body: {
          email: 'stephen@test.com'
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
      .mockReturnValue(null);

      require('mongoose')
      .model('User')
      .findOne.mockResolvedValue(null);

      await users.authenticate(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('authentication fails for no matching user', async () => {    
      const req = {
        body: {
          email: 'stephen@not-test.com',
          password: 'password'
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
      .mockReturnValue('Password address is required');

      await users.authenticate(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })
  })

  describe('checkPasswordResetToken()', () => {
    test('fails due to missing supplied token', async () => {    
      const req = {
        query: {}
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      await users.checkPasswordResetToken(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('fails due to token supplied not matching stored tokens', async () => {    
      const req = {
        query: {
          token: 'not-a-valid-token'
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('PasswordReset')
      .findOne.mockResolvedValue(null);

      await users.checkPasswordResetToken(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('fails due to matched token being expired', async () => {    
      const req = {
        query: {
          token: 'valid-token'
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('PasswordReset')
      .findOne.mockResolvedValue({
        token: 'valid-token',
        expiry: (Date.now() - 20000)
      });

      await users.checkPasswordResetToken(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('passes with valid token that is not expired', async () => {    
      const req = {
        query: {
          token: 'valid-token'
        }
      }

      const res = {
        sendStatus: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('PasswordReset')
      .findOne.mockResolvedValue({
        token: 'valid-token',
        expiry: (Date.now() + 20000)
      });

      await users.checkPasswordResetToken(req, res);
      expect(res.sendStatus).toHaveBeenCalledTimes(1);
    })
  })
  describe('createPasswordReset()', () => {
    test('fails due to missing email', async () => {    
      const req = {
        body: {}
      }

      const res = {
        sendStatus: jest.fn(),
        error: jest.fn()
      }

      await users.createPasswordReset(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('fails due to email not matching any users', async () => {    
      const req = {
        body: {
          email: 'stephen@not-test.com'
        }
      }

      const res = {
        sendStatus: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('User')
      .findOne.mockResolvedValue(null);

      await users.createPasswordReset(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('passes when matching user is found', async () => {    
      const req = {
        body: {
          email: 'stephen@test.com'
        }
      }

      const res = {
        sendStatus: jest.fn(),
        error: jest.fn()
      }

      require('mongoose')
      .model('User')
      .findOne.mockResolvedValue({
        email: 'stephen@test.com'
      });

      require('api/domain/user/password-reset')
      .createPasswordReset.mockResolvedValue('test-token')

      require('api/domain/user/password-reset')
      .generatePasswordResetUrl.mockReturnValue('http://localhost:9000/password-reset/test-token');

      await users.createPasswordReset(req, res);
      expect(res.sendStatus).toHaveBeenCalledTimes(1);
    })
  })
});