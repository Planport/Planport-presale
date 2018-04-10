const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/PlanToken.json');

const provider = new HDWalletProvider(
    'Mnemonic ... ... ... ... ...',
    'https://rinkeby.infura.io/qCPxJQV2ZokAOV6SzbMG'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    // Account to deploy
    const account = accounts[0];
    
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: account});
    
    console.log('TOKEN ABI', compiledFactory.interface);
    console.log('Deployment Account', account);
    console.log('***TOKEN ADDRESS*** : ', result.options.address); 
    
};
deploy();

