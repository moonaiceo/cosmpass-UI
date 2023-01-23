import { CosmWasmClient, SigningCosmWasmClient  } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { tokens } from './constants.js';
const btnWallet = document.querySelector(".button__wallet");
const btnModalAction = document.querySelectorAll(".button__action");
const modalActionLP = document.querySelector('.modal__action__lp');
const vaultsCards = document.querySelector('.vaults__cards__items');
const network = "testnet";
const chainId = {
  "mainnet": "osmosis-1",
  "testnet": "osmo-test-4",
};
const rpcEndPoint = {
  "mainnet": "https://rpc.osmosis.zone/",
  "testnet": "https://rpc-test.osmosis.zone/",
};
const lcdEndPoint = {
  "mainnet": "https://lcd.osmosis.zone/",
  "testnet": "https://lcd-test.osmosis.zone/",
};
const CODE_ID = 5172;
let isUserConnected = false;
let offlineSigner;
let account;
let clientCosmWasm;
let pools;
let userEntries;
let currentPool;
let user_sc_addresses = {};
let userValueLocked = 0;
let currentPoolInfo;
const contractAddress = {
  "malaga-420":
    "wasm1v8484th79cv2vh49sq949auu20yla3jh7rypzytp50quyly552vs3a4ugd",
  "osmo-test-4":
    "osmo163e0tvu9rpcc7ns6jn0m3y62z4505rvgzjf5kkx66am45syf4djstqk6xh",
  "uni-3": "juno1yfp9zyx9zhqe77d05yqjx3ctqjhzha0xn5d9x8zxcpp658ks2hvqlfjt72",
  "constantine-1":
    "archway1wnuakyjhvlnepk2g9ncvvaks0zy0axgx70pet4jh2nv8lmsuff9qseuvpc"
};


const get_count = async () => {
    const client_rpc = await CosmWasmClient.connect(rpcEndPoint[network]);
    const getCount = await client_rpc.queryContractSmart(contractAddress[chainId['testnet']], {"query_all_pools": {}});
    const mock_data = {
        "pools": [
          {
            "pool_id": "1",
            "token_1": {
              "symbol": "ATOM",
              "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fatom.svg"
            },
            "token_2": {
              "symbol": "OSMO",
              "denom": "uosmo",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fosmo.svg"
            },
            "apr": {
              "one_day": "9",
              "one_week": "13",
              "two_week": "22"
            },
            "apy": {
              "one_day": "9.42",
              "one_week": "13.88",
              "two_week": "24.6"
            },
            "tvl": "0",
            "converted_tvl": "0",
            "reward_coin": [
              "uosmo"
            ]
          },
          {
            "pool_id": "678",
            "token_1": {
              "symbol": "USDC",
              "denom": "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fusdc.svg"
            },
            "token_2": {
              "symbol": "OSMO",
              "denom": "uosmo",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fosmo.svg"
            },
            "apr": {
              "one_day": "12",
              "one_week": "16",
              "two_week": "24"
            },
            "apy": {
              "one_day": "12.75",
              "one_week": "17.35",
              "two_week": "27.11"
            },
            "tvl": "0",
            "converted_tvl": "0",
            "reward_coin": [
              "uosmo"
            ]
          },
          {
            "pool_id": "704",
            "token_1": {
              "symbol": "WETH",
              "denom": "ibc/EA1D43981D5C9A1C4AAEA9C23BB1D4FA126BA9BC7020A25E0AE4AA841EA25DC5",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fweth.svg"
            },
            "token_2": {
              "symbol": "OSMO",
              "denom": "uosmo",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fosmo.svg"
            },
            "apr": {
              "one_day": "12",
              "one_week": "19",
              "two_week": "29"
            },
            "apy": {
              "one_day": "12.75",
              "one_week": "20.92",
              "two_week": "33.63"
            },
            "tvl": "0",
            "converted_tvl": "0",
            "reward_coin": [
              "uosmo"
            ]
          },
          {
            "pool_id": "712",
            "token_1": {
              "symbol": "WBTC",
              "denom": "ibc/D1542AA8762DB13087D8364F3EA6509FD6F009A34F00426AF9E4F9FA85CBBF1F",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fwbtc.png"
            },
            "token_2": {
              "symbol": "OSMO",
              "denom": "uosmo",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fosmo.svg"
            },
            "apr": {
              "one_day": "10",
              "one_week": "15",
              "two_week": "24"
            },
            "apy": {
              "one_day": "10.52",
              "one_week": "16.18",
              "two_week": "27.11"
            },
            "tvl": "0",
            "converted_tvl": "0",
            "reward_coin": [
              "uosmo"
            ]
          },
          {
            "pool_id": "674",
            "token_1": {
              "symbol": "DAI",
              "denom": "ibc/0CD3A0285E1341859B5E86B6AB7682F023D03E97607CCC1DC95706411D866DF7",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fdai.svg"
            },
            "token_2": {
              "symbol": "OSMO",
              "denom": "uosmo",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fosmo.svg"
            },
            "apr": {
              "one_day": "10",
              "one_week": "15",
              "two_week": "24"
            },
            "apy": {
              "one_day": "10.52",
              "one_week": "16.18",
              "two_week": "27.11"
            },
            "tvl": "0",
            "converted_tvl": "0",
            "reward_coin": [
              "uosmo"
            ]
          },
          {
            "pool_id": "722",
            "token_1": {
              "symbol": "EVMOS",
              "denom": "ibc/6AE98883D4D5D5FF9E50D7130F1305DA2FFA0C652D1DD9C123657C6B4EB2DF8A",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fevmos.svg"
            },
            "token_2": {
              "symbol": "OSMO",
              "denom": "uosmo",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fosmo.svg"
            },
            "apr": {
              "one_day": "29",
              "one_week": "41",
              "two_week": "82"
            },
            "apy": {
              "one_day": "33.63",
              "one_week": "50.65",
              "two_week": "126.84"
            },
            "tvl": "0",
            "converted_tvl": "0",
            "reward_coin": [
              "uosmo"
            ]
          },
          {
            "pool_id": "9",
            "token_1": {
              "symbol": "CRO",
              "denom": "ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fcro.png"
            },
            "token_2": {
              "symbol": "OSMO",
              "denom": "uosmo",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fosmo.svg"
            },
            "apr": {
              "one_day": "8",
              "one_week": "13",
              "two_week": "22"
            },
            "apy": {
              "one_day": "8.33",
              "one_week": "13.88",
              "two_week": "24.6"
            },
            "tvl": "0",
            "converted_tvl": "0",
            "reward_coin": [
              "uosmo"
            ]
          },
          {
            "pool_id": "497",
            "token_1": {
              "symbol": "JUNO",
              "denom": "ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fjuno.svg"
            },
            "token_2": {
              "symbol": "OSMO",
              "denom": "uosmo",
              "icon_url": "https://app.osmosis.zone/_next/image?url=%2Ftokens%2Fosmo.svg"
            },
            "apr": {
              "one_day": "19",
              "one_week": "28",
              "two_week": "40"
            },
            "apy": {
              "one_day": "20.92",
              "one_week": "32.3",
              "two_week": "49.15"
            },
            "tvl": "0",
            "converted_tvl": "0",
            "reward_coin": [
              "uosmo"
            ]
          }
        ]
    };
    return getCount;
};

function numberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

async function get_liquidity(pool_id){
  const response = await $.get(`https://api-osmosis.imperator.co/pools/v2/${pool_id}`);
  return response[0]['liquidity'];
}

async function get_total_shares(pool_id){
  const response = await $.get(`${lcdEndPoint[network]}/osmosis/gamm/v1beta1/pools/${pool_id}`);
  return response['pool']['total_shares']['amount'];
}

async function calculate_usd_value(pool_id, user_shares_amount){
  let liquidity = await get_liquidity(pool_id);
  let total_shares = await get_total_shares(pool_id);
  return (liquidity / total_shares) * user_shares_amount;
}

async function get_total_value_locked(){
  const client_rpc = await CosmWasmClient.connect(rpcEndPoint[network]);
  const allEntries = await client_rpc.queryContractSmart(contractAddress[chainId['testnet']], {"query_all_entries": {}});
  let usd_value = 0;
  for (const entry in allEntries){

  }
  $('#total_value_locked .promo__value__number').text(numberWithSpaces(usd_value.toFixed(2)) + " USD");

}




async function get_users_value_locked(){
  $('#user_value_locked .promo__value__number').text(numberWithSpaces(userValueLocked.toFixed(2)) + " USD");
}

function clearInputsValues(){
  $('.certain_balance')[3].innerHTML = '-';
  $('#WithdrawCoinBalanceOne').attr("value", 0);
  $('.certain_balance')[4].innerHTML = '-';
  $('#WithdrawCoinBalanceTwo').attr("value", 0);

  $('input[name="withdraw_coin_1"]').attr("max", 0);
  $('input[name="withdraw_coin_2"]').attr("max", 0);
  $('.certain_balance')[0].innerHTML ='-';
  $('#coinBalanceOne').attr("value", 0);
  $('.certain_balance')[1].innerHTML = '-';
  $('#coinBalanceTwo').attr("value", 0);
  $('.certain_balance')[2].innerHTML ='-';
  $('#coinBalanceThree').attr("value", 0);

  $('input[name="coin one"]').attr("max", 0);
  $('input[name="coin two"]').attr("max", 0);

}

function hide_user_related_elements(){
  $('#user_value_locked').hide();
  $('#myVaults').hide();
  $('.balance').hide();
  $('.modal__action__unbond').html("");
  $('input[name="autoCompounderAddress"]').attr("value", "");
  userEntries = undefined;
  clearInputsValues()
}

async function show_user_related_elements(){
  $('#user_value_locked').show();
  $('#myVaults').show();
  $('.vaults__cards-item__body-item.balance').css("display", "flex");
  get_users_value_locked();
  await updateUserEntries();
}

function getBalance(response, denom){
  let balance = 0;
  let exponent = getExponent(denom);
  if (response['balances'].find((b) => b.denom === denom) != undefined) {
      balance = response['balances'].find((b) => b.denom === denom)['amount'] / (10**exponent);
  } 
  return balance;
}


async function setBalances(denom1, denom2, denom3){
  const account_address = account.address;

  const response = await $.get(`${lcdEndPoint[network]}cosmos/bank/v1beta1/balances/${account_address}`);
  const balance1 = getBalance(response, denom1);
  const balance2 = getBalance(response, denom2);
  const balance3 = getBalance(response, denom3);

  return [balance1, balance2, balance3];
}

async function getBalancesForSC(denom1, denom2, address){
  const response = await $.get(`${lcdEndPoint[network]}cosmos/bank/v1beta1/balances/${address}`);
  const balance1 = getBalance(response, denom1);
  const balance2 = getBalance(response, denom2);
  return [balance1, balance2];
}

function getAutoCompounderAddress(pool_id){
  let autoCompounderAddress = userEntries['entries'].find((e) => e.pool_id === pool_id)['pool_addr'];
  console.log(autoCompounderAddress);
  return autoCompounderAddress;
}

async function createAutoCompounderSCs(){
  const stargateClient = await SigningCosmWasmClient.connectWithSigner(
    rpcEndPoint[network],
    offlineSigner,
    { gasPrice: "0.004uosmo"}
  );
  const initMsg = {
    name: `${account.address} pool 1`,
    symbol: "CPASS",
    decimals: 6,
    id: 1,
    denom_1: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
    denom_2: "uosmo",
    white_list_denoms: [
      "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
      "uosmo",
    ],
    fee: 0,
    fee_collector_address: "osmo18ynwv4smhp7jdeqslpnh8c327ekwa9sralkhyp",
    initial_balances: [ ],
    mint: {
      minter: "osmo18ynwv4smhp7jdeqslpnh8c327ekwa9sralkhyp"
    }
  };
  
  const tx = await stargateClient.instantiate(account.address, CODE_ID, initMsg, "CPASS", "auto");
  const scAddr = tx.contractAddress;
  return scAddr;
}


