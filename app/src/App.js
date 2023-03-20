import { useEffect, useState } from "react"
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("")

  useEffect(() => {
    getConnectedWallet()
    changeWallet()
  }, [walletAddress])

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        })
        setWalletAddress(accounts[0])
      } catch (err) {
        setWalletAddress("")
        console.error(err.message)
      }
    }
  }
  const getConnectedWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts"
        })
        if (accounts.length > 0) {
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

  return (
    <div>
      <header>
        <div id="header-top">
          <div id="logo"><p>Keep Scroll in</p></div>

          <div id="nav">
            <div className="btn selected" id="btn-play">Play</div>
            <div className="btn" id="btn-faucet">Faucet</div>
            <div className="btn" id="btn-faq">FAQ</div>
          </div>

          <div id="wallet" onClick={connectWallet}>
            <img src="metamask.png"></img>
            <p>{walletAddress.length > 0 ? `${walletAddress.substring(0,4)}...${walletAddress.substring(38)}` : "Connection"}</p>
          </div>
        </div>

        {/* <div id="header-bottom">
          <p id="wallet-amount">...</p>
        </div> */}
      </header>
      
      <main>
        <div id="scroll">
          
        </div>

      </main>
    </div>
  )
}

export default App;