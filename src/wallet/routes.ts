import { Request, Response } from 'express';

import express from 'express';

import controller from './controller/index';
import validateSchemas from '../../middlewares/validateSchemas';
import schemas from '../schemas/wallet';


const router = express.Router();

router.post(
  '/',
  validateSchemas.inputs(schemas.wallet, 'body'),
  (req: Request, res: Response) => {
    controller.wallet(res, req.body);
  }
);

router.post(
  '/balance',
  validateSchemas.inputs(schemas.balance, 'body'),
  (req: Request, res: Response) => {
    controller.balance(res, req.body);
  }
);

export default router;
