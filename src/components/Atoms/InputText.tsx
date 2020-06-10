import * as React from 'react'

interface OwnProps {
  label: string
  value: string
  error?: boolean
  changeEvent(v: string): void
}

export const InputText: React.FC<OwnProps> = (props) => {
  return (
    <React.Fragment>
      <h2>{props.label}</h2>
      <input
        type="text"
        value={props.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.changeEvent(e.target.value)}
      />
      <style jsx>{`
        h2 {
          font-size: 13px;
          color: #555;
          font-weight: bold;
          margin: 0 0 3px 0;
        }
        input {
          width: 100%;
          padding: 10px;
          margin: 0 0 25px 0;
          box-sizing: border-box;
          background-color: #fafafa;
          border: 2px solid #${props.error ? 'd63031' : 'ddd'};
          border-radius: 3px;
        }
      `}</style>
    </React.Fragment>
  )
}

InputText.defaultProps = {
  error: false
}
