// import  serviceCalc  from './service_calc'
import  serviceCalcTwo  from './service_calc'
import  serviceTrade  from './service_trade'
import {BigNumber} from "ethers";

// 000 000 000
// 000 000 000
// 1000000000000000000

export default async function execute() {
    console.log("test call start")

    testBigNumber()
    // calc2();
    // await calc()
    // trade()
}

function testBigNumber(){
    console.log("test big number")




    let number1 = 70754076304294230
    let amount = BigNumber.from(number1.toString())
    let number2 = 70754076304294222
    let balance = BigNumber.from(number2.toString())

    // let number1 = 1001
    // let amount = BigNumber.from(number1)
    // let number2 = 1000
    // let balance = BigNumber.from(number2)

    console.log("number1",number1)
    console.log("number2",number2)

    console.log("amount",amount)
    console.log("balance",balance)

    if (amount.gt(balance)){
        console.log("output1 > output2")
        console.log("amount more than balance")
    }
    else {
        console.log("output1 <= output2")
    }
}


function trade(){
    /** @type {param_input_trade} */
    let input2 = {
        //weth
        tokenOutAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        //uniswap
        tokenInAddress: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        fee: 3000,
        amountIn : 7000000
    }

    serviceTrade(input2)

}

async function calc2() {

    {
        let input2 = {
            token0Decimals: 18,
            token0Address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",

            token1Decimals: 18,
            token1Address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
            fee: 3000,
        }


        {
            try {
                let r = await serviceCalcTwo(input2)
                console.log("rate",  r)
            }
            catch (e) {
                console.log("error", e)
            }

        }
    }

    {
        let input2 = {
            token0Decimals: 18,
            token0Address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",

            token1Decimals: 18,
            token1Address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
            fee: 3000,
        }


        {
            try {
                let r = await serviceCalcTwo(input2)
                console.log("rate", r)
            }
            catch (e) {
                console.log("error", e)
            }

        }
    }

}




async function calc() {

    /** @type {param_input_calc} */
    let input = {
        myAddress: "0x5c9Dd957247063E91c3D7C58f41B8583B260aA5a",
        chainId: 5,
        inputAmount: "8" * 1000000000000000000,
        slippageTolerance: 0,

        token0Name: "Wrapped Ether",
        token0Decimals: 18,
        token0Address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        token0Symbol: "WETH",

        token1Name: "Uniswap Token",
        token1Decimals: 18,
        token1Address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        token1Symbol: "UNI",

    }

    // let result = await serviceCalc(input);
    // console.log("result",result)


    /** @type {param_input_calc_ext} */
    let input2 = {
        token0Decimals: 18,
        // token0Address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        token0Address: "0xde637d4c445ca2aae8f782ffac8d2971b93a4998",

        token1Decimals: 18,
        // token1Address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        token1Address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        fee: -1,
    }


    {
        try {
            let fee = 100
            input2.fee = fee
            let r = await serviceCalcTwo(input2)
            console.log("rate", fee, r)
        }
        catch (e) {
            console.log("error", e)
        }

    }
    {
        try {
            let fee = 500
            input2.fee = fee
            let r = await serviceCalcTwo(input2)
            console.log("rate", fee, r)
        } catch (e) {
            console.log("error", e)
        }
    }
    {
        try {
        let fee = 3000
        input2.fee = fee
        let r = await serviceCalcTwo(input2)
        console.log("rate", fee, r)
        }
        catch (e) {
            console.log("error", e)
        }
    }
    {
        try {
        let fee = 10000
        input2.fee = fee
        let r = await serviceCalcTwo(input2)
        console.log("rate", fee, r)
        }
        catch (e) {
            console.log("error", e)
        }
    }
}

