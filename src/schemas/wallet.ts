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
  UserID: Joi.string().max(32).required(),
  Data: Joi.object({
    TokenName: Joi.string().required(),
    Network: Joi.string().required(),
    Address: Joi.string().required(),
  })
    .required(),
  ServerDateTime: Joi.date().required(),
})
  .meta({ className: 'BalanceDTO' });


export const withdrawal = Joi.object().keys({
  RequestID: Joi.string().required(),
  UserID: Joi.string().max(32).required(),
  Data: Joi.object({
    TokenName: Joi.string().required(),
    Network: Joi.string().required(),
    Address: Joi.string().required(),
    Amount: Joi.string().required(),
    Priority: Joi.number().valid(0, 1, 2).required()
  })
    .required(),
  ServerDateTime: Joi.date().required(),
})
  .meta({ className: 'WithdrawalDTO' });


export const gasEstimate = Joi.object().keys({
  RequestID: Joi.string().required(),
  UserID: Joi.string().max(32).required(),
  Data: Joi.object({
    TokenName: Joi.string().required(),
    Network: Joi.string().required(),
    Address: Joi.string().required(),
    Amount: Joi.string().required()
  })
    .required(),
  ServerDateTime: Joi.date().required(),
})
  .meta({ className: 'GasEstimateDTO' });
  
export default {
  balance,
  createWallet,
  withdrawal,
  gasEstimate
}