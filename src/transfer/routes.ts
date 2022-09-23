import { Request, Response } from 'express';

import express from 'express';

import controller from './controller/index';
import validateSchemas from '../../middlewares/validateSchemas';
import schemas from '../schemas/wallet';

const router = express.Router();

router.post(
  '/',
  validateSchemas.inputs(schemas.withdrawal, 'body'),
  (req: Request, res: Response) => {
    controller.withdraw(res, req.body);
  }
);

export default router;
