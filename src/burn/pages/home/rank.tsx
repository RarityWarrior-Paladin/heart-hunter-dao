import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Web3Context } from '../../../share/context/web3-context'
import './index.css'


function RankList(props: {
}) {
  const {account, nft, auction} = useContext(Web3Context)


  return (
      <div className="ranklist">
        <h3>Burning Rank（1-50）：</h3>
        <div className="ranklist-content"></div>
      </div>
  )
  
}

export default RankList