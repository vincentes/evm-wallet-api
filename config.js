require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const config = {
  port: process.env.SERVER_PORT,
  dbUrlMongoDB: process.env.dbUrlMongoDB,
  API_KEY_JWT: process.env.API_KEY_JWT,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
  WHITELISTED_IPS: process.env.WHITELISTED_IPS,
  RPCS: {
    ERC20: process.env.ERC20_RPC,
    BEP20: process.env.BEP20_RPC,
    TRC20: process.env.TRC20_RPC,
  },
};

module.exports = config;
