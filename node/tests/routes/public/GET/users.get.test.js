const request = require('supertest');

describe('Test the users GET route', () => {
  test('It should respond with 200 and a user object', (done) => {
    request('http://localhost:3000')
    .get('/users/5a0011cc7d1e69281b31ed46')
    .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
    });
  });
  test('It should respond with 500 as not a valid mongoose ObjectId', (done) => {
    request('http://localhost:3000')
    .get('/users/notARealUserId')
    .then((response) => {
        expect(response.statusCode).toBe(500);
        done();
    });
  });
  test('It should respond with 404 as not a valid User ID', (done) => {
    request('http://localhost:3000')
    .get('/users/AABBCCDDEEFF001122334455')
    .then((response) => {
        expect(response.statusCode).toBe(404);
        done();
    });
  });
});
