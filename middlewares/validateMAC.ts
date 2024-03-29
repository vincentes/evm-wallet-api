import crypto from 'crypto';

const checkIfHasMAC = async (req: any, res: any, next: any) => {
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

  const key2MD5 = crypto.createHash('md5').update(key2).digest('hex');

  const MAC = crypto
    .createHash('md5')
    .update(key1 + key2MD5)
    .digest('hex');

  console.log(MAC);

  if (process.env.NODE_ENV == "development" || code === MAC) {
    next();
  } else {
    res.status(401).json({ msg: 'Invalid Parameter' });
  }
};

export default checkIfHasMAC;
