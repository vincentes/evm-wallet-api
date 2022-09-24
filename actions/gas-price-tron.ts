import { Action } from "../enum/actions";

export async function getGasPrice() {
    return process.env.TRC20_GAS_PRICE;
}