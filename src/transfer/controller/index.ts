import { Response } from "express";

import { transfer } from "../../../actions/transfer";
import { getErrorMessage, reportError } from "../../../utils/error";
import { isValidAddress } from "../../../utils/wallet";

export const withdraw = async (res: Response, parameters: any) => {
  const { UserID, Data } = parameters;
  const { TokenName, Network, Amount, AddressFrom, AddressTo, Priority, Native } = Data;

  if (!isValidAddress(AddressFrom, Network)) {
    return res.status(422).json({
      Error: "Invalid Source Wallet Address"
    });
  }

  if (!isValidAddress(AddressTo, Network)) {
    return res.status(422).json({
      Error: "Invalid Destination Wallet Address"
    });
  }

  try {
    const tx = await transfer(UserID, Network, TokenName, AddressFrom, AddressTo, Amount, Native, Priority);
    return res.status(200).json({
      TxHash: tx,
      Status: "Confirmed"
    });
  } catch (error) {
    const message = getErrorMessage(error);
    reportError(error);
    return res.status(422).json({
      msg: message
    });
  }
};

export default {
  withdraw
}