async function addEntryForUser(autoCompounderAddress, poolId ){
  const mnemonic = "chef letter plastic corn sunny pony also step much shine film need patient jaguar bless snap bike unfold rabbit bamboo wine field easily uncle";
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "osmo" });
  const walletAccounts = await wallet.getAccounts();
  const walletAddress = walletAccounts[0].address;
  const client = await SigningCosmWasmClient.connectWithSigner(
    rpcEndPoint[network],
    wallet,
    {gasPrice: "0.004uosmo"}
    );
  console.log(account.address, poolId, autoCompounderAddress);
  let msg = {
    new_entry: {
      user: account.address,
      pool_id: poolId,
      lp_token_amount: "0",
      token_1_amount: "0",
      token_2_amount: "0",
      pool_addr: autoCompounderAddress
    }
  };

  let tx = await client.execute(walletAddress, contractAddress[chainId['testnet']], msg, "auto");
  await updateUserEntries();
  console.log(tx);
}

async function updateUserEntries(){
  const client_rpc = await CosmWasmClient.connect(rpcEndPoint[network]);
  userEntries = await client_rpc.queryContractSmart(contractAddress[chainId['testnet']], {query_user_entries: {user: account.address}});
}

async function updatePoolInfo(){
  const url = `https://api-osmosis.imperator.co/pools/v2/${currentPool.pool_id}`;
  let response = $.get(url);
  currentPoolInfo = response;
}

  
get_count().then(async (value) => {
  pools = value.pools;
  sort();
  if (localStorage.getItem("isLoggedIn")){
    await connectKeplr();
  }
   
  if (isUserConnected)  await updateUserEntries();

  await createVaultsList(value.pools);

  if (isUserConnected === false){
    hide_user_related_elements();

  }
  else {
    await show_user_related_elements()
  }

  try{
    await get_total_value_locked();
  } catch (e){
    console.log(e);
  }



  $('.vaults__cards-item').each(function(i) {
    $(this).on('click', async function() {
      hideHeaderButtonMenu();
      currentPool = value.pools[i];
      await updatePoolInfo();
      let pool = value.pools[i];
      let gamm = `gamm/pool/${pool.pool_id}`;
      let autoCompounderAddress;
      if (isUserConnected) {
        try {
          try{
            autoCompounderAddress = getAutoCompounderAddress(currentPool.pool_id);
            $('input[name="autoCompounderAddress"]').attr("value", autoCompounderAddress);
            // getting balances for withdraw funds
            let WithdrawBalances = await getBalancesForSC(pool.token_1.denom, pool.token_2.denom, autoCompounderAddress);
            $('.certain_balance')[3].innerHTML = WithdrawBalances[0];
            $('#WithdrawCoinBalanceOne').attr("value", WithdrawBalances[0]);
            $('.certain_balance')[4].innerHTML = WithdrawBalances[1];
            $('#WithdrawCoinBalanceTwo').attr("value", WithdrawBalances[1]);

            $('input[name="withdraw_coin_1"]').attr("max", WithdrawBalances[0]);
            $('input[name="withdraw_coin_2"]').attr("max", WithdrawBalances[1]);
          } catch(e){
            console.log(e);
            $('.certain_balance')[3].innerHTML = '-';
            $('#WithdrawCoinBalanceOne').attr("value", 0);
            $('.certain_balance')[4].innerHTML = '-';
            $('#WithdrawCoinBalanceTwo').attr("value", 0);

            $('input[name="withdraw_coin_1"]').attr("max", 0);
            $('input[name="withdraw_coin_2"]').attr("max", 0);
          }         
          // getting balances for depositing funds
          let DepositBalances = await setBalances(pool.token_1.denom, pool.token_2.denom, gamm);
          $('.certain_balance')[0].innerHTML = DepositBalances[0];
          $('#coinBalanceOne').attr("value", DepositBalances[0]);
          $('.certain_balance')[1].innerHTML = DepositBalances[1];
          $('#coinBalanceTwo').attr("value", DepositBalances[1]);
          $('.certain_balance')[2].innerHTML = DepositBalances[2];
          $('#coinBalanceThree').attr("value", DepositBalances[2]);

          $('input[name="coin one"]').attr("max", DepositBalances[0]);
          $('input[name="coin two"]').attr("max", DepositBalances[1]);
          $('input[name="coin three"]').attr("max", DepositBalances[2]);


        } catch (e) {
          console.log(e);
        }
      }
      $('.modal__header__title').text(pool.token_1.symbol + " - " + pool.token_2.symbol);
      $('.modal__header__subtitle').text($('.vaults__cards-item__header-subtitle').eq(i).text());
      $('#coinLabelOne').text(pool.token_1.symbol);
      $('#coinLabelTwo').text(pool.token_2.symbol);
      $('#coinLabelThree').text(gamm);
      $('#WithdrawCoinLabelOne').text(pool.token_1.symbol);
      $('#WithdrawCoinLabelTwo').text(pool.token_2.symbol);
      $('#depositTokens').text(pool.token_1.symbol + " + " + pool.token_2.symbol);
      $('#depositLP').text(pool.pool_id + " LP token");
      $('input[name="coin one"]').attr("address", pool.token_1.denom);
      $('input[name="coin two"]').attr("address", pool.token_2.denom);
      $('input[name="coin three"]').attr("address", gamm);
      
      $('input[name="withdraw_coin_1"]').attr("address", pool.token_1.denom);
      $('input[name="withdraw_coin_2"]').attr("address", pool.token_2.denom);

      $('.modal__action__deposit__coins-item__input-img_WOne').attr("src", pool.token_1.icon_url);
      $('.modal__action__deposit__coins-item__input-img_WTwo').attr("src", pool.token_2.icon_url);
      $('.modal__action__deposit__coins-item__input-img_DOne').attr("src", pool.token_1.icon_url);
      $('.modal__action__deposit__coins-item__input-img_DTwo').attr("src", pool.token_2.icon_url);

      $('.modal__header__icon').eq(0).attr("src", pool.token_1.icon_url);
      $('.modal__header__icon').eq(1).attr("src", pool.token_2.icon_url);


      $('.modal__descr-item__descr').eq(0).html(`${pool.tvl} USD`);
      $('.modal__descr-item__descr').eq(1).html(`<span class="span-apy">${pool.apr.two_week}%</span> ${pool.apy.two_week}%`);


      $('.overlay, .modal').fadeIn('slow');
      $("html").css("overflow", "hidden");
      if (await hasLocks()){
        await showLocks();
        $('.button__action')
        .addClass('button__action_active').prop('disabled', false);
      } else {
        $('.modal__action__unbond').html("");
      }
      showTokensInput();

    });
  }); 

  // Data attributes

  $('.vaults__cards-item__header-title[data-name]').each(function(i) {
    $(this)
      .attr("data-name", $(this).text());
  });
  
  $('.vaults__cards-item__body-item__descr[data-tvl]').each(function(i) {
    $(this)
      .attr("data-tvl", parseFloat($(this).text(), 10));
  });
  
  $('.vaults__cards-item__body-item__descr[data-apy]').each(function(i) {
    $(this)
      .attr("data-apy", parseFloat($(this).clone().children().remove().end().text(), 10));
  });
  

  // Sort

  $('.vaults__settings__sorting-sort__desc').on('click', function() {
    $(this)
      .toggleClass('vaults__settings__sorting-sort__desc_active');
    if ($(this).hasClass('vaults__settings__sorting-sort__desc_active')) {
      console.log($('.vaults__settings__sorting-sort__icon'));
      $('.vaults__settings__sorting-sort__icon').attr("src", "../icons/application/order.svg").css("transform", "rotate(0deg)");
    } else {
      $('.vaults__settings__sorting-sort__icon').attr("src", "../icons/application/order.svg").css("transform", "rotate(180deg)");
    }
  });

  $('#sort').find('.select-items div').on('click', function() {
    if ($('.vaults__settings__sorting-sort__desc').hasClass("vaults__settings__sorting-sort__desc_active")) {
      if ($(this).data("sort-type") !== "default") {
        $(this).on('click', sortCardsDesc($(this).data("sort-type")));
      } else {
        $(this).on('click', sortCardsAsc("data-name"));
      }
    } else {
      if ($(this).data("sort-type") !== "default") {
        $(this).on('click', sortCardsAsc($(this).data("sort-type")));
      } else {
        $(this).on('click', sortCardsDesc("data-name"));
      }
    }
  });

  // Farms sort

  $('#farms').find('.select-items div').on('click', function() {
    let value;
    if ($(this).text() !== "Active farms") {
      value = $(this).text().toLowerCase();
    } else {
      value = "";
    }
    $(".vaults__cards-item").filter(function() {
      $(this).toggle($(this).find(".vaults__cards-item__header-subtitle").text().toLowerCase().indexOf(value) > -1);
    });
    if ($('#myVaults').hasClass("vaults__settings-views__view_active")){
      hide_none_user_vaults();
    }

  });
});

