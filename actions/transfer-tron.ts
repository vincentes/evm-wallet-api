import { Network, TokenType } from "../constants/constants";
import { transform } from "../utils/transform";
import { getTronWalletInterface } from "./tron/init";

export async function transfer(tokenType : TokenType, targetAddress : string, amount : string, privateKey : string) {
    const contractAddress = transform(Network.TRC20, tokenType);
    const SpecificWallet = getTronWalletInterface(privateKey);

    let contract = await SpecificWallet.contract().at(contractAddress);
    let result = await contract.transfer(targetAddress, amount).send();
    console.log(result);
    return result.toString();
}