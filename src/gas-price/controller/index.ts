import { Response } from "express";
import { getGasPrice } from "../../../actions/gas-price";

import { getErrorMessage, reportError } from "../../../utils/error";

export const gasPrice = async (res : Response, parameters : any) => {
  const { Data } = parameters;
  const { TokenName, Network, Amount, Address } = Data;

  try {
    const tx = await getGasPrice(Network, TokenName, Address, Amount);
    return res.status(200).json({
      ...tx,
      msg: "OK"
    });
  } catch (error) {
    const message = getErrorMessage(error);
    reportError(error);
    return res.status(502).json({
      msg: message
    });
  }
};

export default {
  gasPrice
}