async function get_user_usd_value_for_pool(id, address){
  const url = `${lcdEndPoint[network]}/osmosis/lockup/v1beta1/account_locked_longer_duration/${address}`;
  let total_usd_value = 0;

  const data = await $.get(url);
  console.log(data)
  for (const elem of data['locks']) {
    let coin = elem['coins'][0];
    const pool_id = parseInt(coin['denom'].split("/").pop());
    if (pool_id === id) {
      let usd_value = await calculate_usd_value(pool_id, coin['amount']);
      total_usd_value += usd_value;
    } 
  }
  return total_usd_value;
}


const createVaultsList = async (vaults) => {
  let balances = {};
  for (const vault of vaults){
      let balance = 0;
      if (isUserConnected){
        try {
          let autoCompounderAddress = getAutoCompounderAddress(vault.pool_id)
          balance = await get_user_usd_value_for_pool(vault.pool_id, autoCompounderAddress);
        } catch(e) {
          console.log(`You don't have a SC for pool ${vault.pool_id}. ${e}`)
        }
        userValueLocked += balance;
      }
      balances[vault.pool_id] = balance;
  }

  vaultsCards.innerHTML = "";

  for (const vault of vaults) {
    vaultsCards.innerHTML += `
      <div class="vaults__cards-item" name="${balances[vault.pool_id]> 0 ? 'user_vault' : ''}">
      <div class="vaults__cards-item__header">
          <div class="vaults__cards-item__header__icons">
              <div class="vaults__cards-item__header__circle_one">
                  <img src="${vault.token_1.icon_url}" alt="coin icon" class="vaults__cards-item__header__icon">
              </div>
              <div class="vaults__cards-item__header__circle_two">
                  <img src="${vault.token_2.icon_url}" alt="coin icon" class="vaults__cards-item__header__icon">
              </div>
          </div>
          <div class="vaults__cards-item__header__text">
              <div class="vaults__cards-item__header-title" data-name>${vault.token_1.symbol} - ${vault.token_2.symbol}</div>
              <div class="vaults__cards-item__header-subtitle">Farm: Osmosis</div>
          </div>
      </div>
      <div class="vaults__cards-item__body">
          <div class="vaults__cards-item__body-items">
              <div class="vaults__cards-item__body-item balance">
                  <div class="vaults__cards-item__body-item__title">My Balance</div>
                  <div class="vaults__cards-item__body-item__descr">${numberWithSpaces(balances[vault.pool_id].toFixed(2))} USD </div>
                  <!--  <span class="span-balance">158 USD</span> -->
              </div>
              <div class="cross_line"></div>
              <div class="vaults__cards-item__body-item">
                  <div class="vaults__cards-item__body-item__title">TVL</div>
                  <div class="vaults__cards-item__body-item__descr" data-tvl>${vault.tvl} USD</div>
              </div>
              <div class="vaults__cards-item__body-item">
                  <div class="vaults__cards-item__body-item__title" data-one-day="${vault.apy.one_day}" data-one-week="${vault.apy.one_week}" data-two-week="${vault.apy.two_week}">APY</div>
                  <div class="vaults__cards-item__body-item__descr label-apy" data-apy><span class="span-apy">${vault.apr.two_week}%</span>  ${vault.apy.two_week}%</div>
              </div>
               
          </div>
      </div>
  </div>
      `;
  }
};


