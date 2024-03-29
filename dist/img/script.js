import { SigningStargateClient } from "@cosmjs/stargate";

const btnWallet = document.querySelector(".button__wallet");
const btnModalAction = document.querySelector(".button__action");
const modalActionLP = document.querySelector('.modal__action__lp');
const chainId = "osmosis-1";
let offlineSigner;
let account;


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

const get_count = async (client, chainId) => {
    const result = await client.queryContractSmart("osmo1ultu4zxpv26eggsp78efquyscal0y6zjw958k2lnlq9v9wxysq2spj7f0z", {"query_list":{"user":"osmo18l247apx8uwhg6kzxyuu2nre6n5zkpfate55pf"}});
    return result;
};



btnWallet.addEventListener("click", () => connectKeplr());

async function sendMoney(offlineSigner, account) {
  console.log(offlineSigner, account);

  const withdrawLPInput = document.querySelector('input[name="withdraw_lp"]').value;

  const stargateClient = await SigningStargateClient.connectWithSigner(
    "https://rpc.osmosis.zone/",
    offlineSigner
  );  
  let msgJson = {
    "fromAddress": account.address,
    "toAddress": "osmo10v4radhfydsm6qglraw92c4lyuvlucawn67clw",
    "amount":[
    {
      "denom":"uosmo",
      "amount": (withdrawLPInput * 1000000).toString()
    }
    ]
  };
  const test = await stargateClient.getAccount(account.address);
  try {
    let transaction = await stargateClient.signAndBroadcast(
      account.address,
      [
        {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: msgJson
        }
      ],
      {
        gas: '200000',
        amount: [{ denom: 'stake', amount: '1000000000' }]
      }
    );
    console.log(transaction);
    console.log(get_count(sendRequest(offlineSigner, account), "osmo-test-4"));
  } catch (e){
    statusModalShow("error");
    console.log("Error");
  }
  
}

async function connectKeplr() {
    if (!window.keplr) {
        alert("Please install keplr extension");
        // Enabling before using the Keplr is recommended.
        // This method will ask the user whether to allow access if they haven't visited this website.
        // Also, it will request that the user unlock the wallet if the wallet is locked.
        await window.keplr.enable(chainId);
    
        offlineSigner = window.keplr.getOfflineSigner(chainId);
        console.log(offlineSigner);
    
        // You can get the address/public keys by `getAccounts` method.
        // It can return the array of address/public key.
        // But, currently, Keplr extension manages only one address/public key pair.
        // XXX: This line is needed to set the sender address for SigningCosmosClient.
        const accounts = await offlineSigner.getAccounts();

        // const transaction = await sendTx(chainId, accounts[0].pubkey, "sync");
        // console.log(transaction);

        account = accounts[0];
        
        console.log(accounts[0]);
        btnWallet.innerHTML = accounts[0].address;
        btnWallet.classList.add('button__wallet_signed');
    
        // Initialize the gaia api with the offline signer that is injected by Keplr extension.
        // const cosmJS = new SigningCosmosClient(
        //     // "https://lcd-osmosis.keplr.app/rest",
        //     "https://rest.sentry-01.theta-testnet.polypore.xyz",
        //     accounts[0].address,
        //     offlineSigner
        // );

  }
    
}




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


