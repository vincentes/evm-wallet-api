import Web3 from 'web3';
import { Network, TokenType } from '../../constants/constants';

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

export let web3 = new Web3(new Web3.providers.HttpProvider(process.env.ERC20_RPC ? process.env.ERC20_RPC : ""));

export function getWeb3(network: Network) {
    const rpcUrl = process.env[network + "_RPC"];
    if (!rpcUrl) {
        throw new Error("Network not found.");
    }

    return new Web3(new Web3.providers.HttpProvider(rpcUrl));
}
