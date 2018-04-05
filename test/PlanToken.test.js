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

    it('has 500.000.000 millions token supply', async () =>{
        const totalSupply = await planToken.methods.totalSupply().call();
        assert.equal('500000000', web3.utils.fromWei(totalSupply, 'ether'));
    });

    it('gives owner total supply', async()=>{
        const balance = await planToken.methods.balanceOf(accounts[0]).call();
        assert.equal('500000000', web3.utils.fromWei(balance, 'ether'));
    });

    it('transfer token from owner account to other account', async()=>{
        const transfer = await planToken.methods.transfer(accounts[1], web3.utils.toWei('1000', 'ether')).send({
            from: accounts[0],
            gas: '1000000'
        });

        const balance = await planToken.methods.balanceOf(accounts[1]).call();
        assert.equal('1000', web3.utils.fromWei(balance, 'ether'));
    });

    it('can tranfer ownership', async()=>{

        const transferOwnership = await planToken.methods.transferOwnership(accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        const acceptOwnership = await planToken.methods.acceptOwnership().send({
            from: accounts[1],
            gas: '1000000'
        });

        const newOwner = await planToken.methods.owner().call();
        assert.equal(accounts[1], newOwner);

    })
    
})