btnModalAction.addEventListener("click", () => sendMoney(offlineSigner, account));


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
        // const arbitraryMsg = window.keplr.signArbitrary(chainId, account.address, JSON.stringify(msg));
        // const base64 = "ewogICAgICAidHlwZSI6ICJvc21vc2lzL2dhbW0vc3dhcC1leGFjdC1hbW91bnQtaW4iLAogICAgICAidmFsdWUiOiB7CiAgICAgICAgInJvdXRlcyI6IFsKICAgICAgICAgIHsKICAgICAgICAgICAgInBvb2xfaWQiOiAiMSIsCiAgICAgICAgICAgICJ0b2tlbl9vdXRfZGVub20iOiAiaWJjLzI3Mzk0RkIwOTJEMkVDQ0Q1NjEyM0M3NEYzNkU0QzFGOTI2MDAxQ0VBREE5Q0E5N0VBNjIyQjI1RjQxRTVFQjIiCiAgICAgICAgICB9CiAgICAgICAgXSwKICAgICAgICAic2VuZGVyIjogIm9zbW8xNmxzdmc3dHB0NGNnM2Q5N3ZocnAybGV3dmV0eDhkazk4dHhjeHkiLAogICAgICAgICJ0b2tlbl9pbiI6IHsKICAgICAgICAgICJhbW91bnQiOiAiMTAwMDAwMCIsCiAgICAgICAgICAiZGVub20iOiAidW9zbW8iCiAgICAgICAgfSwKICAgICAgICAidG9rZW5fb3V0X21pbl9hbW91bnQiOiAiMTA2NzQzIgogICAgICB9CiAgICB9";
        // const base64_v2 = "eyJzZW5kZXIiOiJjb3Ntb3MxMHY0cmFkaGZ5ZHNtNnFnbHJhdzkyYzRseXV2bHVjYXdtcGRnZnUiLCJhY3Rpb24iOiJXaXRoZHJhd0xQIiwidmF1bHRJRCI6NTk5LCJ0b2tlbiI6eyJ0cmFuc2FjdGlvbiI6ImFtcExVTkEgLSBMVU5BIExQIiwiYW1vdW50IjoiMTIzIn19";
        // const tx = new Uint8Array([msg]);
        // const transaction =  window.keplr.sendTx(chainId, tx, "sync");
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

$('.vaults__cards-item').each(function(i) {
  $(this).on('click', function() {
    createJson(); 
    $('.modal__header__title').text($('.vaults__cards-item__header-title').eq(i).text());
    $('.modal__header__subtitle').text($('.vaults__cards-item__header-subtitle').eq(i).text());
    $('.modal__action__withdraw-label__header').text($('.vaults__cards-item__header-title').eq(i).text());
    $('.modal__descr-item__descr').each(function(j) {
      $(this).html($('.vaults__cards-item').eq(i).find('.vaults__cards-item__body-item__descr').eq(j).html());
    });
    $('.overlay, .modal').fadeIn('slow');
    $("html").css("overflow", "hidden");
  });
});

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
});

function sortCards(sortType) {
  let gridItems = document.querySelector('.vaults__cards__items');
  let farmsSort = document.querySelector('#farms .select-selected').textContent;

  // for (let i = 0; i < gridItems.children.length; i++) {
  //   gridItems.children[i].style.display = `block`;
  // }

  for (let i = 0; i < gridItems.children.length; i++) {
    for (let j = i; j < gridItems.children.length; j++) {
      if (gridItems.children[i].querySelector('[' + sortType + ']').getAttribute(sortType) < gridItems.children[j].querySelector('[' + sortType + ']').getAttribute(sortType)) {
        let replacedNode = gridItems.replaceChild(gridItems.children[j], gridItems.children[i]);
        insertAfter(replacedNode, gridItems.children[i]);
      }
    }
  }

  // for (let i = 0; i < gridItems.children.length; i++) {
  //   if (gridItems.children[i].querySelector(".vaults__cards-item__header-subtitle").textContent !== farmsSort) {
  //     gridItems.children[i].style.display = `none`;
  //   }
  //   else {
  //     gridItems.children[i].style.display = `block`;
  //   }
  // }
}

// function sortByFarm(sortFarm) {
//   let gridItems = document.querySelector('.vaults__cards__items');

//   for (let i = 0; i < gridItems.children.length; i++) {
//     for (let j = i; j < gridItems.children.length; j++) {
//       if (gridItems.children[i].querySelector(".vaults__cards-item__header-subtitle").getAttribute(sortFarm) === gridItems.children[j].querySelector(".vaults__cards-item__header-subtitle").textContent) {
//         let replacedNode = gridItems.replaceChild(gridItems.children[j], gridItems.children[i]);
//         insertAfter(replacedNode, gridItems.children[i]);
//       }
//     }
//   }
// }

function insertAfter(elem, refElem) {
  return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}


// Query


// sendRequest(offlineSigner, account);

// console.log(get_count(sendRequest(offlineSigner, account), "osmo-test-4"));