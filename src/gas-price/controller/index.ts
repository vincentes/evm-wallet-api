import { Response } from "express";
import conversion from "../../../actions/convert";
import { getGasPrice } from "../../../actions/gas-price";
import { Network, NetworkToNativeCurrency, StableCoinToFiat, TokenType } from "../../../constants/constants";

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
    if (Network === "TRC20") {
      const trx = parseInt(tx["TRX"]) / 1000000;
      const fiat = await conversion(NetworkToNativeCurrency[Network], StableCoinToFiat[TokenName], trx);
      return res.status(200).json({
        Amount,
        TokenName,
        Network,
        GasFee: {
          Fiat: fiat,
          Native: trx
        }
      });
    } else {
      const lowFiatTx = conversion(NetworkToNativeCurrency[Network], StableCoinToFiat[TokenName], parseFloat(tx["Low"]));
      const medFiatTx = conversion(NetworkToNativeCurrency[Network], StableCoinToFiat[TokenName], parseFloat(tx["Medium"]));
      const highFiatTx = conversion(NetworkToNativeCurrency[Network], StableCoinToFiat[TokenName], parseFloat(tx["High"]));
      const [lowFiat, medFiat, highFiat] = await Promise.all([lowFiatTx, medFiatTx, highFiatTx]);

      return res.status(200).json({
        Amount,
        TokenName,
        Network,
        GasFee: {
          Fiat: {
            Low: lowFiat,
            Medium: medFiat,
            High: highFiat
          },
          Native: {
            Low: tx["Low"],
            Medium: tx["Medium"],
            High: tx["High"]
          }
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