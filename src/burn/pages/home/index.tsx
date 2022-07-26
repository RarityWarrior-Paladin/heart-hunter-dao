import {Web3Context} from "../../../share/context/web3-context";
import NftSelect from "../../components/nftSelect";
import ImageGallery from 'react-image-gallery';
import "./index.css";
import Button from "../../components/button";
import {useContext, useState} from "react";
import {config} from "../../config";
import Timer from "../../components/timer";
import image1 from "../../assets/galley/1.jpg";
import image2 from "../../assets/galley/2.png";


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
  const {account, nft} = useContext(Web3Context)

  const [loading , setLoading] = useState<boolean>()
  const [approving , setApproving] = useState<boolean>()
  const [isApprove , setIsApprove] = useState<boolean>()

  const load = async (account: string) => {
    setLoading(true)
    const approve = await nft.isApprovedForAll(account, config.AUCTION)
    setIsApprove(approve)
    setLoading(false)
  }

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
      {/*<NftSelect />*/}
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
          <h1>偷心兔油画</h1>
          <h2>拍卖</h2>
          <h3>Artist:  <strong>FFAN</strong></h3>
          <div>已燃烧数量：{0}</div>
          {isApprove && <Button className="button">选择 Loves NFT</Button>}
          {!isApprove && <Button className="button" onClick={handleApprove}>
            {approving ? 'Approving...' : 'Approve'}
          </Button>}

          <div>Start at: </div>
          <div className="timer"><Timer startTime={1658930400000} onFinish={() => load(account)}/></div>
          <div>Jul 27, 2022 22:00:00 PM</div>
        </div>
      </div>
    </div>
  )
}

export default Home