btnModalAction.forEach((btn) => {
  btn.addEventListener("click", async function (elem){
    switch (this.textContent) {
      case "Deposit":
        if (isBothInputFilled(this)) {
          let autoCompounderAddress;
          try {
            autoCompounderAddress =  getAutoCompounderAddress(currentPool.pool_id);
          }
          catch (e) {
            let compounderAddress = await createAutoCompounderSCs();
            await addEntryForUser(compounderAddress, currentPool.pool_id);
            autoCompounderAddress =  getAutoCompounderAddress(currentPool.pool_id);
            $('input[name="autoCompounderAddress"]').attr("value", autoCompounderAddress);
          }
          join_pool(offlineSigner, account, this);
        } else{

        }
       
        break;
      case "Withdraw":
        withdraw_funds(offlineSigner, account, this);
        break;
      case "Unbond":
        unbond(offlineSigner, account, this);
        break;
      default:
        console.log(`There is no case for such a button ${this.textContent}`);
    }
  });
});


btnWallet.addEventListener("click", () => connectKeplr());

function showLpInput(){
  $(".modal__action__deposit__coins-tokens").hide();
  $(".modal__action__deposit__coins-lp").show();
}

function showTokensInput() {
  $(".modal__action__deposit__coins-tokens").show();
  $(".modal__action__deposit__coins-lp").hide();
}

$('input[type=radio][name=deposit-coin]').change(function() {
  if (this.value === 'tokens') {
    showTokensInput();
  }
  else if (this.value === 'lp') {
    showLpInput();
  }
});

function getRatioOfTokens(){
  return {
    0: (currentPoolInfo.responseJSON[0]['price'] / currentPoolInfo.responseJSON[1]['price']),
    1: (currentPoolInfo.responseJSON[1]['price'] / currentPoolInfo.responseJSON[0]['price'])
  }
}

$('.modal__action__deposit__coins-item__label.available_balance').on('click', function() {
      $(`input[name="${$(this).attr("data-input")}"]`).val($(this).val());
      $(`input[name="${$(this).attr("data-input")}"]`).trigger('input');
      
});

$('input[type=number]').on('input', function() {

  if($(this).attr("name") === "coin one") {
    var coinOneVal = $(this).val();
    $("input[name='coin two']").val((coinOneVal * getRatioOfTokens()['0']).toFixed(6));
  } else if ($(this).attr("name") === "coin two") {
    var coinTwoVal = $(this).val();
    $("input[name='coin one']").val((coinTwoVal / getRatioOfTokens()['0']).toFixed(6));
  }

  if (this.value > parseFloat($(this).attr("max"))) {

    $(this.parentNode).addClass("incorrect");
    turnOffModalButton();
  }
  else if (this.value === undefined || this.value <= 0) {
    turnOffModalButton();
    $(this.parentNode).removeClass("incorrect");
  } else{
    $(this.parentNode).removeClass("incorrect");
    $('.button__action')
    .addClass('button__action_active').prop('disabled', false);
  }

});

function setAPY(apy, apr) {
  $('.modal__descr-item__descr').eq(1).html(`<span class="span-apy">${apr}%</span> ${apy}%`);
}

$('input[type=radio][name=unbond-period]').change(function() {
  if (this.value == '1209600') {
      setAPY(currentPool.apy.two_week, currentPool.apr.two_week);
  }
  else if (this.value == '604800') {
    setAPY(currentPool.apy.one_week, currentPool.apr.one_week);
  }
  else if (this.value == '86400') {
    setAPY(currentPool.apy.one_day, currentPool.apr.one_day);
}
});

function getExponent(denom){
  let exponents = tokens;
  let exponent;
  if (denom.includes("gamm")){
    exponent = 18;
  } else {
    exponent = exponents.find((b) => b.denom === denom)['exponent'];
  }
  return exponent;
}
function createMsgSendJson(denom, value) {
  // get exponent of current token by querying https://api-osmosis.imperator.co/search/v1/exponent?symbol=OSMO
  // for now set just mock exponent, for osmo exponent = 6. Might be 6, 8, 18 for other tokens
  let exponent = getExponent(denom);
  console.log(`Exponent for ${denom} = ${exponent}`)
  return {
    "denom": denom,
    "amount": `${value * (10**exponent)}`
  };
}


async function withdraw_funds(offlineSigner, account, element){
  let input1 = element.parentNode.querySelector('input[name="withdraw_coin_1"]');
  let input2 = element.parentNode.querySelector('input[name="withdraw_coin_2"]');
  let denom1 = input1.getAttribute("address");
  let denom2 = input2.getAttribute("address");
  let autoCompounderAddress = $('input[name="autoCompounderAddress"]').attr("value");
  console.log(input1, input2);
  const stargateClient = await SigningCosmWasmClient.connectWithSigner(
    rpcEndPoint[network],
    offlineSigner,
    { gasPrice: "0.004uosmo"}
  ); 

  let withdrawMsg = {
    withdraw_tokens: {
      to_address: account.address,
      tokens: [
        createMsgSendJson(denom1, input1.value),
        createMsgSendJson(denom2, input2.value)
      ]
      }
    };
 
  try {
    showModalLoadingStatus();
    let transaction = await stargateClient.execute(account.address, autoCompounderAddress, withdrawMsg, "auto");
    console.log(transaction);
    statusModalShow("success");
  } catch (e){
    statusModalShow("error");
    console.log(e);
  }
  
}


async function unbond(offlineSigner, account, element){
  let autoCompounderAddress = $('input[name="autoCompounderAddress"]').attr("value");
  
  const stargateClient = await SigningCosmWasmClient.connectWithSigner(
    rpcEndPoint[network],
    offlineSigner,
    { gasPrice: "0.004uosmo"}
  ); 

  let unbondMsg = {
    unbond_all: {}
  }
 
  try {
    showModalLoadingStatus();
    let transaction = await stargateClient.execute(account.address, autoCompounderAddress, unbondMsg, "auto");
    console.log(transaction);
    statusModalShow("success");
  } catch (e){
    statusModalShow("error");
    console.log(e);
  }
  
}

