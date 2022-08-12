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
  /**
   * TODO: Figure out how to handle the passwords
   */
  const password = 'sample-password';
  await wallet.createKeystore(password, seed);
  await wallet.unlock(password);
  const address = await wallet.getNewAddress();
  const privKey = wallet.dumpPrivKey(address);

  db.sequelize.models.Wallet.create({
    UserID,
    Address: address,
    Network,
    TokenName,
  });

  return res.status(200).json({
    UserID,
    TokenName,
    Network,
    Address: address,
    PrivateKey: privKey,
    Seed: seed,
  });
};
