import Web3 from 'web3';

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

export const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ERC20_RPC ? process.env.ERC20_RPC : ""));