async function estimate_amount_of_lp(funds, poolId){
  const response = await $.get(`https://api-osmosis.imperator.co/pools/v2/${poolId}`);
  let total_shares = await get_total_shares(poolId);
  const pair1 = response[0];
  const pair2 = response[1];
  const liquidity = pair1['liquidity'];
  let usd_value = 0;
  let amount_of_lp_tokens;
  funds.forEach(({denom, amount}) => {
    let exponent = getExponent(denom);
    if (denom === pair1['denom']){
      usd_value += (amount / 10 ** exponent) * pair1['price'];
    } else if (denom === pair2['denom']){
      usd_value += (amount / 10 ** exponent) * pair2['price'];
    }
  });

  amount_of_lp_tokens = (usd_value / liquidity) * total_shares;
  return amount_of_lp_tokens;
  
}
function turnOffModalButton(){
  $('.button__action')
        .removeClass('button__action_active').prop('disabled', true);
}

function areDepositInputsEmpty(){
  return $('input[name="coin one"]').val() === "" || $('input[name="coin two"]').val() === ""
}

function setInputsAsIncorrect(inputsName){
  for (const name of inputsName){
    console.log(name)
     $(`input[name="${name}"]`).closest("div").addClass("incorrect");
  }
  turnOffModalButton();
}

async function join_pool(offlineSigner, account, element){
  let input1 = element.parentNode.querySelector('input[name="coin one"]');
  let input2 = element.parentNode.querySelector('input[name="coin two"]');
  let input3 = element.parentNode.querySelector('input[name="coin three"]');
  let choiceOfType = element.parentNode.querySelector('input[type=radio][name=deposit-coin]:checked').value;
  let denom1 = input1.getAttribute("address");
  let denom2 = input2.getAttribute("address");
  let denom3 = input3.getAttribute("address");
  let funds = [];
  let lp_out_amount;
  let bond_period = $('input[name="unbond-period"]').val();
  if (areDepositInputsEmpty()) {
    setInputsAsIncorrect(["coin one", "coin two"]);
  } else {
    if (choiceOfType === "tokens") {
      funds.push(createMsgSendJson(denom1, input1.value));
      funds.push(createMsgSendJson(denom2, input2.value));
      lp_out_amount = await estimate_amount_of_lp(funds, currentPool.pool_id);
    } else {
      funds.push(createMsgSendJson(denom3, input3.value));
    }
    let autoCompounderAddress = $('input[name="autoCompounderAddress"]').attr("value");

    // (Amount of funds deposited / Total value of all funds in the pool) * Total number of LP tokens in the pool.
    const stargateClient = await SigningCosmWasmClient.connectWithSigner(
      rpcEndPoint[network],
      offlineSigner,
      { gasPrice: "0.004uosmo"}
    ); 
    
    let joinPoolMsg = {
        join_pool: {
          pool_id: currentPool.pool_id,
          amount: `${lp_out_amount/100}`,
          token_in_maxs: funds
        }
      };

    let bondMsg = {
      add_bond: {
        owner: autoCompounderAddress,
        duration: `${bond_period}s`,
        coins: [
          {
            "denom": `gamm/pool/${currentPool.pool_id}`,
            "amount": "841883005888993843"
          }
        ]
      }
    }
  
    try {
      showModalLoadingStatus();
      let transaction = await stargateClient.executeMultiple(
        account.address,
        [
          {contractAddress: autoCompounderAddress, msg: joinPoolMsg, funds: funds},
          {contractAddress: autoCompounderAddress, msg: bondMsg}
        ], 
        "auto"
      );
      console.log(transaction);
      statusModalShow("success");
    } catch (e){
      statusModalShow("error");
      console.log(e);
    }
    }
  
  
}


function isBothInputFilled(element){
  let input1 = element.parentNode.querySelector('input[name="coin one"]');
  let input2 = element.parentNode.querySelector('input[name="coin two"]');
  return input1.value !== 0 && input2.value !== 0
}

async function deposit_funds(offlineSigner, account, element) {
  let input1 = element.parentNode.querySelector('input[name="coin one"]');
  let input2 = element.parentNode.querySelector('input[name="coin two"]');
  let input3 = element.parentNode.querySelector('input[name="coin three"]');
  let choiceOfType = element.parentNode.querySelector('input[type=radio][name=deposit-coin]:checked').value;
  let denom1 = input1.getAttribute("address");
  let denom2 = input2.getAttribute("address");
  let denom3 = input3.getAttribute("address");
  let autoCompounderAddress = $('input[name="autoCompounderAddress"]').attr("value");
  let msgJson = {};
  const stargateClient = await SigningCosmWasmClient.connectWithSigner(
    rpcEndPoint[network],
    offlineSigner
  ); 
  if (choiceOfType === "tokens"){
    msgJson = {
      "fromAddress": account.address,
      "toAddress": autoCompounderAddress,
      "amount":[
        createMsgSendJson(denom1, input1.value),
        createMsgSendJson(denom2, input2.value),
      ]
    };
  } else{
    msgJson = {
      "fromAddress": account.address,
      "toAddress": autoCompounderAddress,
      "amount":[
        createMsgSendJson(denom3, input3.value),
      ]
    };
  }
  try {
    showModalLoadingStatus();
    let transaction = await stargateClient.signAndBroadcast(
      account.address,
      [
        {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: msgJson
        },
     
      ],
      {
        gas: '200000',
        amount: [{ denom: 'uosmo', amount: '10000' }]
      }
    );
    statusModalShow("success");
  } catch (e){
    statusModalShow("error");
    console.log(e);
  }
  
}

