const request = require('supertest');
const leagueId = '5a00d2b692561626081f3461'

describe('Test the league DELETE route', () => {
  test('It should respond with 200', (done) => {
    request('http://localhost:3000')
    .delete(`/leagues/${leagueId}`)
    .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
    });
  });
  test('It should respond with 404 as league already deleted', (done) => {
    request('http://localhost:3000')
    .delete(`/leagues/${leagueId}`)
    .then((response) => {
        expect(response.statusCode).toBe(404);
        done();
    });
  });
});
