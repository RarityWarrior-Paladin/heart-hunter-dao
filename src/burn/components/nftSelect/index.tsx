import { useMemo, useState } from 'react'
import Button from '../button'
import './index.css'


function NftSelect(props: { nftIds: Array<number> }) {
  const {nftIds} = props

  const [selectedNftIds, setSelectNftIds] = useState<Array<number>>([])

  const selectId = id => setSelectNftIds(ids => [...ids, id])

  const unselectId = id => setSelectNftIds(ids => ids.filter(i => i !== id))

  const unselectedNftIfs = useMemo(() => nftIds.filter(id => !selectedNftIds.includes(id)), [selectedNftIds])

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
      <Button size="XS" outlined>取消</Button>
      <Button size="XS">燃烧</Button>
    </div>
  </div>
  
}

export default NftSelect