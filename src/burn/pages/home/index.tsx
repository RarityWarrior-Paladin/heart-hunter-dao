import {Web3Context} from "../../../share/context/web3-context";
import NftSelect from "../../components/nftSelect";
import ImageGallery from 'react-image-gallery';
import "./index.css";
import Button from "../../components/button";
import {useContext, useEffect, useState} from "react";
import {config} from "../../config";
import Timer from "../../components/timer";
import image1 from "../../assets/galley/1.jpg";
import image2 from "../../assets/galley/2.png";
import RankList from "./rank";

const images = [
  {
    original: image1,
    thumbnail: image1,
    originalWidth: 220,
    originalHeight: 220,
    thumbnailHeight: 50,
    thumbnailWidth: 50
  },
  {
    original: image2,
    thumbnail: image2,
    originalWidth: 220,
    originalHeight: 220,
    thumbnailHeight: 50,
    thumbnailWidth: 50
  },
];

function Home() {
  const {account, nft, auction, chainId} = useContext(Web3Context)

  const [loading , setLoading] = useState<boolean>()
  const [visible , setVisible] = useState<boolean>()
  const [approving , setApproving] = useState<boolean>()
  const [isApprove , setIsApprove] = useState<boolean>()

  const load = async (account: string) => {
    setLoading(true)
    const approve = await nft.isApprovedForAll(account, config.AUCTION)
    // const info = await auction.biderInfo(0)
    // console.log('info', info);
    setIsApprove(approve)
    setLoading(false)
  }

  useEffect(() => {
    load(account)
  },[account, chainId])

  const handleApprove = async () => {
    if(approving) {
      return false
    }
    try {
      const tx = await nft.setApprovalForAll(config.AUCTION, true)
      setApproving(true)
      await tx.wait()
      load(account as string);
    } catch (e) {

    }
    setApproving(false)
  }


  return (
    <div>
      <div className="module-top">
        <div className="gallery">
          <ImageGallery
              showFullscreenButton={false}
              showPlayButton={false}
              showNav={false}
              autoPlay={true}
              items={images} />
        </div>
        <div className="top-info">
          <h1>HeartHunter Painting </h1>
          <h2>Love NFTs Auction</h2>
          <h3>Artist:  <strong>FFAN</strong></h3>
          <div>You have burned：{0}</div>
          {isApprove && <Button className="button" onClick={() => {
            setVisible(true)
          }}>Choose NFT</Button>}
          {!isApprove && <Button className="button" disabled={approving} onClick={handleApprove}>
            {approving ? 'Approving...' : 'Approve'}
          </Button>}

          <div>Start at: </div>
          <div className="timer"><Timer startTime={1658930400000} onFinish={() => load(account)}/></div>
          <div>Jul 27, 2022 22:00:00 PM</div>
        </div>
      </div>
      <NftSelect
        visible={visible}
        onSuccess={() => {
          load(account)
          setVisible(false)
          alert('burn success')
        }}
        onCancel={() => {
          setVisible(false)
        }}
      />
      <div className="module-info">
        <h3 className="module-title">Description</h3>
        <div className="info-container">
          <div className="info-desc">
            <p>There will be 50 works to participate in the love auction</p>
            <p>1 oil painting 90×90(cm)</p>
            <p>4 prints 62×62(cm)</p>
            <p>45 prints 30×30 (cm)</p>
            <p>Get physical works based on the addresses ranked 1-50 by the number of Love NFT burns. The works obtained are determined according to the ranking.</p>
            <br />
            <p>Addresses ranked 1-50 will get the priority whitelist of HeartHunter NFT, and you can choose your favorite work NFT in advance</p>
            <br />
            <p>All addresses participating in the burning will participate in a mysterious airdrop (all addresses)</p>
          </div>
          <div className="info-rank">
            <RankList />
          </div>
        </div>
      </div>
      <div className="module-gallery">
        <h3 className="module-title">Art Work</h3>
      </div>
    </div>
  )
}

export default Home
