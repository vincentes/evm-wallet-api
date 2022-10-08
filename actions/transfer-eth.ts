import { Network, TokenType } from "../constants/constants";
import { Priority } from "../enum/priority";
import db from "../src/wallet/models";
import { decrypt, decryptIVPair, decryptPK } from "../utils/encrypt";
import { getPreferredGasPrice, getPreferredGasPriceWei } from "../utils/gas";
import { getConfiguredWallet, isConfiguredWallet } from "../utils/storage";
import { transform } from "../utils/transform";
import { getWeb3 } from "./eth/init";


const minABI: any = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address"
      },
      {
        name: "_value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

export async function transfer(userId: string, network: Network, tokenType: TokenType, fromAddress: string, targetAddress: string, amount: string, priority: Priority) {
  const web3 = getWeb3(network);
  let tokenAddress;
  try {
    tokenAddress = transform(network, tokenType);
  } catch (error) {
    return 0;
  }

  let wallet = await db.sequelize.models.Wallet.findOne({
    where: {
      Network: network,
      TokenName: tokenType,
      Address: fromAddress
    }
  });

  let configured = false;
  if (!wallet) {
    if (isConfiguredWallet(fromAddress)) {
      wallet = getConfiguredWallet(fromAddress);
      configured = true;
    } else {
      throw new Error("Transfer - UHW not found.");
    }
  }

  let pk;
  if (configured) {
    pk = wallet.privateKey;
  } else {
    console.log({ userId, tokenType, network, fromAddress, pk: wallet.dataValues["PrivateKey"] })
    pk = decryptPK(wallet.UserID, tokenType, network, fromAddress, wallet.dataValues["PrivateKey"]);
  }

  const contract = new web3.eth.Contract(minABI, tokenAddress);
  const account = web3.eth.accounts.privateKeyToAccount(pk);
  const tx = contract.methods.transfer(targetAddress, amount);
  const data = tx.encodeABI();

  let gas;
  try {
    gas = await tx.estimateGas({ from: account.address });
  } catch (error) {
    throw new Error("Not enough funds in the source wallet.");
  }

  const gasPrice = await getPreferredGasPriceWei(network, tokenType, priority);

  const options = {
    to: tokenAddress,
    data,
    gas,
    gasPrice
  };


  const signed = await web3.eth.accounts.signTransaction(options, pk);
  if (signed.rawTransaction) {
    await web3.eth.sendSignedTransaction(signed.rawTransaction);
    return signed.transactionHash;
  }



  return null;
}