async function connectKeplr() {
  
    if (!window.keplr) {
        alert("Please install keplr extension");
        // Enabling before using the Keplr is recommended.
        // This method will ask the user whether to allow access if they haven't visited this website.
        // Also, it will request that the user unlock the wallet if the wallet is locked.
    }
    else {
        if (isUserConnected) {
            $(".header__button__menu").toggle();
            // if ($(".header__button__menu").is(":visible")) {
            //   $(document).on("click", function(e) {
            //     e.stopPropagation();
            //     console.log(e.target.id);
            //     console.log(this);
            //     console.log($(".header__button__menu").is(":visible"));
            //     if (e.target.id !== "disconnect" && !e.target.classList.contains("header__button__menu")) {
            //       $("#disconnect").hide();
            //     }
            //   });
            // }
            $(".header__button__menu").on("click", () => disconnectWallet());
        }
        else {
          await window.keplr.enable(chainId[network]);
    
          offlineSigner = window.keplr.getOfflineSigner(chainId[network]);
          console.log(offlineSigner);
      
          // You can get the address/public keys by `getAccounts` method.
          // It can return the array of address/public key.
          // But, currently, Keplr extension manages only one address/public key pair.
          // XXX: This line is needed to set the sender address for SigningCosmosClient.
          const accounts = await offlineSigner.getAccounts();

          // const transaction = await sendTx(chainId[network], accounts[0].pubkey, "sync");
          // console.log(transaction);

          account = accounts[0];
          
          console.log(accounts[0]);
          btnWallet.innerHTML = accounts[0].address;
          btnWallet.classList.add('button__wallet_signed');
          localStorage.setItem('isLoggedIn', true);
          isUserConnected = true;
          get_count();
          await show_user_related_elements();

          // Initialize the gaia api with the offline signer that is injected by Keplr extension.
          // const cosmJS = new SigningCosmosClient(
          //     // "https://lcd-osmosis.keplr.app/rest",
          //     "https://rest.sentry-01.theta-testnet.polypore.xyz",
          //     accounts[0].address,
          //     offlineSigner
          // );
        }

    }
    
}


function disconnectWallet() {
  window.keplr.disable(chainId[network]);
  btnWallet.innerHTML = "Connect";
  btnWallet.classList.remove('button__wallet_signed');
  localStorage.setItem('isLoggedIn', false);
  isUserConnected = false;
  hide_user_related_elements();
  
  hideHeaderButtonMenu();
}

function hideHeaderButtonMenu() {
  $(".header__button__menu").hide();
}

function hide_none_user_vaults(){
  $('.vaults__cards-item').each(function(i) {
    if ($(this).attr("name") != "user_vault"){
        $(this).hide();
    }
  });
}

$('#myVaults').on('click', function() {
  hide_none_user_vaults();
});

$('#allVaults').on('click', function() {
  $('.vaults__cards-item').each(function(i) {
    $(this).show();
  });
});


$('.modal__action').on('click', 'li:not(.catalog__tab_active)', function() {
  $(this)
    .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
    .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
});

$('.modal__close').on('click', function() {
  $('.overlay, .modal').fadeOut('slow');
});



// Modal

$('.overlay').on('click', function(e) {
  if ($('.overlay, .modal').is(":visible")) {
    if (e.target === this) {
      $('.overlay, .modal').fadeOut('slow');
      $('html').css("overflow", "overlay");
      $('form').trigger("reset");
      if ($('.modal__mini:visible')) $('.modal__mini').css("display", "none");
    }
  }
});



$('.vaults__settings-views').on('click', ':not(.vaults__settings-views__view_active)', function() {
  $(this)
    .addClass('vaults__settings-views__view_active').siblings().removeClass('vaults__settings-views__view_active');
    // .closest('body').find('div.menu__content').removeClass('menu__content_active').eq($(this).index()).addClass('menu__content_active').siblings().removeClass('menu__content_active');
});

$('.modal__actions').on('click', ':not(.modal__actions-item_active)', async function() {
  $(this)
    .addClass('modal__actions-item_active').siblings().removeClass('modal__actions-item_active')
    .closest('.modal__action').find('div.action__content').removeClass('action__content_active').eq($(this).index()).addClass('action__content_active').siblings().removeClass('action__content_active');
    $('.button__action')
      .text($('.modal__actions-item_active').text());
    if (this.textContent === "Deposit") {
      turnOffModalButton();
      // $('.button__action')
      //   .addClass('button__action_active').prop('disabled', false);
      $('.modal__action__withdraw-label__unbond')
        .addClass('modal__action__withdraw-label__unbond-lock')
        .removeClass('modal__action__withdraw-label__unbond-check');
      // $('.modal__action__withdraw-input')
      //   .removeClass('modal__action__withdraw-input_active').find('input').prop('disabled', true);
    } else if (this.textContent === "Unbond"){

      if (await hasLocks()){
        await showLocks();
        $('.button__action')
        .addClass('button__action_active').prop('disabled', false);
      } else {
        $('.modal__action__unbond').html("");
      }

    } else {

    turnOffModalButton();
    }
});

async function hasLocks(){
  try{
    let autoCompounderAddress = getAutoCompounderAddress(currentPool.pool_id);
    const url = `${lcdEndPoint[network]}/osmosis/lockup/v1beta1/account_locked_longer_duration/${autoCompounderAddress}`;
    const data = await $.get(url);
    return true ? data : false
  } catch (e){
    return false;
  }
 
}


async function showLocks(){
  function generateLockHTML(lock){
    let locktime = "";

    if (lock.end_time === "0001-01-01T00:00:00Z") locktime = '<span class="warning">Firstly, unbond lock by clicking button below.</span>'
    else {
      const timestamp = lock.end_time;

      // Create a new Date object from the timestamp
      const date = new Date(timestamp);

      // Use the toLocaleString() method to format the date and time
      locktime = date.toLocaleString();
    }

    return `<div class="modal__action__unbond-lock__label">
                <p>Lock ID: <span>${lock.ID}</span></p>
                <p>Duration: <span>${lock.duration}</span></p>
                <p>End-time: ${locktime}</p>
                <p>Denom: <span>${lock.coins[0].denom}</span></p>
                <p>Amount: <span>${lock.coins[0].amount / 10 ** 18}</span></p>
            </div>`
  }
  let autoCompounderAddress = getAutoCompounderAddress(currentPool.pool_id);
  const url = `${lcdEndPoint[network]}/osmosis/lockup/v1beta1/account_locked_longer_duration/${autoCompounderAddress}`;
  const data = await $.get(url);

  let locksHTML = "";
  
  for (const elem of data['locks']) {
    locksHTML += generateLockHTML(elem);
  }
    $('.modal__action__unbond').html(
    ` <div class="modal__action__unbond-lock">
            ${locksHTML}
      </div>`)
}

