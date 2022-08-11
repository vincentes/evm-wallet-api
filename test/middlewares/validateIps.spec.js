const supertest = require('supertest');
const server = require('../../index');

const requestWithSupertest = supertest(server);

describe('ValidateIps', () => {
  it('ANY request with no valid ip should return unauthorized', async () => {
    requestWithSupertest
      .get('/wallet')
      .set('X-Auth-Code', 'XYZ')
      .expect(401, { message: 'Address not whitelisted' });
  });
});
