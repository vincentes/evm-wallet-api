import Joi from 'joi';

export const createWallet = Joi.object().keys({
  RequestID: Joi.string().required(),
  UserID: Joi.string().required(),
  Data: Joi.object({
    TokenName: Joi.string().required(),
    Network: Joi.string().required(),
  })
    .required(),
  ServerDateTime: Joi.date().required(),
})
  .meta({ className: 'CreateWalletDTO' });

export const balance = Joi.object().keys({
  RequestID: Joi.string().required(),
  UserID: Joi.string().required(),
  Data: Joi.object({
    TokenName: Joi.string().required(),
    Network: Joi.string().required(),
    Address: Joi.string().required(),
  })
    .required(),
  ServerDateTime: Joi.date().required(),
})
  .meta({ className: 'BalanceDTO' });

export default {
  balance,
  createWallet,
}