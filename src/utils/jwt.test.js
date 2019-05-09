const {doMock} = require('../../tests/jest-utils');

doMock('jsonwebtoken');

beforeEach(() => {
  jest.resetAllMocks();
});

const jwt = require('./jwt');

describe('jwt', () => {
  describe('generateUserToken()', () => {
    test('creation fails due to missing jwt config secret', async () => {
      jwt.__config = {}

      await expect(jwt.generateUserToken()).rejects.toThrow('Missing secret phrase');
    })

    test('creation fails due to missing user', async () => {
      jwt.__config = {
        jwtSecret: 'testing'
      }

      await expect(jwt.generateUserToken()).rejects.toThrow('Invalid User');
    })

    test('creation succeeds', async () => {
      const user = {
        _id: '54759eb3c090d83494e2d804',
        email: 'stephen@test.com'
      }

      jwt.__config = {
        jwtSecret: 'testing'
      }

      require('jsonwebtoken')
        .sign.mockReturnValue('validtoken')

      const res = await jwt.generateUserToken(user);
      expect(res).toBe('validtoken')
    })
  })
});