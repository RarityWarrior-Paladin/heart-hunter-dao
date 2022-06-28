import {PropsWithChildren, useContext, useEffect, useRef, useState} from 'react'
import classnames from 'classnames'
import './index.css'

type Props = PropsWithChildren<{
 value: number
 className?: string
 onChange?: (value: number) => void
 max?: number
 min?: number
}>

function NumberInput(props: Props) {
  const {className, value, children, onChange, max=5, min = 1} = props
  const [text, setText] = useState<string | number>(value)


  const change = (number: number) => {
    const result = Math.max(min, Math.min(number, max))
    onChange?.(result)
  }

  const handleChange = (e) => {
    const v = e.target.value
    change(v ? parseInt(v) || value : 0)
  }

  const handleMinus = () => {
    change(value - 1)
  }

  const handleAdd = () => {
    change(value + 1)
  }

  useEffect(() => {
    console.log(value);
    setText(value)
  }, [value])

  return (
    <div className={classnames(
      'ui-number-input',
      className)}>
      <div className={classnames('input-minus', {
        'disabled': value<=min
      })} onClick={handleMinus} />
      <input value={text} className="f-dinpro" onChange={(event) => {
        setText(event.target.value)
      }} onBlur={handleChange}/>
      <div className={classnames('input-plus', {
        'disabled': value>=max
      })} onClick={handleAdd} />
    </div>
  )
}

export default NumberInput
