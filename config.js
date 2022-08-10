require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const config = {
  port: process.env.SERVER_PORT,
  dbUrlMongoDB: process.env.dbUrlMongoDB,
  API_KEY_JWT: process.env.API_KEY_JWT,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
  WHITELISTED_IPS: process.env.WHITELISTED_IPS,
};

module.exports = config;
