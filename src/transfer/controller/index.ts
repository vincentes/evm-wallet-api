import { Response } from "express";

import { transfer } from "../../../actions/transfer";
import { getErrorMessage, reportError } from "../../../utils/error";

export const withdraw = async (res : Response, parameters : any) => {
  const { Data } = parameters;
  const { TokenName, Network, Amount, Address } = Data;

  try {
    const tx = await transfer(Network, TokenName, Address, Amount);
    return res.status(200).json({
      hash: tx,
      msg: "OK"
    });
  } catch (error) {
    const message = getErrorMessage(error);
    reportError({ message });
    return res.status(502).json({
      msg: message
    });
  }
};

export default {
  withdraw
}