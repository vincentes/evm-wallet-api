import { Network, TokenType } from "../constants/constants";
import config from "../config";


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
