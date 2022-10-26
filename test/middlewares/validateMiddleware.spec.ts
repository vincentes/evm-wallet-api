const request = require('supertest');
import server from '../../app';

const correctPayload = {
  ServerDateTime: '12/03/23',
  UserID: '123',
  RequestID: '12312312',
};

const correctCode = '591cac29daa1af094fc337b3d81cae3c';
const SERVER_URL = "https://localhost:" + process.env.SERVER_PORT;

describe('ValidateMiddleware', () => {
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
      .post('/wallet')
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
