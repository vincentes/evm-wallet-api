import { Network } from "../constants/constants";

export type Wallet = {
    privateKey: any;
    address: string,
    network: Network,
    configured: boolean
}