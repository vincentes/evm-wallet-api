import { Response } from "express";
import { getBalance } from "../../../actions/get-balance";
import db from '../models';
import { isSupportedNetwork, isSupportedToken } from "../../../utils/transform";
import { TronHotWallet } from "../../../actions/wallet-create-tron";
import { UserHotWallet } from "../../../lib/uhw";
var bip39 = require('bip39')


const thw = new TronHotWallet();

export const createWallet = async (res: Response, parameters: any) => {
  const { UserID, Data } = parameters;
  const { TokenName, Network } = Data;

  let address: string;
  let privKey: string;
  if (Network === 'TRC20') {
    const wallet: any = await thw.generateHotWallet(
      {
        UserID,
        Network,
        TokenName
      });
    address = wallet.address;
    privKey = wallet.privateKey;
  } else {
    const mnemonic = bip39.generateMnemonic()
    const uhw = new UserHotWallet();
    const wallet: any = await uhw.generateHotWallet({
      UserID,
      Network,
      TokenName,
      Seed: mnemonic,
    });

    address = wallet.address;
    privKey = wallet.privateKey;
  }

  return res.status(200).json({
    Address: address,
    Network,
    TokenName,
    UserID,
    PrivateKey: privKey
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