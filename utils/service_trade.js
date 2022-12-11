import { ethers } from "ethers";
import {ABI_ROUTER, PARAM_V3_SWAP_ROUTER_ADDRESS} from "./global_param";


/**
 * @param {param_input_trade} input
 */
export default async function execute(input) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const walletAddress = accounts[0]    // first account in MetaMask
  const signer = provider.getSigner(walletAddress)

  let contractAddress = PARAM_V3_SWAP_ROUTER_ADDRESS
  const contract = new ethers.Contract(contractAddress, ABI_ROUTER, signer)

  const order = {
    "tokenIn": input.tokenInAddress,
    "tokenOut": input.tokenOutAddress,
    "fee": input.fee,
    "recipient": walletAddress,
    "amountIn": input.amountIn,
    "amountOutMinimum": 0,

    "deadline": Math.floor(Date.now() / 1000) + 1200,
    "sqrtPriceLimitX96": 0
  };


  const transaction = await contract.exactInputSingle(order)
  const transactionReceipt = await transaction.wait();
  if (transactionReceipt.status !== 1) {
    alert('error message');
  }
  console.log("transactionReceipt",transactionReceipt,transactionReceipt.transactionHash)

  return transactionReceipt.transactionHash


};


