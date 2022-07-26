import {Web3Context} from "../../../share/context/web3-context";
import NftSelect from "../../components/nftSelect";
import "./index.css";

function Home() {

  return (
    <div className="home-container">
      <NftSelect nftIds={[1,2,3]} />
    </div>
  )
}

export default Home
