const request = require('supertest');
const server = require('../../app');

const correctPayload = {
  ServerDateTime: '12/03/23',
  UserID: '123',
  RequestID: '12312312',
};

const correctCode = '591cac29daa1af094fc337b3d81cae3c';

describe('ValidateMiddleware', () => {
  it('ANY request with no valid ip should return unauthorized', () => {
    return request(server)
      .get('/wallet')
      .set('x-forwarded-for', '123.212.32.1')
      .set('X-Auth-Code', 'XYZ')
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Address not whitelisted');
      });
  });

  it('Request with invalid content-type should be ignored', () => {
    return request(server)
      .get('/wallet')
      .set('X-Auth-Code', 'XYZ')
      .set('Content-Type', 'multipart/form-data')
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.msg).toBe('Invalid Parameter');
      });
  });

  it('Missing RequestID should return invalid', async () => {
    const invalidRequestIdPayload = { ...correctPayload };
    invalidRequestIdPayload.RequestID = null;

    const res = await request(server)
      .get('/wallet')
      .set('x-forwarded-for', process.env.WHITELISTED_IPS)
      .set('X-Auth-Code', correctCode)
      .set('Content-Type', 'application/json')
      .send(invalidRequestIdPayload)
      .expect(400);

    expect(res.body.msg).toEqual('Invalid RequestID');
  });

  it('Missing UserID should return invalid', async () => {
    const invalidUserIDPayload = { ...correctPayload };
    invalidUserIDPayload.UserID = null;

    const res = await request(server)
      .get('/wallet')
      .set('x-forwarded-for', process.env.WHITELISTED_IPS)
      .set('X-Auth-Code', correctCode)
      .set('Content-Type', 'application/json')
      .send(invalidUserIDPayload)
      .expect(400);

    expect(res.body.msg).toEqual('Invalid UserID');
  });

  it('Missing ServerDateTime should return invalid', async () => {
    const invalidServerDateTime = { ...correctPayload };
    invalidServerDateTime.ServerDateTime = null;

    const res = await request(server)
      .get('/wallet')
      .set('x-forwarded-for', process.env.WHITELISTED_IPS)
      .set('X-Auth-Code', correctCode)
      .set('Content-Type', 'application/json')
      .send(invalidServerDateTime)
      .expect(400);

    expect(res.body.msg).toEqual('Invalid ServerDateTime');
  });

  it('ANY request with valid payload and headers should return OK', async () => {
    return request(server)
      .get('/wallet')
      .set('x-forwarded-for', process.env.WHITELISTED_IPS)
      .set('X-Auth-Code', correctCode)
      .set('Content-Type', 'application/json')
      .send(correctPayload)
      .expect(404);
  });

  it('Invalid MAC code', async () => {
    const invalidCode = '4ac8ed08a17895ec4c7d726f0c870e79';

    const res = await request(server)
      .get('/wallet')
      .set('x-forwarded-for', process.env.WHITELISTED_IPS)
      .set('X-Auth-Code', invalidCode)
      .set('Content-Type', 'application/json')
      .send(correctPayload)
      .expect(401);
    expect(res.body.msg).toEqual('Invalid Parameter');
  });

  it('Valid MAC code', async () => {
    return request(server)
      .get('/wallet')
      .set('x-forwarded-for', process.env.WHITELISTED_IPS)
      .set('X-Auth-Code', correctCode)
      .set('Content-Type', 'application/json')
      .send(correctPayload)
      .expect(404);
  });
});
