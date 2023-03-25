import { useEffect, useState } from "react"
import "./App.css"
import { ethers } from "ethers"
import faucetContract from "./js/faucet"
import gameContract from "./js/game"
const ERC20ABI = require('./json/ERC20.json')
const randomNb = require('./py/randomNb.json')

function App() {
  // WALLET
  const [walletAddress, setWalletAddress] = useState('')
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

        // const KSIaddress = "0x41485c5Fd37B1a4d892f2f4b668398242AE4f981"
        // const KSI = new ethers.Contract(KSIaddress, ERC20ABI, provider)
        // const KSIbalance = await KSI.balanceOf(accounts[0]) / 10**18
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

  // FAUCET
  // const getKSI = async () => {
  //   try {
  //     const contractWithSigner = contract.connect(signer)
  //     const resp = await contractWithSigner.requestTokens()
  //   } catch (err) {
  //     console.error(err.message)
  //   }
  // }

  // SCROLL
  const [isGameOpen, setGameOpen] = useState(false)
  const [isFaqOpen, setFaqOpen] = useState(false)
  const [isResultOpen, setResultOpen] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [scrollMove, setScrollMove] = useState('rotate')

  const updateScrollPlay = () => {
    if (isGameOpen == true || isGameOpen == false && isFaqOpen == true || isGameOpen == false && isResultOpen == true) {
      if (isGameOpen == false && isResultOpen == true) {
        setTimeout(() => {
          setGameOpen(true)
        }, 1100) 
      } else {
        setTimeout(() => {
          setGameOpen(true)
        }, 800)
      }
      setGameOpen(false)
      setFaqOpen(false)
      setResultOpen(false)
      setShowResult(false)
    } else {
      setGameOpen(true)
      setFaqOpen(false)
      setResultOpen(false)
    }
    
    setDistance1('')
    setDistance2('')
    setBtnOk('btn')
    setScrollMove('')
    setDistancePx('500px')
  }
  const updateScrollFAQ = () => {
    if (isFaqOpen == true || isFaqOpen == false && isGameOpen == true || isFaqOpen == false && isResultOpen == true) {
      if (isFaqOpen == false && isResultOpen == true) {
        setTimeout(() => {
          setFaqOpen(true)
        }, 1100) 
      } else {
        setTimeout(() => {
          setFaqOpen(true)
        }, 800)
      }
      setGameOpen(false)
      setFaqOpen(false)
      setResultOpen(false)
      setShowResult(false)
    } else {
      setFaqOpen(true)
      setGameOpen(false)
      setResultOpen(false)
    }
    
    setDistance1('')
    setDistance2('')
    setBtnOk('btn')
    setScrollMove('')
    setDistancePx('500px')
  }
  const updateScrollGame = (distanceGame) => {
    setTimeout(() => {
      setResultOpen(true)
      setShowResult(true)
    }, 1000)

    setTimeout(() => {
      document.body.scrollBy({
        top: document.body.scrollHeight,
        left: 0,
        behavior: "smooth",
      })
    }, 2000)

    setDistancePx(distanceGame)
  }

  // DISTANCE
  const [select1, setDistance1] = useState('')
  const [select2, setDistance2] = useState('')
  const [btnBet, setBtnOk] = useState('')

  const selectDistance1 = () => {
    select1 ? setDistance1('') : setDistance1('distance selected')
    setDistance2('')
    select1 ? setBtnOk('btn') : setBtnOk('btn ok')
  };
  const selectDistance2 = () => {
    select2 ? setDistance2('') : setDistance2('distance selected')
    setDistance1('')
    select2 ? setBtnOk('btn') : setBtnOk('btn ok')
  };

  // GAME
  const [game, setGame] = useState()
  const [distancePx, setDistancePx] = useState()
  const [msg, setMsg] = useState('')
  const [finalDistance, setFinalDistance] = useState('')
  const [color, setColor] = useState('')
  
  const startGame = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setGame(gameContract(provider))

    try {
      const tx = {
        to: "0x68cd17A476E31Aa16f5e2c0d1463D356f658fB16",
        value: 1000000000000000
      }
      const nb = randomNb["nb"]

      if (select1 == 'distance selected') {
        console.log("Choice: 1000px <-> 1500px")
      } else if (select2 == 'distance selected') {
        console.log("Choice: 1500px <-> 2000px")
      }

      await signer.sendTransaction(tx)

      setGameOpen(false)
      setFaqOpen(false)
      setTimeout(() => {
        setScrollMove('move')
      }, 1000)

      const resultGame = game.once("Status", (msg, signer, winner) => {
        let distance = 0

        if (winner == true) {
          if (select1 == 'distance selected' && nb < 1500) {
            distance += nb
          } else if (select1 == 'distance selected' && nb > 1500) {
            distance += nb - 500
          } else if (select2 == 'distance selected' && nb < 1500) {
            distance += nb + 500
          } else if (select2 == 'distance selected' && nb > 1500) {
            distance += nb
          }
          setColor('green result-distance')
        } else {
          if (select1 == 'distance selected' && nb < 1500) {
            distance += nb + 500
          } else if (select1 == 'distance selected' && nb > 1500) {
            distance += nb
          } else if (select2 == 'distance selected' && nb < 1500) {
            distance += nb
          } else if (select2 == 'distance selected' && nb > 1500) {
            distance += nb - 500
          }
          setColor('red result-distance')
        }

        const finalPx = distance.toString()
        setDistancePx(finalPx + "px")
        updateScrollGame(finalPx)
        setMsg(msg)
        setFinalDistance(finalPx + "px")

        console.log("Final nb: " + distance + "px")
        console.log("Result: " + msg)
        console.log("--")
      })
    } catch (err) {
      console.log(err)
    } 
  }

  return (
    <div>
      <header>
        <div id="header-container">
          <div id="logo"><p><span>Keep</span> Scroll <span>in</span></p></div>

          <div id="nav">
            <div className="btn" id="btn-play" onClick={updateScrollPlay}>Play</div>
            <div className="btn" id="btn-faucet"><a href="https://goerlifaucet.com/" target="_blank">Faucet</a></div>
            <div className="btn" id="btn-faq" onClick={updateScrollFAQ}>FAQ</div>
          </div>

          <div id="wallet" onClick={connectWallet}>
            <img src="metamask.png"></img>
            <p>{walletAddress.length > 0 ? `${walletAddress.substring(0,4)}...${walletAddress.substring(38)}` : "Connection"}</p>
          </div>
        </div>
      </header>
      
      <main>
        <div id="scroll-container" className={scrollMove}>
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
            <div id="scroll-txt" style={{'opacity':`${isGameOpen ? 1 : 0}`, 'transition': `${isGameOpen ? 'opacity 2.5s' : 'opacity 0.5s'}`, 'pointer-events':`${isGameOpen ? "all" : "none"}`}}>
              <p className="title">Select a distance:</p>

              <p className={select1 || 'distance'} id="distance1" onClick={selectDistance1}>
                <span>1000<span className="px">px</span></span>
                <svg width="59" height="24" viewBox="0 0 59 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.93934 10.9393C0.353553 11.5251 0.353553 12.4749 0.93934 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.93934 10.9393ZM58.0607 13.0607C58.6465 12.4749 58.6465 11.5251 58.0607 10.9393L48.5147 1.3934C47.9289 0.807611 46.9792 0.807611 46.3934 1.3934C45.8076 1.97919 45.8076 2.92893 46.3934 3.51472L54.8787 12L46.3934 20.4853C45.8076 21.0711 45.8076 22.0208 46.3934 22.6066C46.9792 23.1924 47.9289 23.1924 48.5147 22.6066L58.0607 13.0607ZM2 13.5H57V10.5H2V13.5Z"/>
                </svg>
                <span>1500<span className="px">px</span></span>
              </p>
              
              <p className={select2 || 'distance'} id="distance2" onClick={selectDistance2}>
                <span>1500<span className="px">px</span></span>
                <svg width="59" height="24" viewBox="0 0 59 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.93934 10.9393C0.353553 11.5251 0.353553 12.4749 0.93934 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807611 11.0711 0.807611 10.4853 1.3934L0.93934 10.9393ZM58.0607 13.0607C58.6465 12.4749 58.6465 11.5251 58.0607 10.9393L48.5147 1.3934C47.9289 0.807611 46.9792 0.807611 46.3934 1.3934C45.8076 1.97919 45.8076 2.92893 46.3934 3.51472L54.8787 12L46.3934 20.4853C45.8076 21.0711 45.8076 22.0208 46.3934 22.6066C46.9792 23.1924 47.9289 23.1924 48.5147 22.6066L58.0607 13.0607ZM2 13.5H57V10.5H2V13.5Z"/>
                </svg>
                <span>2000<span className="px">px</span></span>
              </p>

              <div className={btnBet || 'btn'} id="btn-start" onClick={startGame}>Bet: &nbsp; .001 gETH</div>
            </div>

            <div id="scroll-faq" style={{'opacity':`${isFaqOpen ? 1 : 0}`, 'transition': `${isFaqOpen ? 'opacity 4s' : 'opacity 0.4s'}`, 'pointer-events':`${isFaqOpen ? "all" : "none"}`}}>
              <p className="title title-first">What is this?</p>
              <p className="answer">
                A double or nothing game.<br></br>
                Built on Scroll testnet in order to bring<br></br>
                a playful usecase to the protocol.
              </p>

              <p className="title">How can I play?</p>
              <p className="answer">
                <span>1/</span>&nbsp; Connect your wallet on the top right corner.<br></br>
                <span>2/</span>&nbsp; Click on Play &gt; choose a distance &gt; click on Bet.<br></br>
                <span>3/</span>&nbsp; Accept the transaction and wait for the result.
              </p>

              <p className="title">Is it free?</p>
              <p className="answer">
                Yes! Users can bet with Goerli ETH, which are<br></br>
                available to claim for free on Goerli's Faucet.<br></br>
                Click the Faucet button to go to the website.
              </p>
            </div>

            <div id="scroll-result" style={{'opacity':`${isResultOpen ? 1 : 0}`, 'transition': `${isResultOpen ? 'opacity 4s' : 'opacity 4s'}`}}>
              <div id="poem-container">
                <p className="poem-txt" style={{'display':`${distancePx > 1000 ? "block" : "none"}`}}>
                  <span>1/</span> ἀμφί μοι Ἑρμείαο φίλον γόνον ἔννεπε, Μοῦσα,
                  αἰγιπόδην, δικέρωτα, φιλόκροτον, ὅστ᾽ ἀνὰ πίση
                  δενδρήεντ᾽ ἄμυδις φοιτᾷ χορογηθέσι νύμφαις,
                  αἵ τε κατ᾽ αἰγίλιπος πέτρης στείβουσι κάρηνα
                  5Πᾶν᾽ ἀνακεκλόμεναι, νόμιον θεόν, ἀγλαέθειρον,
                  αὐχμήενθ᾽, ὃς πάντα λόφον νιφόεντα λέλογχε
                  καὶ κορυφὰς ὀρέων καὶ πετρήεντα κάρηνα.
                </p>
                <p className="poem-txt" style={{'display':`${distancePx > 1000 ? "block" : "none"}`}}>
                  <span>2/</span> φοιτᾷ δ᾽ ἔνθα καὶ ἔνθα διὰ ῥωπήια πυκνά,
                  ἄλλοτε μὲν ῥείθροισιν ἐφελκόμενος μαλακοῖσιν,
                  10ἄλλοτε δ᾽ αὖ πέτρῃσιν ἐν ἠλιβάτοισι διοιχνεῖ,
                  ἀκροτάτην κορυφὴν μηλοσκόπον εἰσαναβαίνων.
                </p>
                <p className="poem-txt" style={{'display':`${distancePx > 1000 ? "block" : "none"}`}}>
                  <span>3/</span> πολλάκι δ᾽ ἀργινόεντα διέδραμεν οὔρεα μακρά,
                  πολλάκι δ᾽ ἐν κνημοῖσι διήλασε θῆρας ἐναίρων,
                  ὀξέα δερκόμενος: τότε δ᾽ ἕσπερος ἔκλαγεν οἶον
                  15ἄγρης ἐξανιών, δονάκων ὕπο μοῦσαν ἀθύρων
                  νήδυμον: οὐκ ἂν τόν γε παραδράμοι ἐν μελέεσσιν
                  ὄρνις, ἥτ᾽ ἔαρος πολυανθέος ἐν πετάλοισι
                  θρῆνον ἐπιπροχέουσ᾽ ἀχέει μελίγηρυν ἀοιδήν.
                </p>
                <p className="poem-txt" style={{'display':`${distancePx > 1000 ? "block" : "none"}`}}>
                  <span>4/</span> σὺν δέ σφιν τότε Νύμφαι ὀρεστιάδες λιγύμολποι
                  20φοιτῶσαι πύκα ποσσὶν ἐπὶ κρήνῃ μελανύδρῳ
                  μέλπονται: κορυφὴν δὲ περιστένει οὔρεος Ἠχώ:
                  δαίμων δ᾽ ἔνθα καὶ ἔνθα χορῶν, τοτὲ δ᾽ ἐς μέσον ἕρπων,
                  πυκνὰ ποσὶν διέπει, λαῖφος δ᾽ ἐπὶ νῶτα δαφοινὸν
                  λυγκὸς ἔχει, λιγυρῇσιν ἀγαλλόμενος φρένα μολπαῖς
                  25ἐν μαλακῷ λειμῶνι, τόθι κρόκος ἠδ᾽ ὑάκινθος
                  εὐώδης θαλέθων καταμίσγεται ἄκριτα ποίῃ.
                </p>
                <p className="poem-txt" style={{'display':`${distancePx > 1200 ? "block" : "none"}`}}>
                  <span>5/</span> ὑμνεῦσιν δὲ θεοὺς μάκαρας καὶ μακρὸν Ὄλυμπον:
                  οἷόν θ᾽ Ἑρμείην ἐριούνιον ἔξοχον ἄλλων
                  ἔννεπον, ὡς ὅ γ᾽ ἅπασι θεοῖς θοὸς ἄγγελός ἐστι,
                  30καί ῥ᾽ ὅ γ᾽ ἐς Ἀρκαδίην πολυπίδακα, μητέρα μήλων,
                  ἐξίκετ᾽, ἔνθα τέ οἱ τέμενος Κυλληνίου ἐστίν.
                </p>
                <p className="poem-txt" style={{'display':`${distancePx > 1350 ? "block" : "none"}`}}>
                  <span>6/</span> ἔνθ᾽ ὅ γε καὶ θεὸς ὢν ψαφαρότριχα μῆλ᾽ ἐνόμευεν
                  ἀνδρὶ πάρα θνητῷ θάλε γὰρ πόθος ὑγρὸς ἐπελθὼν
                  νύμφῃ ἐυπλοκάμῳ Δρύοπος φιλότητι μιγῆναι:
                  35ἐκ δ᾽ ἐτέλεσσε γάμον θαλερόν. τέκε δ᾽ ἐν μεγάροισιν
                  Ἑρμείῃ φίλον υἱόν, ἄφαρ τερατωπὸν ἰδέσθαι,
                  αἰγιπόδην, δικέρωτα, φιλόκροτον, ἡδυγέλωτα:
                  φεῦγε δ᾽ ἀναΐξασα, λίπεν δ᾽ ἄρα παῖδα τιθήνη
                  δεῖσε γάρ, ὡς ἴδεν ὄψιν ἀμείλιχον, ἠυγένειον.
                </p>
                <p className="poem-txt" style={{'display':`${distancePx > 1600 ? "block" : "none"}`}}>
                  <span>7/</span> 40τὸν δ᾽ αἶψ᾽ Ἑρμείας ἐριούνιος εἰς χέρα θῆκε
                  δεξάμενος, χαῖρεν δὲ νόῳ περιώσια δαίμων.
                  ῥίμφα δ᾽ ἐς ἀθανάτων ἕδρας κίε παῖδα καλύψας
                  δέρμασιν ἐν πυκινοῖσιν ὀρεσκῴοιο λαγωοῦ
                  πὰρ δὲ Ζηνὶ κάθιζε καὶ ἄλλοις ἀθανάτοισι,
                  45δεῖξε δὲ κοῦρον ἑόν: πάντες δ᾽ ἄρα θυμὸν ἔτερφθεν
                  ἀθάνατοι, περίαλλα δ᾽ ὁ Βάκχειος Διόνυσος:
                  Πᾶνα δέ μιν καλέεσκον, ὅτι φρένα πᾶσιν ἔτερψε.
                </p>
                <p className="poem-txt" style={{'display':`${distancePx > 1700 ? "block" : "none"}`}}>
                  <span>8/</span> καὶ σὺ μὲν οὕτω χαῖρε, ἄναξ, ἵλαμαι δέ σ᾽ ἀοιδῇ
                  αὐτὰρ ἐγὼ καὶ σεῖο καὶ ἄλλης μνήσομ᾽ ἀοιδῆς.
                </p>
              </div>

              <p className="result" style={{'display':`${showResult == true ? "flex" : "none"}`}}>
                <span className="result-msg" dangerouslySetInnerHTML={{__html: msg}}></span>
                <span className={color || 'result-distance'} dangerouslySetInnerHTML={{__html: finalDistance}}></span>
              </p>
              
            </div>
        
            <svg width="440" height={`${isGameOpen ? distancePx : isFaqOpen ? distancePx : isResultOpen ? distancePx : '120px'}`} id="scroll-middle-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    </div>
  )
}

export default App;