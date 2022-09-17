import { Request, Response } from 'express';

import express from 'express';

const router = express.Router();
/**
 * This is only for TESTING purposes. Should not be on production.
 */
 router.post(
  '/',
  (req: Request, res: Response) => {
    throw new Error("502 Error!");
  }
);

export default router;
