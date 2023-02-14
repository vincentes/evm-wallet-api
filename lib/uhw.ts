import db from '../src/wallet/models';
import { decryptPK, encryptPK } from '../utils/encrypt';
import { getConfiguredWallet, isConfiguredWallet } from '../utils/storage';

const HdKeyring = require('@metamask/eth-hd-keyring');

export class UserHotWallet extends HdKeyring {
  constructor(mnemonic?: string) {
    if (mnemonic) {
      super({
        mnemonic: mnemonic,
      });
    } else {
      super();
      this.generateRandomMnemonic();
    }
  }

  async generateHotWallet(wallet: any) {
    const { UserID, Network, TokenName, Seed } = wallet;
    this.addAccounts(1);

    const accounts = await this.getAccounts();
    const generatedAccount = accounts[this.wallets.length - 1];
    const privateKey = await this.exportAccount(generatedAccount);

    const encryptedSeed = encryptPK(
      UserID,
      null,
      Network,
      generatedAccount,
      Seed
    );
    const encryptedPK = encryptPK(
      UserID,
      null,
      Network,
      generatedAccount,
      privateKey
    );

    const [entity, created] = await db.sequelize.models.Wallet.findOrCreate({
      where: { UserID, Network },
      defaults: {
        Address: generatedAccount,
        UserID,
        TokenName: null,
        Network,
        PrivateKey: encryptedPK.iv + encryptedPK.encryptedData,
        Seed: encryptedSeed.iv + encryptedSeed.encryptedData,
      },
    });

    /**
     * Wallet exists for UserID
     * If exists -> Decrypt with existing data
     */
    if (!created) {
      console.log('Entity exists', { entity });
      return {
        address: entity.Address,
        privateKey: decryptPK(
          UserID,
          entity.IsMultiToken ? null : entity.TokenName,
          entity.Network,
          entity.Address,
          entity.PrivateKey
        ),
        seed: decryptPK(
          UserID,
          entity.IsMultiToken ? null : entity.TokenName,
          entity.Network,
          entity.Address,
          entity.Seed
        ),
      };
    }

    return {
      address: entity.Address,
      privateKey,
      seed: Seed,
    };
  }

  async getHotWallet(address: string) {
    const uhw = db.sequelize.models.Wallet.findOne({
      where: { Address: address },
    });
    if (!uhw) {
      if (isConfiguredWallet(address)) {
        return getConfiguredWallet(address);
      }

      throw new Error('UHW - Wallet not found.');
    }
    return uhw;
  }

  async exists(address: string) {
    const exists = db.sequelize.models.Wallet.findOne({
      where: { Address: address },
    })
      .then((token: string) => token !== null)
      .then((isUnique: string) => isUnique);
    return exists;
  }
}