$('.modal__action__withdraw-label__unbond').on('click', function() {
  $(this)
    .removeClass('modal__action__withdraw-label__unbond-lock')
    .addClass('modal__action__withdraw-label__unbond-check');
  $('.modal__action__withdraw-input')
    .addClass('modal__action__withdraw-input_active').find('input').prop('disabled', false);
  $('.button__action')
    .addClass('button__action_active').prop('disabled', false);
});

function statusModalShow(status) {
  const statusModal = document.querySelector('.modal__mini');
  const overlay = document.querySelector('.overlay');
  const roller = statusModal.querySelector('.lds-roller');
  const modalIcon = statusModal.querySelector('.modal__mini__icon-img');
  const modalDescr = statusModal.querySelector('.modal__mini__descr');
  if (status === "error") {
    modalIcon.src = '../icons/error_circle.svg';
    modalDescr.textContent = "Транзакция не выполнена!";
    modalDescr.style.color = "#C21616";
  } else if (status === "success") {
    modalIcon.src = '../icons/check_circle.svg';
    modalDescr.textContent = "Отлично! Транзакция успешно выполнена";
    modalDescr.style.color = "#38C216";
  }
  statusModal.previousElementSibling.style.display = 'none';
  roller.style.display = 'none';
  statusModal.style.display = 'block';
  overlay.style.display = 'block';
  modalIcon.style.display = 'block';
}


function showModalLoadingStatus(){
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const statusModal = document.querySelector('.modal__mini');
  const modalIcon = statusModal.querySelector('.modal__mini__icon-img');
  const roller = statusModal.querySelector('.lds-roller');
  const modalDescr = statusModal.querySelector('.modal__mini__descr');
  roller.style.display = 'inline-block';
  modalDescr.textContent = "";
  modalIcon.style.display = 'none';
  modal.style.display = 'none';
  overlay.style.display = 'block';
  statusModal.style.display = 'flex';
  statusModal.previousElementSibling.style.display = 'none';
  // $('.overlay, .modal__mini').fadeIn('slow');

}
// Search

$("#fsearch").on("keyup", function() {
  let value = "";
  let search = $(this).val().toLowerCase();
  hideHeaderButtonMenu();

  // if ($('#farms .select-selected').text() !== "Active farms") {
  //   value = $('#farms .select-selected').text().toLowerCase();
  // }
  $(".vaults__cards-item").filter(function() {
    $(this)
      .toggle($(this).find(".vaults__cards-item__header-title").text().toLowerCase().indexOf(search) > -1);
      // .toggle($(this).find(".vaults__cards-item__header-subtitle").text().toLowerCase().indexOf(value) > -1);
  });
  
});


// Dropdown

function sort() {
  
var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 0; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.setAttribute("data-sort-type", selElmnt.options[j].getAttribute("data-sort-type"));
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    hideHeaderButtonMenu();
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

// Descending order sort

function sortCardsDesc(sortType) {
  let gridItems = document.querySelector('.vaults__cards__items');

  if (sortType == "data-name") {
    for (let i = 0; i < gridItems.children.length; i++) {
      for (let j = i; j < gridItems.children.length; j++) {
        if (gridItems.children[i].querySelector('[' + sortType + ']').getAttribute(sortType) < gridItems.children[j].querySelector('[' + sortType + ']').getAttribute(sortType)) {
          let replacedNode = gridItems.replaceChild(gridItems.children[j], gridItems.children[i]);
          insertAfter(replacedNode, gridItems.children[i]);
        }
      }
    }
    } else {
      for (let i = 0; i < gridItems.children.length; i++) {
        for (let j = i; j < gridItems.children.length; j++) {
          if (parseFloat(gridItems.children[i].querySelector('[' + sortType + ']').getAttribute(sortType), 10) < parseFloat(gridItems.children[j].querySelector('[' + sortType + ']').getAttribute(sortType), 10)) {
            let replacedNode = gridItems.replaceChild(gridItems.children[j], gridItems.children[i]);
            insertAfter(replacedNode, gridItems.children[i]);
          }
        }
      }
    }
  if ($('#myVaults').hasClass("vaults__settings-views__view_active")){
    hide_none_user_vaults();
  }
}

// Ascending Order Sort

function sortCardsAsc(sortType) {
  let gridItems = document.querySelector('.vaults__cards__items');

  if (sortType == "data-name") {
    for (let i = 0; i < gridItems.children.length; i++) {
      for (let j = i; j < gridItems.children.length; j++) {
        if (gridItems.children[i].querySelector('[' + sortType + ']').getAttribute(sortType) > gridItems.children[j].querySelector('[' + sortType + ']').getAttribute(sortType)) {
          let replacedNode = gridItems.replaceChild(gridItems.children[j], gridItems.children[i]);
          insertAfter(replacedNode, gridItems.children[i]);
        }
      }
    }
  } else {
    for (let i = 0; i < gridItems.children.length; i++) {
      for (let j = i; j < gridItems.children.length; j++) {
        if (parseFloat(gridItems.children[i].querySelector('[' + sortType + ']').getAttribute(sortType), 10) > parseFloat(gridItems.children[j].querySelector('[' + sortType + ']').getAttribute(sortType), 10)) {
          let replacedNode = gridItems.replaceChild(gridItems.children[j], gridItems.children[i]);
          insertAfter(replacedNode, gridItems.children[i]);
        }
      }
    }
  }

  
  if ($('#myVaults').hasClass("vaults__settings-views__view_active")){
    hide_none_user_vaults();
  }
}


function insertAfter(elem, refElem) {
  return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}