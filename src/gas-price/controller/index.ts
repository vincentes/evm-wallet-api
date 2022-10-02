import { Response } from "express";
import conversion from "../../../actions/convert";
import { getGasPrice } from "../../../actions/gas-price";
import { Fiat, NativeCurrency, Network, NetworkToNativeCurrency, StableCoinToFiat, TokenType } from "../../../constants/constants";

import { getErrorMessage, reportError } from "../../../utils/error";

type Parameters = {
  Data: {
    TokenName: TokenType,
    Network: Network,
    Amount: string,
    Address: string,
  },
}

export const gasPrice = async (res: Response, parameters: Parameters) => {
  const { Data } = parameters;
  const { TokenName, Network, Amount, Address } = Data;

  try {
    const tx = await getGasPrice(Network, TokenName, Address, Amount);
    console.log("tx", tx);
    if (Network === "TRC20") {
      const trx = parseInt(tx["TRX"]) / 1000000;
      const fiat = await conversion(NetworkToNativeCurrency[Network], StableCoinToFiat[TokenName], trx);
      return res.status(200).json({
        Amount,
        TokenName,
        Network,
        GasFee: fiat
      });
    } else {
      const lowFiat = await conversion(NetworkToNativeCurrency[Network], StableCoinToFiat[TokenName], parseFloat(tx["Low"]));
      const medFiat = await conversion(NetworkToNativeCurrency[Network], StableCoinToFiat[TokenName], parseFloat(tx["Medium"]));
      const highFiat = await conversion(NetworkToNativeCurrency[Network], StableCoinToFiat[TokenName], parseFloat(tx["High"]));
      return res.status(200).json({
        Amount,
        TokenName,
        Network,
        GasFee: {
          Low: lowFiat,
          Medium: medFiat,
          High: highFiat
        }
      });
    }

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