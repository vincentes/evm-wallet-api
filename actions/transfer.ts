import { Network, TokenType } from "../constants/constants";
import { Priority } from "../enum/priority";
import { getConfiguredWallet, transform } from "../utils/storage";
import { ApproHotWallet } from "./wallet-create-eth";
import { TronHotWallet } from "./wallet-create-tron";

const eth = require('./transfer-eth');
const tron = require('./transfer-tron');

export async function transfer(network: Network, tokenType: TokenType, fromAddress: string, targetAddress: string, amount: string, priority?: Priority) {
    if (network === Network.TRC20) {
        const thw = new TronHotWallet();

        const exists = await thw.exists(fromAddress);
        let wallet;

        if (exists) {
            wallet = await thw.getHotWallet(fromAddress);
        } else {
            wallet = getConfiguredWallet(fromAddress);
        }

        return await tron.transfer(tokenType, targetAddress, amount, wallet.privateKey);
    } else {
        const uhw = new ApproHotWallet();

        const exists = await uhw.exists(fromAddress);
        let wallet;

        if (exists) {
            wallet = await uhw.getHotWallet(fromAddress);
        } else {
            wallet = getConfiguredWallet(fromAddress);
        }

        return await eth.transfer(network, tokenType, targetAddress, amount, wallet.privateKey, priority);
    }
}