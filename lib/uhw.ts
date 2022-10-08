import db from "../src/wallet/models";
import { encryptPK } from "../utils/encrypt";

const HdKeyring = require('@metamask/eth-hd-keyring');

export class UserHotWallet extends HdKeyring {

    constructor(mnemonic?: string) {
        if (mnemonic) {
            super({
                mnemonic: mnemonic
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

        const encryptedSeed = encryptPK(UserID, TokenName, Network, generatedAccount, Seed);
        const encryptedPK = encryptPK(UserID, TokenName, Network, generatedAccount, privateKey);

        const [, created] = await db.sequelize.models.Wallet.findOrCreate({
            where: { UserID, Network, TokenName },
            defaults: {
                Address: generatedAccount,
                UserID,
                TokenName,
                Network,
                PrivateKey: encryptedPK.iv + encryptedPK.encryptedData,
                Seed: encryptedSeed.iv + encryptedSeed.encryptedData
            },
        });

        if (!created) {
            return {
                address: generatedAccount,
            }
        }

        return {
            address: generatedAccount,
            privateKey
        };
    }

    async getHotWallet(address: string) {
        const uhw = db.sequelize.models.Wallet.findOne({ where: { Address: address } });
        if (!uhw) {
            throw new Error("UHW - Wallet not found.");
        }
        return uhw;
    }

    async exists(address: string) {
        const exists = db.sequelize.models.Wallet.findOne({ where: { Address: address } })
            .then((token: string) => token !== null)
            .then((isUnique: string) => isUnique);
        return exists;
    }

}



