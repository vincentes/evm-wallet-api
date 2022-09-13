import { Network, TokenType } from "../constants/constants";
import { transform, isSupportedToken } from "../utils/transform";
import { web3 } from "./eth/init";


const minABI : any = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    }];

export async function getBalance(tokenType: TokenType, targetAddress: string) {
    const tokenAddress = transform(Network.ERC20, tokenType);
    const contract = new web3.eth.Contract(minABI, tokenAddress);
    const res = await contract.methods.balanceOf(targetAddress).call();
    return res.toString();
}