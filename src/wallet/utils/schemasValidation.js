const Joi = require('@hapi/joi');

const schemas = {
  createWallet: Joi.object().keys({
    RequestID: Joi.string().required(),
    UserID: Joi.string().required(),
    Data: Joi.object({
      TokenName: Joi.string().required(),
      Network: Joi.string().required(),
    }).required(),
    ServerDateTime: Joi.date().required(),
  }),
};

module.exports = schemas;
