import { Network, TokenType } from "../constants/constants";
import config from "../config";
import { Wallet } from "../types/wallet";

export function isSupportedToken(network: Network, tokenType: TokenType) {
    return tokenType in config["WALLETS"][network];
}

export function isSupportedNetwork(network: Network) {
    return network in config["WALLETS"];
}

export function transform(network: Network, tokenType: TokenType) {
    if (isSupportedToken(network, tokenType)) {
        return config["WALLETS"][network][tokenType];
    }

    throw new Error("Token not supported in the specified network.");
}

export function isConfiguredWallet(address: string) {
    return config.WALLETS_LIST.map((wallet: any) => wallet.address).includes(address);
}

export function isConfiguredWalletFor(address: string, network: string, tokenName: string) {
    if (network in config.WALLETS && tokenName in config.WALLETS[network] && config.WALLETS[network][tokenName].address === address) {
        return true;
    }
    return false;
}

export function isInvalidConfig(address: string, network: string, tokenName: string) {
    return isConfiguredWallet(address) && !isConfiguredWalletFor(address, network, tokenName);
}

export function getConfiguredWallet(address: string): Wallet {
    let configuredWallet: any;
    if (!config.WALLETS_LIST.map((wallet: any) => wallet.address).includes(address)) {
        throw new Error("Wallet is not configured.");
    }

    config.WALLETS_LIST.forEach((wallet: any) => {
        if (wallet.address === address) {
            configuredWallet = wallet;
        }
    });


    return configuredWallet;
}
