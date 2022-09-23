import { Network, TokenType } from "../constants/constants";
import { transform } from "../utils/storage";

const eth = require('./transfer-eth');
const tron = require('./transfer-tron');

export async function transfer(network: Network, tokenType: TokenType, targetAddress: string, amount: string) {
    const storage = transform(network, tokenType);
    if (network === Network.TRC20) {
        return await tron.transfer(tokenType, targetAddress, amount, storage.privateKey);
    } else {
        return await eth.transfer(network, tokenType, targetAddress, amount, storage.privateKey);
    }
}