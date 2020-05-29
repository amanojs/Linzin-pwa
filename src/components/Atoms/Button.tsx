import * as React from 'react'

interface OwnProps {
  color: string
  backcolor: string
  value: string
}

export const Button: React.FC<OwnProps> = (props) => {
  const ButtonStyle = {
    color: props.color,
    backgroundColor: props.backcolor,
    padding: '8px',
    borderRadius: '5px',
    border: '0px',
    outline: 0,
    cursor: 'pointer'
  }
  return <input type="button" style={ButtonStyle} value={props.value} />
}
