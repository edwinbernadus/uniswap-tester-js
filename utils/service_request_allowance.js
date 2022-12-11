import { ethers } from "ethers";
import {ABI_COIN, ABI_ROUTER, PARAM_V3_SWAP_ROUTER_ADDRESS} from "./global_param";


export default async function execute(coin_address,amount) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const walletAddress = accounts[0]    // first account in MetaMask
  const signer = provider.getSigner(walletAddress)

  let swapRouterAddress = PARAM_V3_SWAP_ROUTER_ADDRESS


  const contract = new ethers.Contract(coin_address, ABI_COIN, signer)


  // let number1 = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
  let number1 = amount.toString()

  const transaction = await contract.approve(swapRouterAddress,number1)
  const transactionReceipt = await transaction.wait();
  if (transactionReceipt.status !== 1) {
    alert('error message');
  }




};


