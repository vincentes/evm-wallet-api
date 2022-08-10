const status = require('../src/health/routes');
const users = require('../src/users/routes');
// const validateAuth = require('../middlewares/validateAuth');
// const getData = require('../middlewares/getData');
const { checkIfWhitelistedIp } = require('../middlewares/validateIps');
const { checkIfHasMAC } = require('../middlewares/validateMAC');
const { validateContentType } = require('../middlewares/validateContentType');
const {
  validateMandatoryParams,
} = require('../middlewares/validateMandatoryParams');

module.exports = (app) => {
  app.use(checkIfWhitelistedIp);
  app.use(checkIfHasMAC);
  app.use(validateContentType);
  app.use(validateMandatoryParams);
  app.use('/status', status);
  app.use('/users', users);
  // app.use('/users', validateAuth.checkIfAuthenticated, getData.getGeoip, users);
  app.use('*', (req, res) => {
    res.status(404).send('Resource not found.');
  });
};
