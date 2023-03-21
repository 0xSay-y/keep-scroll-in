import { useEffect, useState } from "react"
import "./App.css"
import { ethers } from "ethers"
import faucetContract from "./ethereum/faucet"
const ERC20ABI = require('./ethereum/ERC20.json');

function App() {
  // FAUCET
  const [walletAddress, setWalletAddress] = useState("")
  const [signer, setSigner] = useState()
  const [contract, setContract] = useState()

  useEffect(() => {
    getConnectedWallet()
    changeWallet()
  }, [walletAddress])

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", [])

        setSigner(provider.getSigner())
        setContract(faucetContract(provider))
        setWalletAddress(accounts[0])

        const KSIaddress = "0x41485c5Fd37B1a4d892f2f4b668398242AE4f981"
        const KSI = new ethers.Contract(KSIaddress, ERC20ABI, provider)
        const KSIbalance = await KSI.balanceOf(accounts[0]) / 10**18
        // console.log(KSIbalance.toString())
      } catch (err) {
        setWalletAddress("")
        console.error(err.message)
      }
    }
  }

  const getConnectedWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send("eth_accounts", [])

        if (accounts.length > 0) {
          setSigner(provider.getSigner())
          setContract(faucetContract(provider))
          setWalletAddress(accounts[0])
        } else {
          setWalletAddress("")
        }
      } catch (err) {
        setWalletAddress("")
        console.error(err.message)
      }
    }
  }

  const changeWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
          } else {
            setWalletAddress("")
          }
        })
      } catch (err) {
        setWalletAddress("")
        console.error(err.message)
      }
    }
  }

  const getKSI = async () => {
    try {
      const contractWithSigner = contract.connect(signer)
      const resp = await contractWithSigner.requestTokens()
    } catch (err) {
      console.error(err.message)
    }
  }

  // const getBalance = async () => {
  //   try {

  //   } catch (err) {
      
  //   }  
  // }

  // SCROLL
  const [isOpen, setOpen] = useState(false)

  const updateScroll = () => {
    if (isOpen == true) {
      setOpen(false)
      setTimeout(() => {
        setOpen(true)
      }, 1000)
    } else {
      setOpen(true)
    }
  }

  // window.scrollBy({
  //   top: 300,
  //   left: 0,
  //   behavior: "smooth",
  // })

  // const middle = document.getElementById("scroll-middle-svg")
  // setTimeout(() => {
  //   middle.style.height = "400px"
  // }, 500)

  return (
    <div>
      <header>
        <div id="header-top">
          <div id="logo"><p><span>Keep</span> Scroll <span>in</span></p></div>

          <div id="nav">
            <div className="btn" id="btn-play" onClick={updateScroll}>Play</div>
            <div className="btn" id="btn-faucet" onClick={getKSI}>Faucet</div>
            <div className="btn" id="btn-faq">FAQ</div>
          </div>

          <div id="wallet" onClick={connectWallet}>
            <img src="metamask.png"></img>
            <p>{walletAddress.length > 0 ? `${walletAddress.substring(0,4)}...${walletAddress.substring(38)}` : "Connection"}</p>
          </div>
        </div>

        {/* <div id="header-bottom">
          <p id="wallet-amount">{KSIbalance !== 0 ? "Your balance: " `${KSIbalance.toString()}` : "Your balance: 0.00 KSI"}</p>
        </div> */}
      </header>
      
      <main>
        <div id="scroll-container">
          <div id="scroll-top">
            <svg width="560" height="120" viewBox="0 0 560 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="-0.00012207" width="560" height="120" rx="60" fill="url(#paint0_linear_61_9)"/>
              <circle cx="59.9999" cy="60" r="60" fill="url(#paint1_linear_61_9)"/>
              <circle cx="59.9999" cy="60" r="29.5" fill="url(#paint2_linear_61_9)" stroke="#333333"/>
              <path d="M74.9999 60C74.9999 51.7157 68.2841 45 59.9999 45C51.7156 45 44.9999 51.7157 44.9999 60" stroke="#333333"/>
              <path d="M60 103C84.3005 103 104 83.7482 104 60C104 36.2518 84.3005 17 60 17" stroke="url(#paint3_linear_61_9)"/>
              <defs>
              <linearGradient id="paint0_linear_61_9" x1="280" y1="60" x2="280" y2="120.463" gradientUnits="userSpaceOnUse">
              <stop stop-color="#F5EFE7"/>
              <stop offset="0.905322" stop-color="#BBB3A9"/>
              </linearGradient>
              <linearGradient id="paint1_linear_61_9" x1="98.4999" y1="115.5" x2="22.4999" y2="6.65802e-06" gradientUnits="userSpaceOnUse">
              <stop stop-color="#F2ECE3"/>
              <stop offset="1" stop-color="#D2C8BA"/>
              </linearGradient>
              <linearGradient id="paint2_linear_61_9" x1="31.4999" y1="60" x2="89.9999" y2="60" gradientUnits="userSpaceOnUse">
              <stop stop-color="#E3D8C9"/>
              <stop offset="1" stop-color="#BBB3A9"/>
              </linearGradient>
              <linearGradient id="paint3_linear_61_9" x1="63.5" y1="17" x2="64" y2="103" gradientUnits="userSpaceOnUse">
              <stop stop-color="#333333"/>
              <stop offset="0.5" stop-color="#D6C8B4"/>
              </linearGradient>
              </defs>
            </svg>
          </div>

          <div id="scroll-middle">
            <div id="scroll-txt" style={{'opacity':`${isOpen ? 1 : 0}`, 'transition': `${isOpen ? 'opacity 2.5s' : 'opacity 0.5s'}`}}>
              <p className="title">Select a distance:</p>

              <p className="distance">
                <span>0<span className="px">px</span></span>
                <svg width="59" height="24" viewBox="0 0 59 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.93934 10.9393C0.353553 11.5251 0.353553 12.4749 0.93934 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.93934 10.9393ZM58.0607 13.0607C58.6465 12.4749 58.6465 11.5251 58.0607 10.9393L48.5147 1.3934C47.9289 0.807611 46.9792 0.807611 46.3934 1.3934C45.8076 1.97919 45.8076 2.92893 46.3934 3.51472L54.8787 12L46.3934 20.4853C45.8076 21.0711 45.8076 22.0208 46.3934 22.6066C46.9792 23.1924 47.9289 23.1924 48.5147 22.6066L58.0607 13.0607ZM2 13.5H57V10.5H2V13.5Z"/>
                </svg>
                <span>1000<span className="px">px</span></span>
              </p>
              
              <p className="distance">
                <span>1000<span className="px">px</span></span>
                <svg width="59" height="24" viewBox="0 0 59 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.93934 10.9393C0.353553 11.5251 0.353553 12.4749 0.93934 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.93934 10.9393ZM58.0607 13.0607C58.6465 12.4749 58.6465 11.5251 58.0607 10.9393L48.5147 1.3934C47.9289 0.807611 46.9792 0.807611 46.3934 1.3934C45.8076 1.97919 45.8076 2.92893 46.3934 3.51472L54.8787 12L46.3934 20.4853C45.8076 21.0711 45.8076 22.0208 46.3934 22.6066C46.9792 23.1924 47.9289 23.1924 48.5147 22.6066L58.0607 13.0607ZM2 13.5H57V10.5H2V13.5Z"/>
                </svg>
                <span>2000<span className="px">px</span></span>
              </p>

              <div className="btn" id="btn-start">Start</div>
            </div>
        
            <svg width="440" height={`${isOpen ? '60vh' : '120px'}`} id="scroll-middle-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            </svg>
          </div>

          <div id="scroll-bottom">
            <svg width="560" height="120" viewBox="0 0 560 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="-0.00012207" width="560" height="120" rx="60" fill="url(#paint0_linear_61_6)"/>
              <circle cx="59.9999" cy="60" r="60" fill="url(#paint1_linear_61_6)"/>
              <circle cx="59.9999" cy="60" r="29.5" fill="url(#paint2_linear_61_6)" stroke="#333333"/>
              <path d="M74.8751 59C74.8751 67.2843 68.1706 74 59.9001 74C51.6296 74 44.925 67.2843 44.925 59" stroke="#333333"/>
              <path d="M59.9999 17C35.6994 17 15.9999 36.2518 15.9999 60C15.9999 83.7482 35.6994 103 59.9999 103" stroke="url(#paint3_linear_61_6)"/>
              <defs>
              <linearGradient id="paint0_linear_61_6" x1="280" y1="0" x2="280" y2="120" gradientUnits="userSpaceOnUse">
              <stop stop-color="white"/>
              <stop offset="1" stop-color="#CDC1B2"/>
              </linearGradient>
              <linearGradient id="paint1_linear_61_6" x1="59.9999" y1="0" x2="59.9999" y2="120" gradientUnits="userSpaceOnUse">
              <stop stop-color="#F2ECE3"/>
              <stop offset="1" stop-color="#BFB3A3"/>
              </linearGradient>
              <linearGradient id="paint2_linear_61_6" x1="31.4999" y1="60" x2="89.9999" y2="60" gradientUnits="userSpaceOnUse">
              <stop stop-color="#E3D8C9"/>
              <stop offset="1" stop-color="#BBB3A9"/>
              </linearGradient>
              <linearGradient id="paint3_linear_61_6" x1="56.4999" y1="103" x2="55.9999" y2="17" gradientUnits="userSpaceOnUse">
              <stop stop-color="#333333"/>
              <stop offset="0.5" stop-color="#D6C8B4"/>
              </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </main>

      {/* <footer>
        <p>Made by Say_y</p>
      </footer> */}
    </div>
  )
}

export default App;