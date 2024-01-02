// scripts\exchange.js

const { ethers } = require('hardhat');
const routerArtifact = require('@uniswap/v2-periphery/build/UniswapV2Router02.json');
const usdtArtifact = require('../artifacts/contracts/DREX.sol/DREX.json');
const wethArtifact = require('../artifacts/contracts/ERC20.sol/REAL.json');

const hre = require('hardhat');

const CONTRACT_ADDRESS = {
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    ROUTER: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
}

async function getSigner() {
    const [signer] = await hre.ethers.getSigners();
    console.log('Signer address:', signer.address);
    return signer;
}

function getContractInstance(address, artifact, signer) {
    return new ethers.Contract(address, artifact.abi, signer);
}

async function logBalances(provider, signer, contracts) {
    const {usdt, weth} = contracts;
    const ethBalance = await provider.getBalance(signer.address);
    const usdtBalance = await usdt.balanceOf(signer.address);
    const wethBalance = await weth.balanceOf(signer.address);

    console.log('--------------------');
    console.log('ETH Balance: ', ethers.formatEther(ethBalance));
    console.log('USDT Balance: ', ethers.formatEther(usdtBalance));
    console.log('WETH Balance: ', ethers.formatEther(wethBalance));
    console.log('--------------------');
}

async function executeSwap(provider, signer, contracts, amountIn) {
    const { usdt, weth, router } = contracts;
    const nonce = await provider.getTransactionCount(signer.address, 'pending');

    await signer.sendTransaction({
        to: CONTRACT_ADDRESS.WETH,
        value: ethers.parseEther('5'),
        nonce: nonce
    });

    logBalances(provider, signer, contracts);

    const tx1 = await usdt.approve(CONTRACT_ADDRESS.ROUTER, amountIn);
    await tx1.wait();

    const tx2 = await router.swapExactTokensForTokens(
        amountIn,
        0,
        [CONTRACT_ADDRESS.USDT, CONTRACT_ADDRESS.WETH],
        signer.address,
        Math.floor(Date.now() / 1000) + (60 * 10),
        {
            gasLimit: 1000000,
        }
    );
    await tx2.wait();

    logBalances(provider, signer, contracts);
}

async function main() {
    const signer = await getSigner();
    const provider = hre.ethers.provider;

    const contracts = {
        router: getContractInstance(CONTRACT_ADDRESS.ROUTER, routerArtifact, signer),
        usdt: getContractInstance(CONTRACT_ADDRESS.USDT, usdtArtifact, signer),
        weth: getContractInstance(CONTRACT_ADDRESS.WETH, wethArtifact, signer)
    }    

    const amountIn = ethers.parseEther('1');

    await executeSwap(provider, signer, contracts, amountIn);
}

main().catch(e => {
    console.log(e);
    process.exitCode = 1;
});




