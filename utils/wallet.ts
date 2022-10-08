import web3 from "web3";
import { Network } from "../constants/constants";

const tronRegex = new RegExp("T[A-Za-z1-9]{33}");


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
