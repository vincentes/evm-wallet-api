import { getWeb3 } from "../actions/eth/init";
import { Network, TokenType } from "../constants/constants";
import { Priority } from "../enum/priority";
import { transform } from "./transform";

export async function getPreferredGasPrice(network: Network, tokenType: TokenType, priority: Priority): Promise<string> {
    const web3 = getWeb3(network);
    let tokenAddress;
    try {
        tokenAddress = transform(network, tokenType);
    } catch (error) {
        return "0";
    }

    const gasPrice = await web3.eth.getGasPrice();
    const cost = web3.utils.toBN(gasPrice);

    const priorities = {
        0: web3.utils.fromWei(cost.muln(0.8)),
        1: web3.utils.fromWei(cost),
        2: web3.utils.fromWei(cost.muln(1.2))
    };

    return priorities[priority];
}

export async function getPreferredGasPriceWei(network: Network, tokenType: TokenType, priority: Priority): Promise<any> {
    const web3 = getWeb3(network);
    let tokenAddress;
    try {
        tokenAddress = transform(network, tokenType);
    } catch (error) {
        return "0";
    }

    const gasPrice = await web3.eth.getGasPrice();
    const cost = web3.utils.toBN(gasPrice);

    const priorities = {
        0: cost.muln(0.8),
        1: cost,
        2: cost.muln(1.2)
    };

    return priorities[priority];
}

