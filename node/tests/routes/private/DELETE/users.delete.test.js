const request = require('supertest');
const userId = '5a001134fd7485258ce7d132'

describe('Test the users DELETE route', () => {
  test('It should respond with 200 and an updated user', (done) => {
    request('http://localhost:3000')
    .delete(`/users/${userId}`)
    .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
    });
  });
  test('It should respond with 404 as user already deleted', (done) => {
    request('http://localhost:3000')
    .delete(`/users/${userId}`)
    .then((response) => {
        expect(response.statusCode).toBe(404);
        done();
    });
  });
});
