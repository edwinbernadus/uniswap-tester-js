import service_inquiry_pair from "./service_inquiry_pair";



// for 1% pools the fee tier is 10000
// for 0.3% pools the fee tier is 3000
// for 0.05% pools the fee tier is 500
// for 0.01% pools the fee tier is 100




/**
 * @param {param_input_calc_ext} paramInput
 * @returns {param_output_calc_ext}
 *
 */
async function inquiry(paramInput) {


    let input = {
        token0Address: paramInput.token0Address,
        token0Decimals: paramInput.token0Decimals,
        token1Address: paramInput.token1Address,
        token1Decimals: paramInput.token1Decimals,
        fee: -1
    }

    try {
        let inputFee = 10000
        input.fee = inputFee
        let infoCalc = await service_inquiry_pair(input)
        infoCalc.fee = inputFee
        return infoCalc
    }
    catch (e) {
    }

    try {
        let inputFee = 3000
        input.fee = inputFee
        let infoCalc = await service_inquiry_pair(input)
        infoCalc.fee = inputFee
        return infoCalc
    }
    catch (e) {
    }

    try {
        let inputFee = 500
        input.fee = inputFee
        let infoCalc = await service_inquiry_pair(input)
        infoCalc.fee = inputFee
        return infoCalc
    }
    catch (e) {
    }

    {
        let inputFee = 100
        input.fee = inputFee
        let infoCalc = await service_inquiry_pair(input)
        infoCalc.fee = inputFee
        return infoCalc
    }
}

export default inquiry
