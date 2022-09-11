import { Network, TokenType } from "../constants/constants";

const Map = {
    TRC20: {
        USDT: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
    },
    ERC20: {
        USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7'
    }
}

export default function transform(network: Network, tokenType: TokenType) {
    return Map[network][tokenType];
}