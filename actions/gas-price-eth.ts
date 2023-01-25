import { Network, TokenType } from "../constants/constants";
import { transform } from "../utils/transform";
import { getWeb3 } from "./eth/init";


const minABI: any = [
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

export async function getGasPrice(network: Network, tokenType: TokenType, targetAddress: string, amount: string, privateKey: string) {
  const web3 = getWeb3(network);
  let tokenAddress;
  try {
    tokenAddress = transform(network, tokenType);
  } catch (error) {
    return {};
  }

  const contract = new web3.eth.Contract(minABI, tokenAddress);
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const tx = contract.methods.transfer(targetAddress, "1");

  const gas = await tx.estimateGas({ from: account.address });
  const gasPrice = await web3.eth.getGasPrice();
  const cost = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(gas));

  return {
    Low: web3.utils.fromWei(cost.muln(0.8)),
    Medium: web3.utils.fromWei(cost),
    High: web3.utils.fromWei(cost.muln(1.2))
  };
}