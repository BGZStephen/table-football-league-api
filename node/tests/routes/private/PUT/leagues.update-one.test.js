const request = require('supertest');

describe('Test the users PUT route', () => {
  test('It should respond with 200 and an updated league', (done) => {
    request('http://localhost:3000')
    .put('/leagues/5a00d2b692561626081f3461')
    .send({
      name: 'myTestLeague1',
    })
    .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
    });
  });
});
