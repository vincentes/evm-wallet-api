import web3 from "web3";
import { TronHotWallet } from "../actions/wallet-create-tron";
import { Network, TokenType } from "../constants/constants";
import { UserHotWallet } from "../lib/uhw";
import Web3 from "../node_modules/web3/types/index";
import db from "../src/gas-price/models/index";
import { Wallet } from "../types/wallet";
import { decryptPK } from "./encrypt";
import { getConfiguredWallet, isConfiguredWallet } from "./storage";
import { transform } from "./transform";

const tronRegex = new RegExp("T[A-Za-z1-9]{33}");

const uhw = new UserHotWallet();
const thw = new TronHotWallet();


export function isValidAddress(address: string, network: Network) {
    if (network === Network.TRC20) {
        return address.match(tronRegex);
    } else {
        return web3.utils.isAddress(address);
    }
}

export function exists(address: string, network: Network) {
    if (isConfiguredWallet(address)) {
        return true;
    } else {
        if (network === "TRC20") {
            return thw.exists(address);
        } else {
            return uhw.exists(address);
        }
    }
}

export async function getWallet(network: Network, tokenType: TokenType, address: string): Promise<Wallet> {
    let tokenAddress;
    try {
        tokenAddress = transform(network, tokenType);
    } catch (error) {
        return null;
    }

    let wallet = await db.sequelize.models.Wallet.findOne({
        where: {
            Network: network,
            TokenName: tokenType,
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

    let pk;
    if (configured) {
        pk = wallet.privateKey;
    } else {
        pk = decryptPK(wallet.UserID, tokenType, network, address, wallet.dataValues["PrivateKey"]);
    }

    return {
        address,
        network,
        configured,
        privateKey: pk
    };
}
