import { Network, TokenType } from "../constants/constants";
import { transform } from "../utils/transform";
import { getTronWalletInterface, Sdk } from "./tron/init";
const { ethers } = require("ethers");


import { TronFeeAction } from "../enum/actions";

export async function transfer(tokenType: TokenType, targetAddress: string, amount: string, privateKey: string) {
    const contractAddress = transform(Network.TRC20, tokenType);
    const SpecificWallet = getTronWalletInterface(privateKey);
    try {
        let contract = await SpecificWallet.contract().at(contractAddress);
        let result = await contract.transfer(targetAddress, amount).send();
        return result.toString();
    } catch (error) {
        throw new Error("Could not transfer from the specified address. Please check the balance.");
    }
}

export async function transferNative(tokenType: TokenType, targetAddress: string, amount: string, privateKey: string) {
    console.log("pk", privateKey)
    const SpecificWallet = getTronWalletInterface(privateKey);
    const tradeObject = await SpecificWallet.transactionBuilder.sendTrx(
        targetAddress,
        amount,
        SpecificWallet.address
    );
    console.log("trade", tradeObject)

    const signedtxn = await SpecificWallet.trx.sign(
        tradeObject,
        privateKey
    );
    const receipt = await SpecificWallet.trx.sendRawTransaction(
        signedtxn
    );
    console.log("receipt", receipt)

    return receipt.txid;
}

export async function gasEstimate(network: Network, tokenType: TokenType, targetAddress: string, privateKey: string, amount: number) {
    const contractAddress = transform(Network.TRC20, tokenType);
    const SpecificWallet = getTronWalletInterface(privateKey);
    let encodedParams = ethers.utils.solidityKeccak256(['address', 'uint256'], [targetAddress, amount]);
    if (contractAddress) {
        const response = Sdk.triggerConstantContract(TronFeeAction.Transfer(SpecificWallet.address, contractAddress, "transfer(address,uint256)", encodedParams))
            .then((res: any) => console.log(res))
            .catch((err: any) => console.error(err));
        return response["energy_used"];

    }
    return 0;

}