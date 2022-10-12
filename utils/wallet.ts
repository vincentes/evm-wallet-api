import web3 from "web3";
import { TronHotWallet } from "../actions/wallet-create-tron";
import { Network } from "../constants/constants";
import { UserHotWallet } from "../lib/uhw";
import { isConfiguredWallet } from "./storage";

const tronRegex = new RegExp("T[A-Za-z1-9]{33}");

const uhw = new UserHotWallet();
const thw = new TronHotWallet();

export type Wallet = {
    address: string;
    privateKey: string;
}

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
