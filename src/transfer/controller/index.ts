import { Response } from "express";

import { transfer } from "../../../actions/transfer";
import { getErrorMessage, reportError } from "../../../utils/error";

export const withdraw = async (res: Response, parameters: any) => {
  const { UserID, Data } = parameters;
  const { TokenName, Network, Amount, FromAddress, TargetAddress, Priority } = Data;

  try {
    const tx = await transfer(UserID, Network, TokenName, FromAddress, TargetAddress, Amount, Priority);
    return res.status(200).json({
      TxHash: tx,
      Status: "Confirmed"
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
  withdraw
}