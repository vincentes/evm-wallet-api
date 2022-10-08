import db from "../src/wallet/models";
import { decryptPK, encrypt, encryptPK } from "../utils/encrypt";
import { Tron } from "./tron/init";

export type Wallet = {
    address: string;
    privateKey: string;
}

export class TronHotWallet {
    async generateHotWallet(walletInfo: any) {
        const { UserID, Network, TokenName } = walletInfo;

        const account = await Tron.createRandom();
        const wallet = {
            address: account.address,
            privateKey: account.privateKey,
            seed: account.mnemonic.phrase
        };

        const encryptedPK = encryptPK(UserID, TokenName, Network, wallet.address, wallet.privateKey);
        const encryptedSeed = encryptPK(UserID, TokenName, Network, wallet.address, wallet.seed);

        const [entity, created] = await db.sequelize.models.Wallet.findOrCreate({
            where: { UserID, Network, TokenName },
            defaults: {
                Address: wallet.address,
                UserID,
                TokenName,
                Network,
                PrivateKey: encryptedPK.iv + encryptedPK.encryptedData,
                Seed: encryptedSeed.iv + encryptedSeed.encryptedData
            },
        });


        if (!created) {
            return {
                address: entity.Address,
                privateKey: decryptPK(UserID, TokenName, Network, entity.Address, entity.PrivateKey),
                seed: decryptPK(UserID, TokenName, Network, entity.Address, entity.Seed)
            }
        }

        return {
            address: entity.Address,
            privateKey: wallet.privateKey,
            seed: wallet.seed
        };
    }

    async getHotWallet(address: string) {
        const uhw = db.sequelize.models.Wallet.findOne({ where: { Address: address } });
        return uhw;
    }

    async exists(address: string) {
        const exists = db.sequelize.models.Wallet.findOne({ where: { Address: address } })
            .then((token: string) => token !== null)
            .then((isUnique: string) => isUnique);
        return exists;
    }
}



