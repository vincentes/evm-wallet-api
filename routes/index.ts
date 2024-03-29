import { Request, Response } from 'express';

import wallet from '../src/wallet/routes';
import failure from '../src/failure/routes';
import transfer from '../src/transfer/routes';
import estimate from '../src/gas-price/routes';
import checkIfWhitelistedIp from '../middlewares/validateIps';
import checkIfHasMAC from '../middlewares/validateMAC';
import validateContentType from '../middlewares/validateContentType';
import validateMandatoryParams from '../middlewares/validateMandatoryParams';

module.exports = (app : any) => {
  app.use(checkIfWhitelistedIp);
  app.use(validateContentType);
  app.use(validateMandatoryParams);
  app.use(checkIfHasMAC);
  app.use('/api/v1/failure', failure);
  app.use('/api/v1/wallet', wallet);
  app.use('/api/v1/transfer', transfer);
  app.use('/api/v1/gasfee', estimate);
  app.use('*', (req : Request, res : Response) => {
    res.status(404).send('Resource not found.');
  });
};
