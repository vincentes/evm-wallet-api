import { Network, TokenType } from "../constants/constants";
import { transform } from "../utils/storage";

const eth = require('./gas-price-eth');
const tron = require('./gas-price-tron');

export async function getGasPrice(network: Network, tokenType: TokenType, targetAddress: string, amount: string) {
    const storage = transform(network, tokenType);
    const energy = await tron.getGasPrice(network, tokenType, targetAddress, amount, storage.privateKey);
    const keyExists = "ENERGY_SUN_RATIO" in process.env;
    if (!keyExists || !process.env.ENERGY_SUN_RATIO) {
        throw new Error("Could not find a configured energy and sun ratio.");
    }

    const ratio: number = parseInt(process.env.ENERGY_SUN_RATIO);
    const trxCost = ratio * energy;

    if (network === Network.TRC20) {
        return {
            Energy: energy,
            TRX: trxCost.toString()
        }
    } else {
        return await eth.getGasPrice(network, tokenType, targetAddress, amount, storage.privateKey);
    }
}