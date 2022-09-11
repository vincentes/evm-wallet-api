require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const TronWeb = require('tronweb')

console.log("process", process.env.TRC20_RPC)

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(process.env.TRC20_RPC);
const solidityNode = new HttpProvider(process.env.TRC20_RPC);
const eventServer = new HttpProvider(process.env.TRC20_RPC);

export const Tron = new TronWeb(fullNode, solidityNode, eventServer, process.env.TRON_READ_PRIVATE_KEY);
console.log("Tron", Tron);