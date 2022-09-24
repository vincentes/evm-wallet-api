import { getWeb3 } from "../actions/eth/init";
import { Network, TokenType } from "../constants/constants";
import { Priority } from "../enum/priority";
import { transform } from "./transform";



const minABI : any = [
    {
        constant: false,
        inputs: [
          {
            name: "_to",
            type: "address"
          },
          {
            name: "_value",
            type: "uint256"
          }
        ],
        name: "transfer",
        outputs: [
          {
            name: "",
            type: "bool"
          }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      }
];

export async function getPreferredGasPrice(network: Network, tokenType : TokenType, priority : Priority) : Promise<string> {
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