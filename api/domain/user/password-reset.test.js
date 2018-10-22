const {doMock} = require('../../../tests/jest-utils');

// doMock('crypto')
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
})