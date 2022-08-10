const crypto = require('crypto');

const checkIfHasMAC = async (req, res, next) => {
  console.log(req.headers);
  const code = req.headers['x-auth-code'] || null;
  if (code === null) {
    res.status(400).send('X-Auth-Code is required');
    return;
  }

  const jsonStr = JSON.stringify(req.body);
  const { requestId } = req.body;
  const { serverDateTime } = req.body;
  const key1 = `${process.env.API_KEY}:${requestId}:${serverDateTime}`;
  const key2 = `${process.env.API_KEY}:${jsonStr}`;
  const key2MD5 = crypto.createHash('md5').update(key2).digest('hex');
  const MAC = crypto
    .createHash('md5')
    .update(key1 + key2MD5)
    .digest('hex');

  if (code === MAC) {
    next();
  }
};

module.exports = { checkIfHasMAC };
