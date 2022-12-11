import {ABI_FACTORY, PARAM_V3_FACTORY} from "./global_param";
import { ethers } from 'ethers'
import { Pool } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'





async function findPoolAddress(token0Address, token1Address, fee) {
    let contractAddress = PARAM_V3_FACTORY
    let abiContract = ABI_FACTORY
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abiContract, provider)
    let address = await contract.getPool(token0Address, token1Address, fee)
    return address
}

function generatePoolContract(poolAddress){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider)
    return poolContract
}


async function getPoolImmutables(poolAddress) {
    let poolContract = generatePoolContract(poolAddress)
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
        poolContract.factory(),
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.maxLiquidityPerTick(),
    ])
    const immutables= {
        factory,
        token0,
        token1,
        fee,
        tickSpacing,
        maxLiquidityPerTick,
    }
    return immutables
}

async function getPoolState(poolAddress) {
    let poolContract = generatePoolContract(poolAddress)
    const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()])

    const PoolState ={
        liquidity,
        sqrtPriceX96: slot[0],
        tick: slot[1],
        observationIndex: slot[2],
        observationCardinality: slot[3],
        observationCardinalityNext: slot[4],
        feeProtocol: slot[5],
        unlocked: slot[6],
    }

    return PoolState
}



/**
 * @param {param_input_calc_ext} input
 * @returns {param_output_calc_ext}
 *
 */
async function calc(input) {
    let token0Address = input.token0Address
    let token0Decimal = input.token0Decimals
    let token1Address = input.token1Address
    let token1Decimal = input.token1Decimals
    let fee = input.fee

    let poolAddress = await findPoolAddress(token0Address, token1Address, fee)
    const [immutables, state] = await Promise.all([getPoolImmutables(poolAddress), getPoolState(poolAddress)])
    const TokenA = new Token(3, immutables.token0, token0Decimal, 'SYM0', 'NAME0')
    const TokenB = new Token(3, immutables.token1, token1Decimal, 'SYM1', 'NAME1')
    const poolExample = new Pool(
        TokenA,
        TokenB,
        immutables.fee,
        state.sqrtPriceX96.toString(),
        state.liquidity.toString(),
        state.tick
    )


    var tokenARate = poolExample.priceOf(TokenA)
    var tokenBRate = poolExample.priceOf(TokenB)

    let result = {
        token0Rate : tokenARate.toFixed(token0Decimal),
        token1Rate : tokenBRate.toFixed(token1Decimal),
        poolAddress : poolAddress
    }

    if (token0Address.toLowerCase() == poolExample.token0.address.toLowerCase()) {
        result = {
            token0Rate : tokenBRate.toFixed(token1Decimal),
            token1Rate : tokenARate.toFixed(token0Decimal),
            poolAddress : poolAddress
        }
    }
    return result

}

export default calc
