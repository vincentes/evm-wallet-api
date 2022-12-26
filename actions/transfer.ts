import { Network, TokenType } from "../constants/constants";
import { Priority } from "../enum/priority";
import { getConfiguredWallet, isConfiguredWallet, transform } from "../utils/storage";
import { TronHotWallet } from "./wallet-create-tron";
import { getWalletInfo } from "./wallet-info";

const eth = require('./transfer-eth');
const tron = require('./transfer-tron');

export async function transfer(userId: string, network: Network, tokenType: TokenType, fromAddress: string, targetAddress: string, amount: string, native: boolean, priority?: Priority) {
    if (network === Network.TRC20) {
        let wallet = await getWalletInfo(userId, tokenType, network, fromAddress);
        console.log("wallet", wallet);
        if (native) {
            return await tron.transferNative(tokenType, targetAddress, amount, wallet["PrivateKey"] ? wallet["PrivateKey"] : wallet["privateKey"]);
        } else {
            return await tron.transfer(tokenType, targetAddress, amount, wallet["PrivateKey"] ? wallet["PrivateKey"] : wallet["privateKey"]);
        }

    } else {
        if (native) {
            return await eth.transferNative(userId, network, tokenType, fromAddress, targetAddress, amount, priority);
        } else {
            return await eth.transfer(userId, network, tokenType, fromAddress, targetAddress, amount, native, priority);
        }
    }
}