require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const config : any = {
  port: process.env.SERVER_PORT,
  dbUrlMongoDB: process.env.dbUrlMongoDB,
  API_KEY_JWT: process.env.API_KEY_JWT,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
  WHITELISTED_IPS: process.env.WHITELISTED_IPS?.split(','),
  RPCS: {
    ERC20: process.env.ERC20_RPC,
    BEP20: process.env.BEP20_RPC,
    TRC20: process.env.TRC20_RPC,
  },
  WALLETS_LIST: [
    {
      address: '0xa9a6f87860dcd7e2991f740a436fe52ae9d565ad',
      privateKey: process.env.BEP20_IDRT_STORE
    },
    {
      address: '0xfbd8dbcf51213eeefe00ad89eedf4fcbe176f783',
      privateKey: process.env.BEP20_USDT_STORE
    },
    {
      address: 'TTpJFsE1xPRvqoJok2xCFACdTPmcg7yhx1',
      privateKey: process.env.TRC20_USDT_STORE
    },
    {
      address: '0x0ec122a3ac164e919961a893cc90f06cb77f3c70',
      privateKey: process.env.ERC20_IDRT_STORE
    }
  ],
  WALLETS: {
    BEP20: {
      IDRT: {
        address: '0xa9a6f87860dcd7e2991f740a436fe52ae9d565ad',
        privateKey: process.env.BEP20_IDRT_STORE
      },
      USDT: {
        address: '0xfbd8dbcf51213eeefe00ad89eedf4fcbe176f783',
        privateKey: process.env.BEP20_USDT_STORE
      }
    },
    TRC20: {
      USDT: {
        address: 'TTpJFsE1xPRvqoJok2xCFACdTPmcg7yhx1',
        privateKey: process.env.TRC20_USDT_STORE
      }
    },
    ERC20: {
      IDRT: {
        address: '0x0ec122a3ac164e919961a893cc90f06cb77f3c70',
        privateKey: process.env.ERC20_IDRT_STORE
      }
    }
  }
};


export default config;
