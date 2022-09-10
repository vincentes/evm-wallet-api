const { generateAccount } = require('tron-create-address');
const EthereumWallet = require('node-ethereum-wallet');
const config = require('../../../config');
const db = require('../models');

module.exports.createWallet = async (res, parameters) => {
  const { UserID, Data } = parameters;
  const { TokenName, Network } = Data;

  const rpc = config.RPCS[TokenName];
  const wallet = new EthereumWallet(rpc);
  await wallet.init();

  const seed = wallet.generateSeed();
  await wallet.createKeystore(process.env.WALLET_PASSWORD, seed);
  await wallet.unlock(process.env.WALLET_PASSWORD);
  let address;
  let privKey;
  if (Network === 'TRC20') {
    const obj = generateAccount();
    address = obj.address;
    privKey = obj.privateKey;
  } else {
    address = await wallet.getNewAddress();
    privKey = wallet.dumpPrivKey(address);
  }

  const baseObj = {
    UserID,
    Address: address,
    Network,
    TokenName,
  };

  const [, created] = await db.sequelize.models.Wallet.findOrCreate({
    where: { UserID, Network, TokenName },
    defaults: baseObj,
  });

  if (created) {
    return res.status(200).json({
      ...baseObj,
      PrivateKey: privKey,
      Seed: seed,
    });
  }

  return res.status(200).json(baseObj);
};
