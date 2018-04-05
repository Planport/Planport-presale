const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledPlanToken = require('../build/PlanToken.json');

let accounts;
let planToken;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    planToken = await new web3.eth.Contract(JSON.parse(compiledPlanToken.interface))
    .deploy({ data: compiledPlanToken.bytecode })
    .send( { from: accounts[0], gas: '1000000' });
    planToken.setProvider(provider);

});

describe('PlanToken', () => {

    it('deploys the token', () =>{
        assert.ok(planToken.options.address);
    });
    
})