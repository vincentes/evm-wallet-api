import db from "../src/wallet/models";
import { encrypt, encryptPK } from "../utils/encrypt";
import { Tron } from "./tron/init";

export type Wallet = {
    address: string;
    privateKey: string;
}

export class TronHotWallet {
    async generateHotWallet(walletInfo: any) {
        const { UserID, Network, TokenName } = walletInfo;

        const account = await Tron.createAccount();
        const wallet = {
            address: account.address.base58,
            privateKey: account.privateKey
        };

        const encryptedPK = encryptPK(UserID, TokenName, Network, wallet.address, wallet.privateKey);

        const [, created] = await db.sequelize.models.Wallet.findOrCreate({
            where: { UserID, Network, TokenName },
            defaults: {
                Address: wallet.address,
                UserID,
                TokenName,
                Network,
                PrivateKey: encryptedPK.iv + encryptedPK.encryptedData
            },
        });


        if (!created) {
            return {
                address: wallet.address,
            }
        }

        return {
            address: wallet.address,
            privateKey: wallet.privateKey
        };
    }

    async getHotWallet(address: string) {
        const result = db.sequelize.models.Wallet.findOne({ where: { Address: address } });
        return result;
    }

    async exists(address: string) {
        const exists = db.sequelize.models.Wallet.findOne({ where: { Address: address } })
            .then((token: string) => token !== null)
            .then((isUnique: string) => isUnique);
        return exists;
    }
}



