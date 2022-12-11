import { ethers } from 'ethers'
import {ABI_COIN} from "./global_param";

/**
 * @returns {coin} Coin
 */
async function inquiry(contractAddress,target_address) {
    let abiContract = ABI_COIN
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abiContract, provider)
    let name = await contract.name()
    let symbol = await contract.symbol()
    let decimals = await contract.decimals()
    let balance = await contract.balanceOf(target_address)

    let output = {
        name,
        symbol,
        decimals,
        balance
    }
    return output
}


export default inquiry
