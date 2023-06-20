import Web3 from 'web3';
import pufAuth from '../build/contracts/pufAuth.json';

let web3;
let PufAuth;

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    resolve(new Web3('http://localhost:9545'));
  });
};

const initContract = () => {
  const deploymentKey = Object.keys(pufAuth.networks)[0];
  return new web3.eth.Contract(
    pufAuth.abi, 
    pufAuth
      .networks[deploymentKey]
      .address
  );
};

const initApp = () => {
  const $getChallenge = document.getElementById('getChallenge');
  const $getChallengeResult = document.getElementById('getChallengeResult');
  const $helperDataExtraction = document.getElementById('helperDataExtraction');
  const $helperDataResult = document.getElementById('helperDataResult');
  const $helperDataView = document.getElementById('helperDataView');
  const $helperDataViewResult = document.getElementById('helperDataViewResult');
  const $deltaCalculation = document.getElementById('deltaCalculation');
  const $deltaCalculationResult = document.getElementById('deltaCalculationResult');
  const $delta = document.getElementById('delta');
  const $deltaResult = document.getElementById('deltaResult');
  const $pufCorrection = document.getElementById('pufCorrection');
  const $pufCorrectionResult = document.getElementById('pufCorrectionResult');
  const $viewPufCorrection = document.getElementById('viewPufCorrection');
  const $viewPufCorrectionResult = document.getElementById('viewPufCorrectionResult');
  const $pufChecking = document.getElementById('pufChecking');
  const $pufCheckingResult = document.getElementById('pufCheckingResult');
  const $viewPufChecking = document.getElementById('viewPufChecking');
  const $viewPufCheckingResult = document.getElementById('viewPufCheckingResult');
  var counter = 0;

  let accounts = [];

  web3.eth.getAccounts()
  .then(_accounts => {
    accounts = _accounts;
    });

  $getChallenge.addEventListener('submit', (e) => {
    e.preventDefault();
    PufAuth.methods.getChallenge().call()
      .then(result => {
	$getChallengeResult.innerHTML = result.join('');
      })
  });

  $helperDataExtraction.addEventListener('submit', (e) => {
    e.preventDefault();
    const helperData = e.target.elements[0].value;
       PufAuth.methods.helperDataExtraction(helperData).send({from: accounts[0]})
         .then(result => {
          // PufAuth.methods.viewhelperDataExtraction().call();
	   $helperDataResult.innerHTML = 'Helper data was extracted.';
      })
  });

  $helperDataView.addEventListener('submit', (e) => {
    e.preventDefault();
    PufAuth.methods.viewHelperDataExtraction().call()
      .then(result => {
	$helperDataViewResult.innerHTML = result.join(', ');
      })
  });

  $deltaCalculation.addEventListener('submit', (e) => {
    e.preventDefault();

    const secondResp = Array.from(String(e.target.elements[0].value), Number);
    const newChal = Array.from(String(e.target.elements[1].value), Number);
    const XORResp = Array.from(String(e.target.elements[2].value), Number);
    const userId = e.target.elements[3].value;
       PufAuth.methods.deltaCalculation(secondResp, newChal, XORResp, userId).send({from: accounts[0]})
         .then(result => {
	   $deltaCalculationResult.innerHTML = 'Delta efficiency was extracted.';
      })
  });

  $delta.addEventListener('submit', (e) => {
    e.preventDefault();
    PufAuth.methods.viewDeltaCalculation().call()
      .then(result => {
	$deltaResult.innerHTML = result.join(', ');
      })
  });

  $pufCorrection.addEventListener('submit', (e) => {
    e.preventDefault();

       PufAuth.methods.pufCorrection().send({from: accounts[0]})
         .then(result => {
          // PufAuth.methods.viewhelperDataExtraction().call();
	   $pufCorrectionResult.innerHTML = 'PUF Response was corrected.';
      })
  });

  $viewPufCorrection.addEventListener('submit', (e) => {
    e.preventDefault();
    PufAuth.methods.viewPufCorrection().call()
      .then(result => {
	$viewPufCorrectionResult.innerHTML = result.join('');
      })

  });

  $pufChecking.addEventListener('submit', (e) => {

    e.preventDefault();
       PufAuth.methods.pufChecking().send({from: accounts[0]})

         .then(result => {
             PufAuth.methods.falseResponsesCounting().call()
            .then(newresult => {
	      if (newresult == 0){
                counter = 0;
	        $pufCheckingResult.innerHTML = 'Congratulations!!! Your PUF Response is valid. Get your new challenge.';
	      }
	      else{
                counter++;
                if (counter < 2){
	           $pufCheckingResult.innerHTML = 'Your PUF response has more than 1 error in each block. Please correct it and enter a new response.';
	        }
                else if (counter == 2){
	           $pufCheckingResult.innerHTML = 'Your PUF response has more than 1 error in each block. This is your last chance to enter a valid response.';      
	        }
                else if (counter > 2){
	           $pufCheckingResult.innerHTML = 'Your responses were not valid. you can not enter another response.';      
	        }
              }
            })
         })

  });


};

document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      PufAuth = initContract();
      initApp(); 
    })
    .catch(e => console.log(e.message));
});
