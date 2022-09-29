import { Network, TokenType } from "../constants/constants";
import { Priority } from "../enum/priority";
import { getPreferredGasPrice, getPreferredGasPriceWei } from "../utils/gas";
import { transform } from "../utils/transform";
import { getWeb3 } from "./eth/init";


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

export async function transfer(network: Network, tokenType : TokenType, targetAddress : string, amount : string, privateKey : string, priority : Priority) {
    const web3 = getWeb3(network);
    let tokenAddress;
    try {
        tokenAddress = transform(network, tokenType);
    } catch (error) {
        return 0;
    }

    const contract = new web3.eth.Contract(minABI, tokenAddress);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const tx = contract.methods.transfer(targetAddress, amount);
  
    const options = {
        to: tokenAddress,
        data: tx.encodeABI(),
        gas: await tx.estimateGas({from: account.address}),
        gasPrice: await getPreferredGasPriceWei(network, tokenType, priority)
    };

    const signed = await web3.eth.accounts.signTransaction(options, privateKey);
    if (signed.rawTransaction) {
      web3.eth.sendSignedTransaction(signed.rawTransaction);
      return signed.transactionHash;  
    }
  
    return null;
}


