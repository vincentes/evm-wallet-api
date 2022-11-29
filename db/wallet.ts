import { Network, TokenType } from "../constants/constants";
import db from "../models";
import { getConfiguredWallet, isConfiguredWallet } from "../utils/storage";

export async function getWalletSpecific(network: Network, tokenType: TokenType, fromAddress: string) {
    let wallet = await db.sequelize.models.Wallet.findOne({
        where: {
            Network: network,
            TokenName: tokenType,
            Address: fromAddress
        }
    });

    let configured = false;
    if (!wallet) {
        if (isConfiguredWallet(fromAddress)) {
            wallet = getConfiguredWallet(fromAddress);
            configured = true;
        } else {
            throw new Error("Transfer - UHW not found.");
        }
    }

    return wallet;
}


export async function getWalletAddress(address: string) {
    let wallet = await db.sequelize.models.Wallet.findOne({
        where: {
            Address: address
        }
    });

    let configured = false;
    if (!wallet) {
        if (isConfiguredWallet(address)) {
            wallet = getConfiguredWallet(address);
            configured = true;
        } else {
            throw new Error("Transfer - UHW not found.");
        }
    }

    return wallet;
}