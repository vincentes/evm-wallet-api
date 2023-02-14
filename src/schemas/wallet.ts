import Joi from 'joi';

export const wallet = Joi.object()
  .keys({
    RequestID: Joi.string().required(),
    UserID: Joi.string().required(),
    Data: Joi.object({
      Address: Joi.string().optional(),
      TokenName: Joi.string().required(),
      Network: Joi.string().required(),
    }).required(),
    IsMultiToken: Joi.boolean().optional().default(false),
    ServerDateTime: Joi.date().required(),
  })
  .meta({ className: 'WalletDTO' });

export const balance = Joi.object()
  .keys({
    RequestID: Joi.string().required(),
    UserID: Joi.string().max(32).required(),
    Data: Joi.object({
      TokenName: Joi.string().required(),
      Network: Joi.string().required(),
      Address: Joi.string().required(),
    }).required(),
    ServerDateTime: Joi.date().required(),
  })
  .meta({ className: 'BalanceDTO' });

export const withdrawal = Joi.object()
  .keys({
    RequestID: Joi.string().required(),
    UserID: Joi.string().max(32).required(),
    Data: Joi.object({
      TokenName: Joi.string().required(),
      Network: Joi.string().required(),
      AddressFrom: Joi.string().required(),
      AddressTo: Joi.string().required(),
      Priority: Joi.string().valid('0', '1', '2').optional().default('1'),
      Amount: Joi.string().required(),
      Native: Joi.boolean().required(),
    }).required(),
    ServerDateTime: Joi.date().required(),
  })
  .meta({ className: 'WithdrawalDTO' });

export const gasEstimate = Joi.object()
  .keys({
    RequestID: Joi.string().required(),
    UserID: Joi.string().max(32).required(),
    Data: Joi.object({
      TokenName: Joi.string().required(),
      Network: Joi.string().required(),
      Address: Joi.string().required(),
      Amount: Joi.string().required(),
    }).required(),
    ServerDateTime: Joi.date().required(),
  })
  .meta({ className: 'GasEstimateDTO' });

export default {
  balance,
  wallet,
  withdrawal,
  gasEstimate,
};
