import {useContext, useEffect, useMemo, useState} from "react";
import Button from "../../components/button";
import NumberInput from "../../components/number-input";
import {Web3Context} from "../../context/web3-context";
import "./index.css";
import useAllowlist from "./useAllowlist";
import albumImages from "../../utils/albumImages";
import AlbumSlider from "../../components/albumSlider";

function Home() {
  const { account, chainId, nft, connect, provider} = useContext(Web3Context)
  const {isAllowlist, proof} = useAllowlist();
  const [loading , setLoading] = useState<boolean>()
  const [maxSupply , setMaxSupply] = useState<number>()
  const [totalSupply , setTotalSupply] = useState<number>()
  const [status , setStatus] = useState<number>()
  const [minted , setMinted] = useState<boolean | null>(null)
  const [claimStatus , setClaim] = useState<string | null>(null)
  const [amount , setAmount] = useState<number>(1)

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
        setMinted(toNumber >= 1)
        console.log(stage);
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
    if(amount <= 1 && totalSupply< 2500) {
      return 'FREE MINT'
    } else {
      return 'PUBLIC MINT'
    }
  }, [amount, maxSupply])

  const cost = useMemo(() => {
    if(amount <= 1 && totalSupply< 2500) {
      return 0
    } else {
      return amount * 0.0069
    }
  }, [amount, maxSupply])

  const handleClick = async () => {
    if(account) {
      if(claimStatus === 'loading') {
        return false
      }
      const tx = await nft.mint()
      setClaim('loading')
      try {
        const recept = await tx.wait()
        setClaim('success')
      }catch (e) {
        console.log(e);
        setClaim('fail')
      }
      load()
    }else {
      connect()
    }
  }

  const handleAllowlistMint = async () => {
    if(account) {
      if(claimStatus === 'loading') {
        return false
      }
      const tx = await nft.whitelistMint(proof, 1)
      setClaim('loading')
      try {
        const recept = await tx.wait()
        setClaim('success')
      }catch (e) {
        console.log(e);
        setClaim('fail')
      }
      load()
    }else {
      connect()
    }
  }

  return (
    <div className="home_container">
      <h3>LOVE LOVES TO LOVE LOVE</h3>
      <h4>No roadmap , Only surprises</h4>

      <div className="home">
        <div className="home-demo">
          <AlbumSlider images={albumImages} />
        </div>
        <div className="home-content">
          {loading && <div className="loading">LOADING...</div>}
          {
            (!loading && !!maxSupply) && <>
              {status === 0 && <div className="home-title">NOT START</div>}
              {status === 1 && <div className="home-title">WHITELIST SALE</div>}
              {status === 2 && <div className="home-title">PUBLIC SALE</div>}

              {
                maxSupply && <div className="home-amount">{totalSupply} / {maxSupply}</div>
              }

              <NumberInput value={amount} onChange={setAmount} min={1} max={status === 1 ? 2 : 5}/>

              <ul className="home-rules">
                <li>Whitelist sale (1000free mint2 / walletat) 22 : 00 UTC + 8</li>
                <li>Public sale (1500 free mint1 / wallet + 2555 / 0 . 0069eth at 24 : 00 UTC + 8</li>
              </ul>
              {
                !account && <Button className="home-button" onClick={connect}>
                  CONNECT
                </Button>
              }
              {
                account && <>
                  {status == 0 && <Button className="home-button" disabled={!!minted}>
                    NOT STARTED
                  </Button>}
                  {status == 1 && isAllowlist && <Button className="home-button" onClick={handleAllowlistMint} disabled={!!minted}>{
                    claimStatus === 'loading' ? 'minting...' : minted ? 'MINTED' : 'WHITELIST MINT'
                  }</Button>}
                  {status == 1 && !isAllowlist && <Button className="home-button" disabled={true}>
                    NOT WHITELISTED
                  </Button>}
                  {
                    status == 2 && <Button className="home-button" onClick={handleClick} disabled={!!minted}>{
                      claimStatus === 'loading' ? 'minting...' : minted ? 'MINTED' : label
                    }{
                      !!cost && <span className="home-button-cost">{cost.toFixed(4)} ETH</span>
                    }</Button>
                  }
                  { status == 3 && <Button className="home-button" disabled={!!minted}>
                    COMPLETED
                  </Button>}
                </>
              }
            </>
          }
          {claimStatus === 'success' && <div className="tips tips-success">
            MINT SUCCESS
          </div>}
          {claimStatus === 'fail' && <div className="tips tips-fail">
            MINT FAIL
          </div>}
        </div>
      </div>
    </div>
  )
}

export default Home
