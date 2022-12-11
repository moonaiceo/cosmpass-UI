const btnWallet = document.querySelector(".button_wallet");
const btnModalAction = document.querySelector(".button_action");
const modalActionLP = document.querySelector('.modal__action__lp');


type_of_msg = "WithdrawLP";

btnWallet.addEventListener("click", () => connectKeplr());

async function connectKeplr() {
    if (!window.keplr) {
        alert("Please install keplr extension");
    } else {
        const chainId = "osmosis-1";

        // Enabling before using the Keplr is recommended.
        // This method will ask the user whether to allow access if they haven't visited this website.
        // Also, it will request that the user unlock the wallet if the wallet is locked.
        await window.keplr.enable(chainId);
    
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
    
        // You can get the address/public keys by `getAccounts` method.
        // It can return the array of address/public key.
        // But, currently, Keplr extension manages only one address/public key pair.
        // XXX: This line is needed to set the sender address for SigningCosmosClient.
        const accounts = await offlineSigner.getAccounts();

        console.log(accounts[0]);
    
        // Initialize the gaia api with the offline signer that is injected by Keplr extension.
        // const cosmJS = new SigningCosmosClient(
        //     "https://lcd-cosmoshub.keplr.app",
        //     accounts[0].address,
        //     offlineSigner,
        // );

        btnWallet.innerHTML = accounts[0].address;
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



btnModalAction.addEventListener("click", () => createJson(type_of_msg));

function createJson(type_of_msg) {

  // const depositFirstTokenInput = document.querySelector('input[name="pwd"]');
  // const depositSecondTokenInput = document.querySelector('input[name="pwd"]');
  // const depositLPInput = document.querySelector('input[name="pwd"]');
  const withdrawLPInput = document.querySelector('input[name="withdraw_lp"]');
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
        msg = {
          "sender": btnWallet.textContent,
          "action": "WithdrawLP", // possible values [Deposit, DeposipLP, Withdraw, WithdrawLP]
          "vaultID": 599,
          "token": {
            "transaction": modalActionLP.textContent,
            "amount": withdrawLPInput.value // user input
          }
          
        };
        console.log(msg);
        break;
    default:
      break;
  }
}

// Modal

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
