import { Network, NetworkId, TokenType } from "../constants/constants";
import { Priority } from "../enum/priority";
import db from "../src/wallet/models";
import { decryptPK } from "../utils/encrypt";
import { getPreferredGasPriceWei } from "../utils/gas";
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


export async function transferNative(userId: string, network: Network, tokenType: TokenType, fromAddress: string, targetAddress: string, amount: string, priority: Priority) {
  const web3 = getWeb3(network);
  let tokenAddress;
  console.log("Network", NetworkId[network]);
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

  console.log("Wallet", wallet)

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
    pk = decryptPK(wallet.UserID, tokenType, network, fromAddress, wallet.dataValues["PrivateKey"]);
  }

  const nonce = await web3.eth.getTransactionCount(
    configured ? wallet.address : wallet.Address,
    "latest"
  );

  const gasPrice = await getPreferredGasPriceWei(network, tokenType, priority);

  let tx;
  if (network === Network.BEP20) {
    tx = {
      to: targetAddress,
      value: amount,
      gasPrice: web3.utils.toWei("5", "gwei"),
      gas: '22000',
      nonce: nonce,
      from: fromAddress,
      chainId: 56,
      type: "0x0"
    };
  } else {
    tx = {
      to: targetAddress,
      value: amount,
      gasLimit: web3.utils.toHex("21000"),
      maxPriorityFeePerGas: web3.utils.toWei("5", "gwei"),
      maxFeePerGas: gasPrice,
      nonce: nonce,
      from: fromAddress
    };
  }


  console.log("tx", tx);
  console.log("gas", gasPrice.toString());
  console.log("pk", pk);

  let signedTx = await web3.eth.accounts.signTransaction(tx, pk);
  let execution = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return execution.transactionHash;
}

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
    gasPrice,
    chainId: NetworkId[network]
  };

  const signed = await web3.eth.accounts.signTransaction(options, pk);
  if (signed.rawTransaction) {
    await web3.eth.sendSignedTransaction(signed.rawTransaction);
    return signed.transactionHash;
  }

  return null;
}


