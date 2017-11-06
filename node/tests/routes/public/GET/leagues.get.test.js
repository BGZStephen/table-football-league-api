const request = require('supertest');

describe('Test the Leagues GET route', () => {
  test('It should respond with 200 and a league object', (done) => {
    request('http://localhost:3000')
    .get('/leagues/5a00d2b692561626081f3461')
    .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
    });
  });
  test('It should respond with 500 as not a valid mongoose ObjectId', (done) => {
    request('http://localhost:3000')
    .get('/leagues/notARealUserId')
    .then((response) => {
        expect(response.statusCode).toBe(500);
        done();
    });
  });
  test('It should respond with 404 as not a valid League ID', (done) => {
    request('http://localhost:3000')
    .get('/leagues/AABBCCDDEEFF001122334455')
    .then((response) => {
        expect(response.statusCode).toBe(404);
        done();
    });
  });
});
