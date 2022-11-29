import { Network, TokenType } from "../constants/constants";
import { Priority } from "../enum/priority";
import { getConfiguredWallet, isConfiguredWallet, transform } from "../utils/storage";
import { TronHotWallet } from "./wallet-create-tron";

const eth = require('./transfer-eth');
const tron = require('./transfer-tron');

export async function transfer(userId: string, network: Network, tokenType: TokenType, fromAddress: string, targetAddress: string, amount: string, native: boolean, priority?: Priority) {
    if (network === Network.TRC20) {
        const thw = new TronHotWallet();

        const exists = await thw.exists(fromAddress);
        let wallet;

        if (exists) {
            wallet = await thw.getHotWallet(fromAddress);
        } else {
            if (isConfiguredWallet(fromAddress)) {
                wallet = getConfiguredWallet(fromAddress);
            } else {
                throw new Error("Source Wallet does not exist in the database.")
            }
        }

        return await tron.transfer(tokenType, targetAddress, amount, wallet.privateKey);
    } else {
        if (native) {
            return await eth.transferNative(userId, network, tokenType, fromAddress, targetAddress, amount, priority);
        } else {
            return await eth.transfer(userId, network, tokenType, fromAddress, targetAddress, amount, native, priority);
        }
    }
}