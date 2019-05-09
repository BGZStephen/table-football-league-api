import { asyncwrap } from "./rest";

describe('rest', () => {
  describe('asyncwrap', () => {
    test('token passes verification', async () => {
      const res = await asyncwrap(async () => {});
      const resFnCall = res(null , null, null);
      expect(res).toBeDefined();
      expect(resFnCall).toBeDefined();
    });
  });
});
