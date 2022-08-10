const config = require('../config');

const checkIfWhitelistedIp = async (req, res, next) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
  if (ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7);
  }

  if (config.WHITELISTED_IPS.includes(ip)) {
    console.log(`Middleware [ValidateIPs]: Whitelisted IP ${ip}`);
    next();
  } else {
    console.log(`Middleware [ValidateIPs]: Bad IP ${ip}`);

    res.status(401).send('Address not whitelisted');
  }
};

module.exports = { checkIfWhitelistedIp };
