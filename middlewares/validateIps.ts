import { NextFunction, Request, Response } from 'express';
import config from '../config';

const checkIfWhitelistedIp = async (req: Request, res: Response, next: NextFunction) => {
  if (req.url === "/api/v1/gasfee") {
    next();
    return;
  }
  
  let ip = req.socket.remoteAddress || null;
  if (ip && ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7);
  }

  if (ip && config.WHITELISTED_IPS?.includes(ip)) {
    console.log(`Middleware [ValidateIPs]: Whitelisted IP ${ip}`);
    next();
  } else {
    console.log(`Middleware [ValidateIPs]: Bad IP ${ip}`);

    res.status(401).json({ message: 'Address not whitelisted' });
  }
};

export default checkIfWhitelistedIp;
