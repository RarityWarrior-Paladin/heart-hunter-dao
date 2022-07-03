import {useContext, useEffect, useMemo, useState} from "react";
import Button from "../../components/button";
import NumberInput from "../../components/number-input";
import {Web3Context} from "../../context/web3-context";
import "./index.css";
import useAllowlist from "./useAllowlist";
import albumImages from "../../utils/albumImages";
import AlbumSlider from "../../components/albumSlider";
import Timer from "../../components/timer";

function Home() {
  const { account, chainId, nft, connect, switchNetwork} = useContext(Web3Context)
  const {isAllowlist, proof} = useAllowlist();
  const [loading , setLoading] = useState<boolean>()
  const [maxSupply , setMaxSupply] = useState<number>()
  const [totalSupply , setTotalSupply] = useState<number>()
  const [status , setStatus] = useState<number>()
  const [minted , setMinted] = useState<number | null>(null)
  const [claimStatus , setClaim] = useState<string | null>(null)
  const [pendingTX , setPendingTX] = useState<string | null>(null)
  const [amount , setAmount] = useState<number>(1)


  const correct = chainId === 1

  const max = status === 1 ? 2-minted : 50-minted

  const load = async (address?: string | null) => {
    setLoading(true)
    try {
      const max = (await nft.maxSupply()).toNumber();
      const stage = await nft.status();
      setStatus(stage)
      setTotalSupply(Math.min((await nft.totalSupply()).toNumber(), max))
      setMaxSupply(max)
      if(account){
        const toNumber = (await nft.numberMinted(address)).toNumber();
        setMinted(toNumber)
        setAmount(
          stage === 1 ? Math.max(amount, 2 - toNumber) : Math.min(amount, 50 - toNumber)
        )
      }
    }catch (e){
      console.log(e);
    }
    setLoading(false)
  }

  useEffect(() => {
    load(account)
  },[account, chainId])

  const label = useMemo(() => {
    if(amount <= 1 && totalSupply< 2500 && minted ===0 ) {
      return 'FREE MINT'
    } else {
      return 'PUBLIC MINT'
    }
  }, [amount, maxSupply, minted])

  const cost = useMemo(() => {
    if(amount <= 1 && totalSupply< 2500 && minted ===0) {
      return 0
    } else {
      return (amount) * 0.0069
    }
  }, [amount, maxSupply, minted])

  const handleClick = async () => {
    if(account) {
      if(claimStatus === 'loading') {
        return false
      }
      const tx = await nft.mint(amount, {
        value: '' + cost * 10**18,
      })
      setClaim('loading')
      setPendingTX(tx.hash)
      try {
        const recept = await tx.wait()
        setClaim('success')
      }catch (e) {
        console.log(e);
        setClaim('fail')
      }
      load(account)
    }else {
      connect()
    }
  }

  const handleAllowlistMint = async () => {
    if(account) {
      if(claimStatus === 'loading') {
        return false
      }
      const tx = await nft.allowlistMint(proof, amount)
      setClaim('loading')
      try {
        const recept = await tx.wait()
        setClaim('success')
      }catch (e) {
        console.log(e);
        setClaim('fail')
      }
      load(account)
    }else {
      connect()
    }
  }

  return (
    <div className="home-container">
      <h3>LOVE LOVES TO LOVE LOVE</h3>
      <h4>No roadmap , Only surprises</h4>
      <p className="home-desc"> Love loves to love love, The meaning of love is to keep on loving. We love NFT, we love, so NFT appeared. [Love loves] is part of HeartHunter, Created by artist FFAN. Everyone is a container that can be filled with desire, money, and, of course, love.</p>

      <div className="home">
        <div className="home-demo">
          <AlbumSlider images={albumImages} />
        </div>
        <div className="home-content">
          {loading && <div className="loading">LOADING...</div>}
          {
            (!loading) && <>
              {status === 0 && <div className="home-title">Not started</div>}
              {status === 1 && <div className="home-title">Whitelist sale</div>}
              {status === 2 && <div className="home-title">Public sale</div>}
              {
                maxSupply && status >0 && <div className="f-dinpro home-amount">{totalSupply} / {maxSupply}</div>
              }
              {
                status == 0 && <div>
                  <Timer startTime={1656691200000} onFinish={() => load(account)} />
                </div>
              }
              {
                status == 1 && <div>
                  <Timer startTime={1656763200000} onFinish={() => load(account)} />
                </div>
              }
              {
                status > 0 && <NumberInput value={amount} onChange={setAmount} min={1} max={max}/>
              }
              <ul className="home-rules">
                <li>Whitelist sale (<span className="f-dinpro"> 1500 </span>free mint 2/wallet) <span className="f-dinpro">July 2, 00:00 (UTC+8)</span></li>
                <li>Public sale (<span className="f-dinpro"> 1000 </span> free mint 1/wallet + <span className="f-dinpro">2555</span> / <span className="f-dinpro">0.0069</span>eth) at <span className="f-dinpro">July 2 , 20:00（UTC+8）</span></li>
              </ul>
              {
                !account && <Button className="home-button" onClick={connect}>
                  CONNECT
                </Button>
              }
              {
                chainId && chainId !== 1 && <Button className="home-button" onClick={switchNetwork}>
                  SWITCH NETWORK
                </Button>
              }
              {
                account && <>
                  {status == 0 && <Button className="home-button" disabled>
                    NOT STARTED
                  </Button>}
                  {status == 1 && isAllowlist && <Button className="home-button" onClick={handleAllowlistMint} disabled={minted>0 || amount<=0}>{
                    claimStatus === 'loading' ? 'minting...' : minted >= 2 ? 'MINTED' : 'WHITELIST MINT'
                  }</Button>}
                  {status == 1 && !isAllowlist && <Button className="home-button" disabled={true}>
                    NOT WHITELISTED
                  </Button>}
                  {
                    status == 2 && max > 0 && <Button className="home-button" onClick={handleClick}>{
                      claimStatus === 'loading' ? 'minting...' : label
                    }{
                      !!cost && <span className="home-button-cost">{cost.toFixed(4)} ETH</span>
                    }</Button>
                  }
                  {
                    status == 2 && max <= 0 && <Button className="home-button" disabled>MINTED</Button>
                  }
                  { status == 3 && <Button className="home-button" disabled={!!minted}>
                    COMPLETED
                  </Button>}
                </>
              }
            </>
          }
          {claimStatus === 'success' && <div className="tips tips-success">
            mint success
          </div>}
          {claimStatus === 'loading' && <div className="tips tips-success">
            minting... {pendingTX && <a href={`https://etherscan.io/tx/${pendingTX}`} target="_blank">view tx</a>}
          </div>}
          {claimStatus === 'fail' && <div className="tips tips-fail">
            mint fail
          </div>}
        </div>
      </div>
    </div>
  )
}

export default Home
