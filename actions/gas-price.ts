import { Network, TokenType } from "../constants/constants";
import { transform } from "../utils/storage";

const eth = require('./gas-price-eth');
const tron = require('./gas-price-tron');

export async function getGasPrice(network: Network, tokenType: TokenType, targetAddress : string, amount : string) {
    const storage = transform(network, tokenType);
    console.log("storage", storage);
    if (network === Network.TRC20) {
        return {
            Estimate: await tron.getGasPrice(network, tokenType, targetAddress, amount, storage.privateKey)
        }
    } else {
        return await eth.getGasPrice(network, tokenType, targetAddress, amount, storage.privateKey);
    }
}