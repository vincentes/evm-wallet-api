const wallet = require('../src/wallet/routes');
const { checkIfWhitelistedIp } = require('../middlewares/validateIps');
const { checkIfHasMAC } = require('../middlewares/validateMAC');
const { validateContentType } = require('../middlewares/validateContentType');
const {
  validateMandatoryParams,
} = require('../middlewares/validateMandatoryParams');

module.exports = (app) => {
  app.use(checkIfWhitelistedIp);
  app.use(validateContentType);
  app.use(validateMandatoryParams);
  app.use(checkIfHasMAC);
  app.use('/api/v1/wallet', wallet);
  app.use('*', (req, res) => {
    res.status(404).send('Resource not found.');
  });
};
