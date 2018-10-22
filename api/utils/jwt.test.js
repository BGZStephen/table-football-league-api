const {doMock} = require('../../tests/jest-utils');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('jwt', () => {
  describe('generateUserToken()', () => {
    test('creation fails due to missing jwt config secret', async () => {
      doMock('api/config', () => ({}));

      const jwt = require('./jwt');

      await expect(jwt.generateUserToken()).rejects.toThrow('Missing secret phrase');
    })
  })
});