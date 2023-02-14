import { Network } from '../constants/constants';
import { UserHotWallet } from '../lib/uhw';
import { decryptPK } from '../utils/encrypt';
import { getConfiguredWallet, isConfiguredWallet } from '../utils/storage';
import { TronHotWallet } from './wallet-create-tron';

const uhw = new UserHotWallet();

export async function getWalletInfo(
  userId: string,
  tokenName: string,
  network: Network,
  address: string
) {
  if (network === Network.TRC20) {
    const thw = new TronHotWallet();

    const exists = await thw.exists(address);
    if (!exists) {
      if (!isConfiguredWallet(address)) {
        throw new Error('Wallet does not exist in the database.');
      }
      return getConfiguredWallet(address);
    }

    const wallet = await thw.getHotWallet(address);
    return {
      Address: wallet.Address,
      PrivateKey: decryptPK(
        userId,
        tokenName,
        network,
        address,
        wallet.PrivateKey
      ),
      Seed: decryptPK(userId, tokenName, network, wallet.Address, wallet.Seed),
      Network: network,
      TokenName: wallet.TokenName,
      CreateDateTime: wallet.CreateDateTime,
    };
  } else {
    const wallet = await uhw.getHotWallet(address);
    if (!wallet) {
      throw new Error('UHW - not found');
    }
    return {
      Address: wallet.Address,
      PrivateKey: decryptPK(
        userId,
        tokenName,
        network,
        address,
        wallet.PrivateKey
      ),
      Seed: decryptPK(userId, tokenName, network, wallet.Address, wallet.Seed),
      Network: network,
      TokenName: wallet.TokenName,
      CreateDateTime: wallet.CreateDateTime,
    };
  }
}
