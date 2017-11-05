const request = require('supertest');

describe('Test the users POST route', () => {
  test('It should respond with 200 and a user object', (done) => {
    request('http://localhost:3000')
    .get('/users/59ff297327e8d20e50eae671')
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
    .get('/users/AABBCCDDEEFF00112233')
    .then((response) => {
        expect(response.statusCode).toBe(500);
        done();
    });
  });
});
