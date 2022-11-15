import { ethers } from './ethers.js'

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')

connectButton.onclick = connect
fundButton.onclick = fund

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    console.log('Connected!')
    connectButton.innerHTML = 'Connected!'
  } else {
    connectButton.innerHTML = 'Please install metamask'
  }
}

async function fund(ethAmount) {
  if (typeof window.ethereum !== 'undefined') {
    console.log(`Funding: ${ethAmount}`)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    console.log(signer)
    // const contract
  }
}
