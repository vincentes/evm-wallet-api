import { Network, TokenType } from "../constants/constants";

interface TokenList {
    readonly DAI?: string;
    readonly USDT?: string;
    readonly USDC?: string;
    readonly IDRT?: string;
}

interface NetworkTokenMap {
    readonly TRC20: TokenList;
    readonly ERC20: TokenList;
    readonly BEP20: TokenList;
}

const Map : NetworkTokenMap = {
    TRC20: {
        USDT: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
    },
    ERC20: {
        USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    },
    BEP20: {
        DAI: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
        IDRT: '0x998FFE1E43fAcffb941dc337dD0468d52bA5b48A'
    }
}

export function isSupportedToken(network: Network, tokenType: TokenType) {
    return tokenType in Map[network];
}

export function isSupportedNetwork(network: Network) {
    return network in Map;
}

export function transform(network: Network, tokenType: TokenType) {
    console.log(tokenType);
    
    if (isSupportedToken(network, tokenType)) {
        return Map[network][tokenType];        
    }

    throw new Error("Token not supported in the specified network.");
}

