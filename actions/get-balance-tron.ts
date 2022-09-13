import { Network, TokenType } from "../constants/constants";
import { transform } from "../utils/transform";
import { Tron } from "./tron/init";

export async function getBalance(tokenType : TokenType, targetAddress : string) {
    const tokenAddress = transform(Network.TRC20, tokenType);

    try {
        let contract = await Tron.contract().at(tokenAddress);
        let result = await contract.balanceOf(targetAddress).call();
        return result.toString();
    } catch(error) {
        console.error(error);
    }
}