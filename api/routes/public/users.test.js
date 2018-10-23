const {doMock} = require('../../../tests/jest-utils');
const ObjectId = require('mongoose').Types.ObjectId;

doMock('validate.js')
doMock('api/domain/user/password-reset')
doMock('api/services/mail')
doMock('api/utils/jwt');

doMock('api/config', () => ({
  jwtSecret: 'working',
}));

doMock('mongoose', () => {
  const User = {
    find: jest.fn(),
    findOne: jest.fn(),
    isPasswordValid: jest.fn(),
    create: jest.fn(),
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
  describe('create()', () => {
    test('creation fails due to missing email', async () => {
      const req = {
        body: {
          firstName: 'stephen',
          lastName: 'wright',
          password: 'password',
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
        .mockReturnValue('Email address is required');

      await users.__create(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('creation fails due to missing first name', async () => {
      const req = {
        body: {
          email: 'stephen@test.com',
          lastName: 'wright',
          password: 'password',
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
        .mockReturnValue('First name is required');

      await users.__create(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('creation fails due to missing last name', async () => {
      const req = {
        body: {
          email: 'stephen@test.com',
          firstName: 'stephen',
          password: 'password',
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
        .mockReturnValue('Last name is required');

      await users.__create(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('creation fails due to missing password', async () => {
      const req = {
        body: {
          email: 'stephen@test.com',
          firstName: 'stephen',
          lastName: 'wright',
        }
      }

      const res = {
        json: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
        .mockReturnValue('Password is required');

      await users.__create(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('creation fails due to existing user with same email', async () => {
      const req = {
        body: {
          email: 'stephen@test.com',
          firstName: 'stephen',
          lastName: 'wright',
          password: 'password'
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
        .findOne.mockReturnValue({
          email: 'stephen@test.com',
          firstName: 'stephen',
          lastName: 'wright',
          password: 'password'
        });

      await users.__create(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('creation succeeds', async () => {
      const req = {
        body: {
          email: 'stephen@test.com',
          firstName: 'stephen',
          lastName: 'wright',
          password: 'password'
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
        .findOne.mockReturnValue(null);

      require('mongoose')
        .model('User')
        .create.mockReturnValue({
          email: 'stephen@test.com',
          firstName: 'stephen',
          lastName: 'wright',
          password: 'password',
          save: jest.fn(),
        });

      await users.__create(req, res);
      expect(res.json).toHaveBeenCalledTimes(1);
    })
  })

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

      await users.__authenticate(req, res);
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

      await users.__authenticate(req, res);
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

      await users.__authenticate(req, res);
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('authentication fails with missing password', async () => {
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

      await users.__authenticate(req, res);
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

      await users.__authenticate(req, res);
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

      await users.__checkPasswordResetToken(req, res);
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

      await users.__checkPasswordResetToken(req, res);
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

      await users.__checkPasswordResetToken(req, res);
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

      await users.__checkPasswordResetToken(req, res);
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

      await users.__createPasswordReset(req, res);
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

      await users.__createPasswordReset(req, res);
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

      await users.__createPasswordReset(req, res);
      expect(res.sendStatus).toHaveBeenCalledTimes(1);
    })
  })

  describe('updateUserFromPasswordReset()', () => {
    test('fails due to missing password', async () => {
      const req = {
        body: {
          password: 'password',
          token: 'a-valid-token',
        }
      }

      const res = {
        sendStatus: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
        .mockReturnValue('Password is required');

      await users.__updateUserFromPasswordReset(req, res)
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('fails due to missing password', async () => {
      const req = {
        body: {
          email: 'stephen',
          token: 'a-valid-token',
        }
      }

      const res = {
        sendStatus: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
        .mockReturnValue('Password is required');

      await users.__updateUserFromPasswordReset(req, res)
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('fails due to missing token', async () => {
      const req = {
        body: {
          email: 'stephen@not-a-test.com',
          password: 'password',
        }
      }

      const res = {
        sendStatus: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
        .mockReturnValue('Token is required');

      await users.__updateUserFromPasswordReset(req, res)
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('fails due to user not being found', async () => {
      const req = {
        body: {
          email: 'stephen@not-a-test.com',
          password: 'password',
          token: 'a-valid-token'
        }
      }

      const res = {
        sendStatus: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
        .mockReturnValue(null);

      require('mongoose')
        .model('User')
        .findOne.mockResolvedValue(null);

      await users.__updateUserFromPasswordReset(req, res)
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('fails due to token not being found', async () => {
      const req = {
        body: {
          email: 'stephen@not-a-test.com',
          password: 'password',
          token: 'a-valid-token'
        }
      }

      const res = {
        sendStatus: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
        .mockReturnValue(null);

      require('mongoose')
        .model('User')
        .findOne.mockResolvedValue({
          email: 'stephen@not-a-test.com',
        });

      require('mongoose')
        .model('PasswordReset')
        .findOne.mockResolvedValue(null);

      await users.__updateUserFromPasswordReset(req, res)
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('fails due to user email not matching token email', async () => {
      const req = {
        body: {
          email: 'stephen@not-a-test.com',
          password: 'password',
          token: 'a-valid-token'
        }
      }

      const res = {
        sendStatus: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
        .mockReturnValue(null);

      require('mongoose')
        .model('User')
        .findOne.mockResolvedValue({
          email: 'stephen@not-a-test.com',
        });

      require('mongoose')
        .model('PasswordReset')
        .findOne.mockResolvedValue({
          email: 'stephen@test.com',
        });

      await users.__updateUserFromPasswordReset(req, res)
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('fails due to token being expired', async () => {
      const req = {
        body: {
          email: 'stephen@not-a-test.com',
          password: 'password',
          token: 'a-valid-token'
        }
      }

      const res = {
        sendStatus: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
        .mockReturnValue(null);

      require('mongoose')
        .model('User')
        .findOne.mockResolvedValue({
          email: 'stephen@not-a-test.com',
        });

      require('mongoose')
        .model('PasswordReset')
        .findOne.mockResolvedValue({
          email: 'stephen@not-a-test.com',
          expiry: (Date.now() - 20000)
        });

      await users.__updateUserFromPasswordReset(req, res)
      expect(res.error).toHaveBeenCalledTimes(1);
    })

    test('passes', async () => {
      const req = {
        body: {
          email: 'stephen@not-a-test.com',
          password: 'password',
          token: 'a-valid-token'
        }
      }

      const res = {
        sendStatus: jest.fn(),
        error: jest.fn()
      }

      require('validate.js')
        .mockReturnValue(null);

      require('mongoose')
        .model('User')
        .findOne.mockResolvedValue({
          email: 'stephen@not-a-test.com',
          save: jest.fn(),
        });

      require('mongoose')
        .model('PasswordReset')
        .findOne.mockResolvedValue({
          email: 'stephen@not-a-test.com',
          expiry: (Date.now() + 20000)
        });

      await users.__updateUserFromPasswordReset(req, res)
      expect(res.sendStatus).toHaveBeenCalledTimes(1);
    })
  })
});