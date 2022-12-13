export enum TokenType {
    USDT = "USDT",
    IDRT = "IDRT"
}

export enum NativeCurrency {
    TRX = "TRX",
    ETH = "ETH",
    BNB = "BNB"
}

export enum Fiat {
    USD = "USD",
    IDR = "IDR"
}

export enum Network {
    TRC20 = "TRC20",
    ERC20 = "ERC20",
    BEP20 = "BEP20"
}

export const NetworkId = {
    ERC20: 1,
    BEP20: 56
}

export const StableCoinToFiat = {
    USDT: Fiat.USD,
    IDRT: Fiat.IDR
}

export const NetworkToNativeCurrency = {
    ERC20: NativeCurrency.ETH,
    BEP20: NativeCurrency.BNB,
    TRC20: NativeCurrency.TRX
}