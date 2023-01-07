import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const btnWallet = document.querySelector(".button__wallet");
const btnModalAction = document.querySelector(".button__action");
const modalActionLP = document.querySelector('.modal__action__lp');
const vaultsCards = document.querySelector('.vaults__cards__items');
const network = "testnet"
const chainId = {
  "mainnet": "osmosis-1",
  "testnet": "osmo-test-4",
};;
const rpcEndPoint = {
  "mainnet": "https://rpc.osmosis.zone/",
  "testnet": "https://rpc-test.osmosis.zone/",
};
const lcdEndPoint = {
  "mainnet": "https://lcd.osmosis.zone/",
  "testnet": "https://lcd-test.osmosis.zone/",
};
let isUserConnected = false;
let offlineSigner;
let account;
let pools;
let user_sc_addresses = {}

const type_of_msg = "WithdrawLP";


const contractAddress = {
  "malaga-420":
    "wasm1v8484th79cv2vh49sq949auu20yla3jh7rypzytp50quyly552vs3a4ugd",
  "osmo-test-4":
    "osmo1sm8weyvz7ues2mx9eg6rnqu9yazjdwru5p6u7u0jkhgmk6vqt8equ8t5xp",
  "uni-3": "juno1yfp9zyx9zhqe77d05yqjx3ctqjhzha0xn5d9x8zxcpp658ks2hvqlfjt72",
  "constantine-1":
    "archway1wnuakyjhvlnepk2g9ncvvaks0zy0axgx70pet4jh2nv8lmsuff9qseuvpc"
};

const get_count = async () => {
    const client_rpc = await CosmWasmClient.connect(rpcEndPoint[network]);
    const getCount = await client_rpc.queryContractSmart("osmo16hjln5cvs0magddmzheqfljeq2s5wwuf2pe37a269fv98evep3dq6tj246", {"query_pools": {}})
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
  let liquidity = await get_liquidity(pool_id)
  let total_shares = await get_total_shares(pool_id)
  return (liquidity / total_shares) * user_shares_amount
}

async function get_user_usd_value_for_pool(id){
  const url = `${lcdEndPoint[network]}/osmosis/lockup/v1beta1/account_locked_longer_duration/${account.address}`
  let total_usd_value = 0;

  const data = await $.get(url);

  for (const elem of data['locks']) {
    let coin = elem['coins'][0];
    const pool_id = coin['denom'].split("/").pop();
    if (pool_id === id) {
      let usd_value = await calculate_usd_value(pool_id, coin['amount']);
      total_usd_value += usd_value;
    }
  }
  return total_usd_value;
}



async function get_users_value_locked(){
  const url = `${lcdEndPoint[network]}/osmosis/lockup/v1beta1/account_locked_longer_duration/${account.address}`
  let total_usd_value = 0;

  const data = await $.get(url);

  for (const elem of data['locks']) {
    let coin = elem['coins'][0];
    const pool_id = coin['denom'].split("/").pop();
    let usd_value = await calculate_usd_value(pool_id, coin['amount']);
    total_usd_value += usd_value;
  }
  $('#user_value_locked .promo__value__number').text(numberWithSpaces(total_usd_value.toFixed(2)) + " USD");
}

function hide_user_related_elements(){
  $('#user_value_locked').hide();
  $('.balance').hide();
}

function show_user_related_elements(){
  $('#user_value_locked').show();
  $('#myVaults').show();
  $('.vaults__cards-item__body-item.balance').css("display", "flex");
  get_users_value_locked()
}

