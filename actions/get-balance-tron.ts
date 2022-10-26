import { Network, TokenType } from "../constants/constants";
import { transform } from "../utils/transform";
import { Tron } from "./tron/init";

export async function getBalance(tokenType: TokenType, targetAddress: string) {
    const tokenAddress = transform(Network.TRC20, tokenType);

    try {
        let contract = await Tron.contract().at(tokenAddress);
        const nativeBalance = await Tron.trx.getBalance(targetAddress);
        let tokenBalance = await contract.balanceOf(targetAddress).call();
        return {
            NativeBalance: nativeBalance.toString(),
            TokenBalance: tokenBalance.toString()
        };
    } catch (error) {
        console.error(error);
    }
}


