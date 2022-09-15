import { Network, TokenType } from "../constants/constants";

const eth = require('./get-balance-eth');
const tron = require('./get-balance-tron');

export async function getBalance(network: Network, tokenType: TokenType, address: string) {
    

    if(network === Network.TRC20) {
        return await tron.getBalance(tokenType, address);
    } else {
        return await eth.getBalance(network, tokenType, address);
    }
}