function getBalance(response, denom){
  let balance = 0;
  if (response['balances'].find((b) => b.denom === denom) != undefined) {
      balance = response['balances'].find((b) => b.denom === denom);
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

get_count().then(async (value) => {
  if (localStorage.getItem("isLoggedIn")){
    await connectKeplr();
  }
  await createVaultsList(value.pools);
  if (isUserConnected === false){
    hide_user_related_elements();
  }
  else {
    show_user_related_elements();
  }
  $('.vaults__cards-item').each(function(i) {
    $(this).on('click', async function() {
      let gamm = `gamm/pool/${value.pools[i].pool_id}`;
      if (isUserConnected) {
        let balances = await setBalances(value.pools[i].token_a_addr, value.pools[i].token_b_addr, gamm);
        $('.certain_balance')[0].innerHTML = balances[0];
        $('#coinBalanceOne').attr("value", balances[0]);
        $('.certain_balance')[1].innerHTML = balances[1];
        $('#coinBalanceTwo').attr("value", balances[1]);
        $('.certain_balance')[2].innerHTML = balances[2];
        $('#coinBalanceThree').attr("value", balances[2]);
      }
      createJson(); 
      $('.modal__header__title').text($('.vaults__cards-item__header-title').eq(i).text());
      $('.modal__header__subtitle').text($('.vaults__cards-item__header-subtitle').eq(i).text());
      $('#coinLabelOne').text($('.vaults__cards-item__header-title').eq(i).text().trim().split('-')[0]);
      $('#coinLabelTwo').text($('.vaults__cards-item__header-title').eq(i).text().trim().split('-')[1]);
      $('#coinLabelThree').text(gamm);
      $('#depositTokens').text(value.pools[i].token_a_name + " + " + value.pools[i].token_b_name);
      $('#depositLP').text(value.pools[i].pool_id + " LP token");
      $('input[name="coin one"]').attr("address", value.pools[i].token_a_addr)
      $('input[name="coin two"]').attr("address", value.pools[i].token_b_addr)
      $('input[name="coin three"]').attr("address", gamm)
      
      $('.modal__header__icon').each(function(j) {
        $(this).attr("src", $('.vaults__cards-item__header__icons').eq(i).find('.vaults__cards-item__header__icon').eq(j).attr("src"));
      });
      $('.modal__action__withdraw-label__header').text($('.vaults__cards-item__header-title').eq(i).text());
      $('.modal__descr-item__descr').each(function(j) {
        $(this).html($('.vaults__cards-item').eq(i).find('.vaults__cards-item__body-item__descr').eq(j).html());
      });
      $('.overlay, .modal').fadeIn('slow');
      $("html").css("overflow", "hidden");
      showTokensInput();

    });
  }); 
  sort();

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
  
  $('.vaults__cards-item__body-item__descr[data-daily]').each(function(i) {
    $(this)
      .attr("data-daily", parseFloat($(this).text(), 10));
  });

  // Sort

  $('#sort').find('.select-items div').on('click', function() {
    if ($(this).data("sort-type") !== "default") {
      $(this).on('click', sortCards($(this).data("sort-type")));
    } else {
      $(this).on('click', sortCards("data-name"));
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
      hide_none_user_vaults()
    }

  });
});


const createVaultsList = async (vaults) => {
  vaultsCards.innerHTML = "";
  for (const vault of vaults){
      let balance = 0;
      if (isUserConnected){
        balance = await get_user_usd_value_for_pool(vault.pool_id)
      }
      console.log(balance)
      vaultsCards.innerHTML += `
      <div class="vaults__cards-item " name="${balance > 0 ? 'user_vault' : ''}">
      <div class="vaults__cards-item__header">
          <div class="vaults__cards-item__header__icons">
              <div class="vaults__cards-item__header__circle_one">
                  <img src="https://app.osmosis.zone/_next/image?url=%2Ftokens%2F${vault.token_a_name.toLowerCase()}.svg" alt="coin icon" class="vaults__cards-item__header__icon">
              </div>

              <div class="vaults__cards-item__header__circle_two">
                  <img src="https://app.osmosis.zone/_next/image?url=%2Ftokens%2F${vault.token_b_name.toLowerCase()}.svg" alt="coin icon" class="vaults__cards-item__header__icon">
              </div>
          </div>

          <div class="vaults__cards-item__header__text">
              <div class="vaults__cards-item__header-title" data-name>${vault.token_a_name} - ${vault.token_b_name}</div>
              <div class="vaults__cards-item__header-subtitle">Farm: Osmosis</div>
          </div>

      </div>


      <div class="vaults__cards-item__body">
          <div class="vaults__cards-item__body-items">
              <div class="vaults__cards-item__body-item balance">
                  <div class="vaults__cards-item__body-item__title">My Balance</div>
                  <div class="vaults__cards-item__body-item__descr ">${numberWithSpaces(balance.toFixed(2))} USD </div>
                  <!--  <span class="span-balance">158 USD</span> -->
              </div>
              <div class="cross_line"></div>
              <div class="vaults__cards-item__body-item">
                  <div class="vaults__cards-item__body-item__title">TVL</div>
                  <div class="vaults__cards-item__body-item__descr" data-tvl>${vault.tvl} USD</div>
              </div>

              <div class="vaults__cards-item__body-item">
                  <div class="vaults__cards-item__body-item__title">APY</div>
                  <div class="vaults__cards-item__body-item__descr label-apy" data-apy>${vault.apy}%</div>
              </div>

              <div class="vaults__cards-item__body-item">
                  <div class="vaults__cards-item__body-item__title">Daily</div>
                  <div class="vaults__cards-item__body-item__descr" data-daily>${vault.daily_apr}%</div>
              </div>
          </div>
      </div>
  </div>
      `;
  };
};


btnModalAction.addEventListener("click", function (elem){
 deposit_funds(offlineSigner, account, this);
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

function createMsgSendJson(denom, value) {
  // get exponent of current token by querying https://api-osmosis.imperator.co/search/v1/exponent?symbol=OSMO
  // for now set just mock exponent, for osmo exponent = 6. Might be 6, 8, 18 for other tokens
  const exponent = 6;
  return {
    "denom": denom,
    "amount": `${value * (10**exponent)}`
  }
}

async function deposit_funds(offlineSigner, account, element) {

  let input1 = element.parentNode.querySelector('input[name="coin one"]');
  let input2 = element.parentNode.querySelector('input[name="coin two"]');
  let input3 = element.parentNode.querySelector('input[name="coin three"]');
  let choiceOfType = element.parentNode.querySelector('input[type=radio][name=deposit-coin]:checked').value;
  let denom1 = input1.getAttribute("address");
  let denom2 = input2.getAttribute("address");
  let denom3 = input3.getAttribute("address");
  const withdrawLPInput = document.querySelector('input[name="withdraw_lp"]').value;
  let msgJson = {};
  const stargateClient = await SigningCosmWasmClient.connectWithSigner(
    rpcEndPoint[network],
    offlineSigner
  ); 
  console.log(choiceOfType);
  if (choiceOfType === "tokens"){
    msgJson = {
      "fromAddress": account.address,
      "toAddress": "osmo1e4d8k78fvdxqtt8uut8tkw3r6540wrtx6pwn90yp3ughpezzfy9s6t4tts",
      "amount":[
        createMsgSendJson(denom1, input1.value),
        createMsgSendJson(denom2, input2.value),
      ]
    };
  } else{
    msgJson = {
      "fromAddress": account.address,
      "toAddress": "osmo1e4d8k78fvdxqtt8uut8tkw3r6540wrtx6pwn90yp3ughpezzfy9s6t4tts",
      "amount":[
        createMsgSendJson(denom3, input3.value),
      ]
    };
  }
  try {
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
    console.log(transaction);
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
        get_count()
        // Initialize the gaia api with the offline signer that is injected by Keplr extension.
        // const cosmJS = new SigningCosmosClient(
        //     // "https://lcd-osmosis.keplr.app/rest",
        //     "https://rest.sentry-01.theta-testnet.polypore.xyz",
        //     accounts[0].address,
        //     offlineSigner
        // );

  }
    
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
$('.vaults__cards-item').each(function(i) {
  $(this).on('click', function() {
    createJson(); 
    $('.modal__title').text($('.vaults__cards-item__header-title').eq(i).text());
    // $('.modal__subtitle').text($('.vaults__cards-item__header-subtitle').eq(i).text());
    $('.overlay, .modal').fadeIn('slow');
  });
});



// btnModalAction.addEventListener("click", () => createJson(type_of_msg).then((msg)=>{
//   console.log(msg);
// }), false);




async function createJson(type_of_msg) {

  // const depositFirstTokenInput = document.querySelector('input[name="pwd"]');
  // const depositSecondTokenInput = document.querySelector('input[name="pwd"]');
  // const depositLPInput = document.querySelector('input[name="pwd"]');
  const withdrawLPInput = document.querySelector('input[name="withdraw_lp"]').value;
  // const withdrawTokenInput = document.querySelector('input[name="pwd"]');

  switch(type_of_msg) {
    // case 'Deposit':
    //   msg = {
    //     "sender": btnWallet.textContent,
    //     "action": "Deposit", // possible values [Deposit, DeposipLP, Withdraw, WithdrawLP]
    //     "vaultID": 599,
    //     "pair": [
    //       {
    //         "denom": "ampLUNA",
    //         "amount": 12 // user input
    //       },
    //       {
    //         "denom": "LUNA",
    //         "amount": 88 // user input
    //       },
    //     ],
    //   };
    // case 'DepositLP':
    //   msg = {
    //     "sender": btnWallet.textContent,
    //     "action": "DepositLP", // possible values [Deposit, DeposipLP, Withdraw, WithdrawLP]
    //     "vaultID": 599,
    //     "amount": 33 // user input
        
    //   };
    //   case 'Withdraw':
    //     msg = {
    //       "sender": btnWallet.textContent,
    //       "action": "Withdraw", // possible values [Deposit, DeposipLP, Withdraw, WithdrawLP]
    //       "vaultID": 599,
    //       "amount": 33 // user input
          
    //     };
      case 'WithdrawLP':
        // let msg = {
        //   "sender": btnWallet.textContent,
        //   "action": "WithdrawLP", // possible values [Deposit, DeposipLP, Withdraw, WithdrawLP]
        //   "vaultID": 599,
        //   "token": {
        //     "transaction": modalActionLP.textContent,
        //     "amount": withdrawLPInput.value // user input
        //   }
          
        // };
        let msg = '{ "from_address": "' + account.address + 
          '" ,"to_address": "cosmos15ve85wv6yqrnpa0kdjsfcxcyksuwkjjfcq7tu3",' +
          '"amount":[' +
          '{ "denom":"uatom",' +
            ' "amount": "' + (withdrawLPInput * 1000000).toString() + 
          '"}' +
          ']' +
        '}';
        // const arbitraryMsg = window.keplr.signArbitrary(chainId[network], account.address, JSON.stringify(msg));
        // const base64 = "ewogICAgICAidHlwZSI6ICJvc21vc2lzL2dhbW0vc3dhcC1leGFjdC1hbW91bnQtaW4iLAogICAgICAidmFsdWUiOiB7CiAgICAgICAgInJvdXRlcyI6IFsKICAgICAgICAgIHsKICAgICAgICAgICAgInBvb2xfaWQiOiAiMSIsCiAgICAgICAgICAgICJ0b2tlbl9vdXRfZGVub20iOiAiaWJjLzI3Mzk0RkIwOTJEMkVDQ0Q1NjEyM0M3NEYzNkU0QzFGOTI2MDAxQ0VBREE5Q0E5N0VBNjIyQjI1RjQxRTVFQjIiCiAgICAgICAgICB9CiAgICAgICAgXSwKICAgICAgICAic2VuZGVyIjogIm9zbW8xNmxzdmc3dHB0NGNnM2Q5N3ZocnAybGV3dmV0eDhkazk4dHhjeHkiLAogICAgICAgICJ0b2tlbl9pbiI6IHsKICAgICAgICAgICJhbW91bnQiOiAiMTAwMDAwMCIsCiAgICAgICAgICAiZGVub20iOiAidW9zbW8iCiAgICAgICAgfSwKICAgICAgICAidG9rZW5fb3V0X21pbl9hbW91bnQiOiAiMTA2NzQzIgogICAgICB9CiAgICB9";
        // const base64_v2 = "eyJzZW5kZXIiOiJjb3Ntb3MxMHY0cmFkaGZ5ZHNtNnFnbHJhdzkyYzRseXV2bHVjYXdtcGRnZnUiLCJhY3Rpb24iOiJXaXRoZHJhd0xQIiwidmF1bHRJRCI6NTk5LCJ0b2tlbiI6eyJ0cmFuc2FjdGlvbiI6ImFtcExVTkEgLSBMVU5BIExQIiwiYW1vdW50IjoiMTIzIn19";
        // const tx = new Uint8Array([msg]);
        // const transaction =  window.keplr.sendTx(chainId[network], tx, "sync");
        // return transaction;
        // console.log(arbitraryMsg);
        console.log(msg);
        return JSON.parse(msg);
    default:
      break;
  }
}

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



// $('.vaults__cards__items').on('click', '.vaults__cards-item', function(i) {
//   $(this).on('click', function(i) {
//     createJson(); 
//     $('.modal__header__title').text($('.vaults__cards-item__header-title').eq(i).text());
//     $('.modal__header__subtitle').text($('.vaults__cards-item__header-subtitle').eq(i).text());
//     $('.modal__action__withdraw-label__header').text($('.vaults__cards-item__header-title').eq(i).text());
//     $('.modal__descr-item__descr').each(function(j) {
//       $(this).html($('.vaults__cards-item').eq(i).find('.vaults__cards-item__body-item__descr').eq(j).html());
//     });
//     $('.overlay, .modal').fadeIn('slow');
//     $("html").css("overflow", "hidden");
//   });
// });

$('.vaults__settings-views').on('click', ':not(.vaults__settings-views__view_active)', function() {
  $(this)
    .addClass('vaults__settings-views__view_active').siblings().removeClass('vaults__settings-views__view_active');
    // .closest('body').find('div.menu__content').removeClass('menu__content_active').eq($(this).index()).addClass('menu__content_active').siblings().removeClass('menu__content_active');
});

$('.modal__actions').on('click', ':not(.modal__actions-item_active)', function() {
  $(this)
    .addClass('modal__actions-item_active').siblings().removeClass('modal__actions-item_active')
    .closest('.modal__action').find('div.action__content').removeClass('action__content_active').eq($(this).index()).addClass('action__content_active').siblings().removeClass('action__content_active');
    $('.button__action')
      .text($('.modal__actions-item_active').text());
    if (this.textContent === "Deposit") {
      $('.button__action')
        .addClass('button__action_active').prop('disabled', false);
      $('.modal__action__withdraw-label__unbond')
        .addClass('modal__action__withdraw-label__unbond-lock')
        .removeClass('modal__action__withdraw-label__unbond-check');
      $('.modal__action__withdraw-input')
        .removeClass('modal__action__withdraw-input_active').find('input').prop('disabled', true);
    } else {
      $('.button__action')
        .removeClass('button__action_active').prop('disabled', true);
    }
});

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
  const modalIcon = statusModal.querySelector('.modal__mini__icon-img');
  const modalDescr = statusModal.querySelector('.modal__mini__descr');
  if (status === "error") {
    modalIcon.src = '../icons/error_circle.svg';
    modalDescr.textContent = "Пополнение не выполнено!";
    modalDescr.style.color = "#C21616";
  } else if (status === "success") {
    modalIcon.src = '../icons/check_circle.svg';
    modalDescr.textContent = "Отлично! У вас успешно получилось пополнить";
  }
  statusModal.previousElementSibling.style.display = 'none';
  statusModal.style.display = 'block';
}

// Search

$("#fsearch").on("keyup", function() {
  let value = "";
  let search = $(this).val().toLowerCase();

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

function sortCards(sortType) {
  let gridItems =  document.querySelector('.vaults__cards__items');

  for (let i = 0; i < gridItems.children.length; i++) {
    for (let j = i; j < gridItems.children.length; j++) {
      if (gridItems.children[i].querySelector('[' + sortType + ']').getAttribute(sortType) < gridItems.children[j].querySelector('[' + sortType + ']').getAttribute(sortType)) {
        let replacedNode = gridItems.replaceChild(gridItems.children[j], gridItems.children[i]);
        insertAfter(replacedNode, gridItems.children[i]);
      }
    }
  }
  if ($('#myVaults').hasClass("vaults__settings-views__view_active")){
    hide_none_user_vaults()
  }
}

function insertAfter(elem, refElem) {
  return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}