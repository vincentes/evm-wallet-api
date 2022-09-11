import { Response } from "express";
import { getBalance } from "../../../actions/get-balance";

import { generateAccount } from 'tron-create-address';
const EthereumWallet = require('node-ethereum-wallet');
import config from '../../../config';
import db from '../models';

export const createWallet = async (res : Response, parameters : any) => {
  const { UserID, Data } = parameters;
  const { TokenName, Network } = Data;

  const rpc : any = config.RPCS[TokenName];
  const wallet = new EthereumWallet(rpc);
  await wallet.init();

  const seed = wallet.generateSeed();
  await wallet.createKeystore(process.env.WALLET_PASSWORD, seed);
  await wallet.unlock(process.env.WALLET_PASSWORD);
  let address : string;
  let privKey : string;
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



export const balance = async (res : Response, parameters : any) => {
  const { Data } = parameters;
  const { TokenName, Network, Address } = Data;

  const balance = await getBalance(Network, TokenName, Address);

  return res.status(200).json({
    TokenName,
    Network,
    Address,
    Balance: balance
  });
};

export default {
  balance,
  createWallet
}