// @ts-nocheck

import convert from 'crypto-convert';

type Fiat = typeof convert.list.fiat[number];
type Crypto = typeof convert.list.crypto[number];


export default async function conversion(from: Fiat | Crypto, to: Fiat | Crypto, amount: number) {
    await convert.ready();
    const result = convert[from][to](amount);
    return result;
}