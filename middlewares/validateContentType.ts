import { NextFunction, Request, Response } from "express";

const validateContentType = async (req : Request, res : Response, next : NextFunction) => {
  const contentType = req.headers['content-type'] || null;
  if (!contentType || !req.body) {
    res.status(400).json({
      msg: 'Invalid Parameter',
    });
  } else {
    next();
  }
};

export default validateContentType;
