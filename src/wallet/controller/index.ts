import { Response } from "express";
import { getBalance } from "../../../actions/get-balance";

import { generateAccount } from 'tron-create-address';
import config from '../../../config';
import db from '../models';
import { isSupportedNetwork, isSupportedToken } from "../../../utils/transform";
import { ApproHotWallet } from "../../../actions/wallet-create-eth";
import { TronHotWallet } from "../../../actions/wallet-create-tron";

const uhw = new ApproHotWallet();
const thw = new TronHotWallet();

export const createWallet = async (res: Response, parameters: any) => {
  const { UserID, Data } = parameters;
  const { TokenName, Network } = Data;

  let address: string;
  let privKey: string;
  if (Network === 'TRC20') {
    const wallet: any = await thw.generateHotWallet();
    address = wallet.address;
    privKey = wallet.privateKey;
  } else {
    const wallet: any = await uhw.generateHotWallet();
    address = wallet.address;
    privKey = wallet.privateKey;
  }

  const baseObj = {
    UserID,
    Network,
    TokenName,
    Address: address
  };

  const [row, created] = await db.sequelize.models.Wallet.findOrCreate({
    where: { UserID, Network, TokenName },
    defaults: {
      ...baseObj
    },
  });

  if (created) {
    return res.status(200).json({
      ...baseObj,
      Address: address,
      PrivateKey: privKey
    });
  }

  return res.status(200).json({
    Address: row.Address,
    Network: row.Network,
    TokenName: row.TokenName,
    UserID: row.UserID
  });
};



export const balance = async (res: Response, parameters: any) => {
  const { Data } = parameters;
  const { TokenName, Network, Address } = Data;
  if (!isSupportedNetwork(Network)) {
    return res.status(400).json({
      Error: "Invalid Network"
    });
  }

  if (!isSupportedToken(Network, TokenName)) {
    return res.status(400).json({
      Error: "Invalid Token"
    });
  }

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