import { ethers } from './ethers.js'
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')
const getBalanceButton = document.getElementById('getBalanceButton')
const withdrawButton = document.getElementById('withdrawButton')

connectButton.onclick = connect
fundButton.onclick = fund
getBalanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    console.log('Connected!')
    connectButton.innerHTML = 'Connected!'
  } else {
    connectButton.innerHTML = 'Please install metamask'
  }
}

async function fund() {
  const ethAmount = document.getElementById('ethAmount').value
  if (typeof window.ethereum !== 'undefined') {
    console.log(`Funding: ${ethAmount} ETH`)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const txResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTransactionMined(txResponse, provider)
    } catch (err) {
      console.error(err)
    }
  }
}

function listenForTransactionMined(txResponse, provider) {
  console.log(`Mining ${txResponse.hash}`)
  return new Promise((resolve, reject) => {
    provider.once(txResponse.hash, (txReceipt) => {
      console.log(`Completed with ${txReceipt.confirmations} confirmations`)
    })
    resolve()
  })
}

async function getBalance() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
      const balance = await provider.getBalance(contractAddress)
      console.log(ethers.utils.formatEther(balance))
    } catch (err) {
      console.error(err)
    }
  }
}

async function withdraw() {
  if (typeof window.ethereum !== 'undefined') {
    console.log(`Withdrawing ETH`)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const txResponse = await contract.withdraw()
      await listenForTransactionMined(txResponse, provider)
    } catch (err) {
      console.error(err)
    }
  }
}
