const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledPlanToken = require('../build/PortToken.json');

let accounts;
let portToken;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    portToken = await new web3.eth.Contract(JSON.parse(compiledPlanToken.interface))
    .deploy({ data: compiledPlanToken.bytecode })
    .send( { from: accounts[0], gas: '1000000' });
    portToken.setProvider(provider);

});

describe('PortToken', () => {

    it('deploys the token', () =>{
        assert.ok(portToken.options.address);
    });

    it('has 500.000.000 millions token supply', async () =>{
        const totalSupply = await portToken.methods.totalSupply().call();
        assert.equal('500000000', web3.utils.fromWei(totalSupply, 'ether'));
    });

    it('gives owner total supply', async()=>{
        const balance = await portToken.methods.balanceOf(accounts[0]).call();
        assert.equal('500000000', web3.utils.fromWei(balance, 'ether'));
    });

    it('transfer token from owner account to another account', async()=>{
        const transfer = await portToken.methods.transfer(accounts[1], web3.utils.toWei('1000', 'ether')).send({
            from: accounts[0],
            gas: '1000000'
        });

        const balance = await portToken.methods.balanceOf(accounts[1]).call();
        assert.equal('1000', web3.utils.fromWei(balance, 'ether'));
    });

    it('transfer token from one account to another account', async()=>{
        const transfer = await portToken.methods.transfer(accounts[1], web3.utils.toWei('1000', 'ether')).send({
            from: accounts[0],
            gas: '1000000'
        });

        const transfer2 = await portToken.methods.transfer(accounts[2], web3.utils.toWei('100', 'ether')).send({
            from: accounts[1],
            gas: '1000000'
        });

        const balance = await portToken.methods.balanceOf(accounts[2]).call();
        assert.equal('100', web3.utils.fromWei(balance, 'ether'));
    });

    it('cant transfer tokens if an account doesnt have tokens', async()=>{
        try {
            const transfer = await portToken.methods.transfer(accounts[2], web3.utils.toWei('100', 'ether')).send({
                from: accounts[3],
                gas: '1000000'
            });
            assert(false);
        } catch (error) {
            assert.ok(error);
        }
    });

    it('can transfer ownership', async()=>{

        const transferOwnership = await portToken.methods.transferOwnership(accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        const acceptOwnership = await portToken.methods.acceptOwnership().send({
            from: accounts[1],
            gas: '1000000'
        });

        const newOwner = await portToken.methods.owner().call();
        assert.equal(accounts[1], newOwner);
    });
    
})