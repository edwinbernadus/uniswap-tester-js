import { ethers } from "ethers";
import {ABI_COIN, ABI_ROUTER, PARAM_V3_SWAP_ROUTER_ADDRESS} from "./global_param";



export default async function execute(coin_address) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let swapRouterAddress = PARAM_V3_SWAP_ROUTER_ADDRESS

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const walletAddress = accounts[0]    // first account in MetaMask
  const contract = new ethers.Contract(coin_address, ABI_COIN, provider)


  const amount = await contract.allowance(walletAddress,swapRouterAddress)
  return amount

};


