import { NextFunction, Request, Response } from "express";

const validateMandatoryParams = async (req: Request, res: Response, next: NextFunction) => {
  const { ServerDateTime, UserID, RequestID } = req.body;

  if (!RequestID || !UserID || !ServerDateTime) {
    let missingParam = '';
    if (!RequestID) {
      missingParam = 'RequestID';
    }

    if (!UserID) {
      missingParam = 'UserID';
    }

    if (!ServerDateTime) {
      missingParam = 'ServerDateTime';
    }

    res.status(400).json({ msg: `Invalid ${missingParam}` });
  } else {
    next();
  }
};

export default validateMandatoryParams;
