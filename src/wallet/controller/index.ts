import { Response } from 'express';
import { getBalance } from '../../../actions/get-balance';
import { isSupportedNetwork, isSupportedToken } from '../../../utils/transform';
import { TronHotWallet } from '../../../actions/wallet-create-tron';
import { UserHotWallet } from '../../../lib/uhw';
import { getWalletInfo } from '../../../actions/wallet-info';
import { reportError } from '../../../utils/error';
import { exists, isValidAddress } from '../../../utils/wallet';
import {
  getConfiguredWallet,
  isConfiguredWallet,
  isConfiguredWalletFor,
  isInvalidConfig,
} from '../../../utils/storage';
var bip39 = require('bip39');

const thw = new TronHotWallet();
const uhw = new UserHotWallet();

export const wallet = async (res: Response, parameters: any) => {
  const { UserID, Data } = parameters;
  const { TokenName, Network, Address } = Data;

  if (!isSupportedNetwork(Network)) {
    return res.status(400).json({
      Error: 'Invalid Network',
    });
  }

  /**
   * Wallet info
   */
  if (Address) {
    if (isInvalidConfig(Address, Network, TokenName)) {
      return res.status(422).json({ msg: 'Verification failed.' });
    }

    if (isConfiguredWalletFor(Address, Network, TokenName)) {
      const wallet = getConfiguredWallet(Address);
      return res.status(200).json({
        Address,
        Network,
        TokenName,
        PrivateKey: wallet.privateKey,
      });
    }

    const existsTRC = await thw.exists(Address);
    const existsERC = await uhw.exists(Address);
    if (existsTRC || existsERC) {
      try {
        const wallet = await getWalletInfo(UserID, TokenName, Network, Address);
        return res.status(200).json(wallet);
      } catch (error) {
        return res.status(422).json({ msg: 'Verification failed.' });
      }
    }

    return res.status(422).json({ msg: 'Address is not a User Hot Wallet' });
  }

  let address: string;
  let privKey: string;
  let seed: string;
  /**
   * Wallet creation
   */
  if (Network === 'TRC20') {
    const wallet: any = await thw.generateHotWallet({
      UserID,
      Network,
      TokenName,
    });
    address = wallet.address;
    privKey = wallet.privateKey;
    seed = wallet.seed;
  } else {
    const mnemonic = bip39.generateMnemonic();
    console.log('generating...');
    const wallet: any = await uhw.generateHotWallet({
      UserID,
      Network,
      TokenName,
      Seed: mnemonic,
    });

    address = wallet.address;
    privKey = wallet.privateKey;
    seed = wallet.seed;
  }

  return res.status(200).json({
    Address: address,
    Network,
    TokenName,
    UserID,
    PrivateKey: privKey,
    Seed: seed,
  });
};

export const balance = async (res: Response, parameters: any) => {
  const { Data } = parameters;
  const { TokenName, Network, Address } = Data;
  if (!isSupportedNetwork(Network)) {
    return res.status(400).json({
      Error: 'Invalid Network',
    });
  }

  if (!isSupportedToken(Network, TokenName)) {
    return res.status(400).json({
      Error: 'Invalid Token',
    });
  }

  const balance = await getBalance(Network, TokenName, Address);
  return res.status(200).json({
    TokenName,
    Network,
    Address,
    Balance: balance,
  });
};

export const info = async (res: Response, parameters: any) => {
  const { Data, UserID } = parameters;
  const { TokenName, Network, Address } = Data;
  try {
    if (!isValidAddress(Address, Network)) {
      return res.status(422).json({ msg: 'Invalid Address' });
    }

    const uhwExists = await exists(Address, Network);
    if (!uhwExists) {
      return res.status(422).json({ msg: 'Address is not a User Hot Wallet' });
    }

    const wallet = await getWalletInfo(UserID, TokenName, Network, Address);
    return res.status(200).json(wallet);
  } catch (error) {
    reportError(error);
    return res.status(502).json({
      msg: 'Invalid Params',
    });
  }
};

export default {
  balance,
  wallet,
  info,
};
