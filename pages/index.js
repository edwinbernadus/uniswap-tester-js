import { useState, useEffect } from "react";
import Metamask from "../component/metamask";
import testCall from "../utils/test_service_calc";
import service_inquiry_coin from "../utils/service_inquiry_coin";
import service_calc from "../utils/service_calc";
import service_trade from "../utils/service_trade";
import {ethers} from "ethers";
import service_inquiry_allowance from "../utils/service_inquiry_allowance";
import service_request_allowance from "../utils/service_request_allowance";
import {BigNumber} from "ethers";

const Index = () => {


  const [haveMetamask, sethaveMetamask] = useState(true);

  const [client, setclient] = useState({
    isConnected: false,
  });

  const [tokenInfo, setTokenInfo] = useState({
    token0Address: "",
    token1Address: "",
    fee: 0,
    input_amount: 0,
    amount_target : -1,
    is_swap_button_visible : false,
    /**
     * @type {coin} Coin
     */
    coin0Info: [],
    /**
     * @type {coin} Coin
     */
    coin1Info: [],
    token0Rate: -1,
    token1Rate: -1,
    poolAddress : "no_data"
  });


  const [statusInfo, setStatusLoading] = useState("no_data")



  function generateSample() {
    let sample = {
      token0Address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", // weth
      token1Address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // uni

      // token0Address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // uni
      // token1Address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", // weth

      // token0Address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // uni
      // token1Address: "0xde637d4c445ca2aae8f782ffac8d2971b93a4998", // usdc



      fee: -1,

      input_amount: 0.012,

    }
    return sample
  }

  function updateStatus(input){
    setStatusLoading(input)
    if (input != ""){
      setTokenInfo((p) => ({ ...p, is_swap_button_visible : false }));
    }
    else {
      setTokenInfo((p) => ({ ...p, is_swap_button_visible : true }));
    }
  }

  async function loadingStart() {

    // testCall()
    // return

    if (window.ethereum.networkVersion != 5){
        alert("Please connect to Goerli Test Network")
        return
    }

    let sample = generateSample()



    updateStatus("loading")

    setTokenInfo((p) => ({ ...p,
      token0Address: sample.token0Address,
      token1Address: sample.token1Address,
      fee: sample.fee,
      input_amount: sample.input_amount,
    }));

    updateStatus("loading token 0")
    let inputCoin0 = await updateCoin0(sample.token0Address)
    updateStatus("loading token 1")
    let inputCoin1 = await updateCoin1(sample.token1Address)

    updateStatus("loading token rate")
    let tokenRate = await updateTokenRate(inputCoin0,inputCoin1,sample.token0Address,sample.token1Address)
    let isValid = tokenRate.is_valid

    let token1Rate = tokenRate.token1Rate
    let input_amount = sample.input_amount

    updateStatus("loading output amount")
    await updateOutputAmount(token1Rate,input_amount)
    if (isValid){
      updateStatus("")
    }
    else {
      updateStatus("Insufficient liquidity for this trade.")
    }
  }

  async function updateOutputAmount(token1Rate,input_amount){

    if (token1Rate > 0 && input_amount > 0){
      let amount_target = input_amount * token1Rate
      setTokenInfo((p) => ({ ...p,
        amount_target : amount_target
      }));
    }
    else {

      let amount_target = 0
      setTokenInfo((p) => ({ ...p,
        amount_target : amount_target
      }));
    }
  }

  async function updateCoin0(address){
    const accounts = await ethereum.request({method: "eth_accounts"});
    let account = accounts[0]
    let input_coin = await service_inquiry_coin(address, account)
    setTokenInfo((p) => ({ ...p,
      coin0Info: input_coin,
    }));
    return input_coin
  }

  async function updateCoin1(address){
    const accounts = await ethereum.request({method: "eth_accounts"});
    let account = accounts[0]
    let input_coin = await service_inquiry_coin(address, account)
    setTokenInfo((p) => ({ ...p,
      coin1Info: input_coin,
    }));
    return input_coin
  }


  /**
   * @returns {param_output_update_token_rate}
   *
   */
  async function updateTokenRate(inputCoin0,inputCoin1,token0Address,token1Address) {
    if (inputCoin0?.symbol != null && inputCoin1?.symbol != null) {
      let input = {
        token0Address: token0Address,
        token0Decimals: inputCoin0.decimals,
        token1Address: token1Address,
        token1Decimals: inputCoin1.decimals,
      }

      try {
        let infoCalc = await service_calc(input)
        setTokenInfo((p) => ({ ...p,
          token0Rate: infoCalc.token0Rate,
          token1Rate: infoCalc.token1Rate,
          poolAddress: infoCalc.poolAddress
        }));


        setTokenInfo((p) => ({ ...p,
          fee: infoCalc.fee,
        }));


        /**
         * @type {param_output_update_token_rate}
         */
        let output = infoCalc
        output.is_valid = true
        return output
      }
      catch (e){
        let token0Rate = 0
        let token1Rate = 0
        let poolAddress = "no_data"
        setTokenInfo((p) => ({ ...p,
          token0Rate: token0Rate,
          token1Rate: token1Rate,
          poolAddress: poolAddress
        }));

        /**
         * @type {param_output_update_token_rate}
         */
        let output = []
        output.is_valid = false
        return output
      }
    }
    else {
      let output = []
      output.is_valid = false
      return output
    }
  }


  async function changeCoin0() {
    updateStatus("loading coin 0")
    setTokenInfo((p) => ({ ...p,
      coin0Info: [],
    }));

    let inputCoin0 = await updateCoin0(tokenInfo.token0Address)
    let inputCoin1 = tokenInfo.coin1Info
    let tokenRate = await updateTokenRate(inputCoin0,inputCoin1,tokenInfo.token0Address,tokenInfo.token1Address)
    let isValid = tokenRate.is_valid
    // vm.amount = 0

    let token1Rate = tokenInfo.token1Rate
    let input_amount = tokenInfo.input_amount
    await updateOutputAmount(token1Rate,input_amount)
    if (isValid){
      updateStatus("")
    }
    else {
      updateStatus("Insufficient liquidity for this trade.")
    }

  }

  async function changeCoin1() {
    updateStatus("loading coin 1")
    setTokenInfo((p) => ({ ...p,
      coin1Info: [],
    }));


    let inputCoin0 = tokenInfo.coin0Info
    let inputCoin1 = await updateCoin1(tokenInfo.token1Address)

    let token1Rate = tokenInfo.token1Rate
    let input_amount = tokenInfo.input_amount
    await updateOutputAmount(token1Rate,input_amount)

    let tokenRate = await updateTokenRate(inputCoin0,inputCoin1,tokenInfo.token0Address,tokenInfo.token1Address)
    let isValid = tokenRate.is_valid
    if (isValid){
      updateStatus("")
    }
    else {
      updateStatus("Insufficient liquidity for this trade.")
    }
  }

  async function changeInputAmount(e) {
    let amount = e.target.value
    setTokenInfo((p) => ({ ...p,
      input_amount: amount,
    }));
    let token1Rate = tokenInfo.token1Rate
    let input_amount = amount
    await updateOutputAmount(token1Rate,input_amount)
  }



  const checkConnection = async () => {
    const {ethereum} = window;
    if (ethereum) {
      sethaveMetamask(true);
      const accounts = await ethereum.request({method: "eth_accounts"});
      if (accounts.length > 0) {
        setclient({
          isConnected: true,
          address: accounts[0],
        });
        await loadingStart();
        return true
      } else {
        setclient({
          isConnected: false,
        });
        return false
      }
    } else {
      sethaveMetamask(false);
      return false
    }
  };

  const connectWeb3 = async () => {

    try {
      const {ethereum} = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setclient({
        isConnected: true,
        address: accounts[0],
      });
      await loadingStart();

    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };


  async function swapLogic() {

    updateStatus("loading")

    let input_amount = tokenInfo.input_amount
    let decimals2 = Math.pow(10, tokenInfo.coin1Info.decimals);
    let amountIn = input_amount * decimals2
    let bigNumberAmountIn = BigNumber.from(amountIn.toString())

    let totalAllowance = await service_inquiry_allowance(tokenInfo.token0Address)
    console.log("totalAllowance",totalAllowance.toLocaleString())

    // if (totalAllowance == 0) {
    // let bigNumberAmountIn = BigNumber.from(amountIn.toString())
    // let bigNumberBalance = balance
    if (bigNumberAmountIn.gt(totalAllowance)) {
      alert("Cannot trade - Please approve first")
      // await service_request_allowance(tokenInfo.token0Address)
      await service_request_allowance(tokenInfo.token0Address,amountIn)
      updateStatus("")
      return
    }




    let inputCoin0 = tokenInfo.coin0Info


    let balance = inputCoin0.balance


    {

      let bigNumberBalance = balance

      if (bigNumberAmountIn.gt(bigNumberBalance)){
        alert("Insufficient balance")
        return
      }
    }

    let paramInputTrade = {
      tokenInAddress: tokenInfo.token0Address,
      tokenOutAddress: tokenInfo.token1Address,
      fee: tokenInfo.fee,
      amountIn: amountIn.toString()
      // amountIn : 12000000000000000
    }
    console.log("paramInputTrade", paramInputTrade)

    try {
      let trx_hash = await service_trade(paramInputTrade)
      updateStatus("transaction completed - " + trx_hash)
    }
    catch (e)
    {
        console.log("error",e)
        updateStatus("transaction failed - " + e.toString())
    }



  }

  useEffect( () => {
    checkConnection();
  }, []);

  function displayBalance(coinInfo) {
    if (coinInfo == null){
      return "no-data"
    }

    let balance = coinInfo.balance

    if (balance == null){
      return "no_data"
    }
    let decimals = coinInfo.decimals

    let output = ethers.utils.formatUnits(balance, decimals)
    return output

  }

  return (
      <>
        {/* Navbar */}
        <nav className="fren-nav d-flex">
          <div>
            <h3>UniswapTester</h3>
          </div>
          <div className="d-flex" style={{marginLeft: "auto"}}>
            <div>
              <button className="btn connect-btn" onClick={connectWeb3}>
                {client.isConnected ? (
                    <>
                      {client.address.slice(0, 4)}...
                      {client.address.slice(38, 42)}
                    </>
                ) : (
                    <>Connect Wallet</>
                )}
              </button>
            </div>

          </div>
        </nav>
        {/* Navbar end */}

        <section className="container d-flex">
          <main>


            {/* ---- */}
            <div>
              {!haveMetamask ? (
                  <Metamask/>
              ) : client.isConnected ? (
                  <>
                    <br/>
                    <div>
                      <>ver13a</><br/>

                    </div>
                    <br/>
                    <div>
                      <input style={{width: "400px"}}
                          type="text"
                          value={tokenInfo.token0Address}
                          onChange={((e) => {
                            let input = e.target.value
                            // vm.token0Address = input
                            // setTokenInfo({...tokenInfo,
                            //   token0Address: input,
                            // });

                            setTokenInfo((p) => ({ ...p,
                              token0Address : input
                            }));
                          })}
                      />
                      <button style={{marginLeft: "10px"}} onClick={changeCoin0}>reload</button>
                    </div>
                    <div>
                      <div>token name: {tokenInfo.coin0Info.name} - {tokenInfo.coin0Info.symbol} - {tokenInfo.coin0Info.decimals}</div>
                      <div>balance: {displayBalance(tokenInfo.coin0Info)}</div>
                      <div>input amount:
                        <input style={{marginLeft: "15px"}}
                            type="text"
                            value={tokenInfo.input_amount}
                            onChange={((e) => {
                              changeInputAmount(e)
                            })}
                        />
                      </div>

                    </div>

                    <br/>
                    <div>
                      <input
                          type="text" style={{width: "400px"}}
                          value={tokenInfo.token1Address}
                          onChange={((e) => {
                            let input = e.target.value
                            setTokenInfo((p) => ({ ...p,
                              token1Address : input
                            }));
                          })}
                      />
                      <button style={{marginLeft: "10px"}} onClick={changeCoin1}>reload</button>
                    </div>
                    <div>
                      <div>token name: {tokenInfo.coin1Info.name} - {tokenInfo.coin1Info.symbol} - {tokenInfo.coin1Info.decimals}</div>
                      <div>balance: {displayBalance(tokenInfo.coin1Info)}</div>
                      <div style={{color: "red"}}>output amount: {tokenInfo.amount_target}</div>
                    </div>
                    <br/>
                    {/*<div>pool address: {rate.poolAddress}</div>*/}

                    <div>1 {tokenInfo.coin1Info.symbol} = {tokenInfo.token0Rate} {tokenInfo.coin0Info.symbol}</div>
                    <br/>
                    {/*<div>status: {statusInfo}</div>*/}
                    <div>{statusInfo}</div>

                    {tokenInfo.is_swap_button_visible ? (
                        <button className="btn connect-btn" onClick={()=>{
                          swapLogic()
                        }}>swap</button>
                    ) : (
                        <></>
                    )}
                  </>
              ) : (
                  <>
                    <h1 className="main-title">Uniswap Tester</h1>
                    <p className="main-desc">
                      Uniswap Tester. Use Goerli Network
                    </p>
                    <br/>
                    <button className="btn connect-btn" onClick={connectWeb3}>
                      Connect Wallet
                    </button>
                  </>
              )}
            </div>
            {/* ---- */}
          </main>
        </section>
      </>
  );
};

export default Index;
