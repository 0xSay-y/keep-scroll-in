import { ethers } from "ethers"

const gameAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"msg","type":"string"},{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"bool","name":"winner","type":"bool"}],"name":"Status","type":"event"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"enter","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"randomNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]

const gameContract = (provider) => {
  return new ethers.Contract(
    "0x68cd17A476E31Aa16f5e2c0d1463D356f658fB16",
    gameAbi,
    provider
  )
}

export default gameContract