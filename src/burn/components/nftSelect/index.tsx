import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Web3Context } from '../../../share/context/web3-context'
import Button from '../button'
import './index.css'


function NftSelect() {
  const {account, nft} = useContext(Web3Context)

  const [loading, setLoading] = useState<boolean>(true)
  const [nftIds, setNftIds] = useState<Array<number>>([])

  useEffect(() => {
    console.log(account)
    if (!account) return
    nft.tokensOfOwner(account).then(ids => {
      console.log(ids)
      setNftIds(ids.map(id => id.toNumber()))
      setLoading(false)
    })
  }, [account])

  const [selectedNftIds, setSelectNftIds] = useState<Array<number>>([])

  const selectId = id => setSelectNftIds(ids => [...ids, id])

  const unselectId = id => setSelectNftIds(ids => ids.filter(i => i !== id))

  const unselectedNftIfs = useMemo(() => nftIds.filter(id => !selectedNftIds.includes(id)), [nftIds, selectedNftIds])

  const cancel = () => setSelectNftIds([])
  
  const burn = useCallback(
    () => {
      alert(`${account} burn ${selectedNftIds.join(",")}`)
    },
    [account, selectedNftIds])

  return <div className='nft-select-box'>
    <div className='id-selection'>
      <div className='unselected'>
        {unselectedNftIfs.map(id => <span className='unselectedItem' key={id} onClick={() => selectId(id)}>#{id}</span>)}
      </div>
      <div className='selected'>
        {selectedNftIds.map(id => <span className='selectedItem' key={id}>#{id}<i onClick={() => unselectId(id)} className='deleteSelectedItem'/></span>)}
      </div>
    </div>
    <div className="select-actions">
      <Button size="XS" outlined onClick={cancel}>取消</Button>
      <Button size="XS" onClick={burn}>燃烧</Button>
    </div>
  </div>
  
}

export default NftSelect