const {doMock} = require('../../../tests/jest-utils');
const moment = require('moment');

doMock('crypto', () => {
  return {
    randomBytes: jest.fn()
  }
})

doMock('mongoose', () => {
  const PasswordReset = {
    create: jest.fn(),
  };

  return {
    model(modelName) {
      return {PasswordReset}[modelName];
    },
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

const passwordReset = require('./password-reset');

describe('password-reset', () => {
  describe('generatePasswordResetUrl()', () => {
    test('link creation failed due to missing dashboard config', async () => {
      passwordReset.__config = {}

      expect(passwordReset.generatePasswordResetUrl).toThrow('Missing dashboard URL in config');
    })

    test('creation fails due to missing password reset token', () => {
      passwordReset.__config = {
        dashboardUrl: 'http://localhost:9000'
      }

      expect(() => passwordReset.generatePasswordResetUrl()).toThrow('Missing password reset token');
    })

    test('creation passes', () => {
      passwordReset.__config = {
        dashboardUrl: 'http://localhost:9000'
      }

      const res = passwordReset.generatePasswordResetUrl({token: 'validtoken'})
      expect(res).toBe('http://localhost:9000/password-reset/validtoken');
    })
  })

  describe('createPasswordReset()', () => {
    test('fails creation due to invalid user', async () => {
      await expect(passwordReset.createPasswordReset()).rejects.toThrow('Invalid User');
    })

    test('fails creation due to invalid user (missing email)', async () => {
      const user = {
        _id: '54759eb3c090d83494e2d804',
      }
      await expect(passwordReset.createPasswordReset(user)).rejects.toThrow('Invalid User');
    })

    test('fails creation due to invalid user (missing id)', async () => {
      const user = {
        email: 'stephen@test.com'
      }
      await expect(passwordReset.createPasswordReset(user)).rejects.toThrow('Invalid User');
    })

    test('fails due to error with crypto create', async () => {
      require('crypto')
      .randomBytes.mockImplementation(() => {
        throw new Error('Crypto Error')
      })

      const user = {
        _id: '54759eb3c090d83494e2d804',
        email: 'stephen@test.com'
      }
      
      await expect(passwordReset.createPasswordReset(user)).rejects.toThrow('Error generating token');
    })

    test('passes password reset generation', async () => {
      require('crypto')
      .randomBytes.mockReturnValue('workingtokenstring')

      const user = {
        _id: '54759eb3c090d83494e2d804',
        email: 'stephen@test.com'
      }

      require('mongoose')
      .model('PasswordReset')
      .create
      .mockResolvedValue({
        _id: '54759eb3c090d83494e2d804',
        userId: '54759eb3c090d83494e2d805',
        email: 'stephen@test.com',
        token: 'workingtokenstring',
        expiry: moment().endOf('day').valueOf(),
      })
      
      await expect(passwordReset.createPasswordReset(user)).resolves.toEqual({
        _id: '54759eb3c090d83494e2d804',
        userId: '54759eb3c090d83494e2d805',
        email: 'stephen@test.com',
        token: 'workingtokenstring',
        expiry: moment().endOf('day').valueOf(),
      });
    })
  })
})