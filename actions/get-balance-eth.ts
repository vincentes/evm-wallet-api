import { Network, TokenType } from "../constants/constants";
import { transform, isSupportedToken } from "../utils/transform";
import { getWeb3, web3 } from "./eth/init";


const minABI : any = [
    {
        constant: true,
        inputs: [
          {
            name: "owner",
            type: "address"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
    }
];

export async function getBalance(network: Network, tokenType: TokenType, targetAddress: string) {
    const web3 = getWeb3(network);
    let tokenAddress;
    try {
        tokenAddress = transform(network, tokenType);
    } catch (error) {
        return 0;
    }

    const contract = new web3.eth.Contract(minABI, tokenAddress);
    const res = await contract.methods.balanceOf(targetAddress).call();

    return res.toString();    
}


