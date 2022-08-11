const crypto = require('crypto');

const checkIfHasMAC = async (req, res, next) => {
  const code = req.headers['x-auth-code'] || null;
  if (code === null) {
    res.status(400).send('X-Auth-Code is required');
    return;
  }

  const jsonStr = JSON.stringify(req.body);
  const { RequestID } = req.body;
  const { ServerDateTime } = req.body;
  const key1 = `${process.env.API_KEY}:${RequestID}:${ServerDateTime}`;
  const key2 = `${process.env.API_KEY}:${jsonStr}`;
  console.log('key2', key2);

  const key2MD5 = crypto.createHash('md5').update(key2).digest('hex');

  console.log('key2md5', key2MD5);

  const MAC = crypto
    .createHash('md5')
    .update(key1 + key2MD5)
    .digest('hex');

  console.log('mac', MAC);
  console.log('code', code);

  if (code === MAC) {
    next();
  } else {
    res.status(401).json({ msg: 'Invalid Parameter' });
  }
};

module.exports = { checkIfHasMAC };
