jest.doMock("joi", () => require('../../_mocks_/joi'));

import * as joiUtils from './joi';

describe('joi', () => {
  describe('validateThrow', () => {
    test('passes with no errors', () => {
      require("joi").validate.mockReturnValue(null)
      const res = joiUtils.validateThrow("test", {})
      expect(res).toEqual(undefined);
    });
  });

  describe('validateThrow', () => {
    test('throws an error if the joi tests return errors', () => {
      require("joi").validate.mockReturnValue({
        error: {
          details: [{
            message: "Test error"
          }]
        }
      })
      expect(() => joiUtils.validateThrow("test", {})).toThrowError(new Error("Test error"))
    });
  });
});
