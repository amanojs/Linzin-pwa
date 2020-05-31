import * as React from 'react'

interface OwnProps {
  children: string
  thema: string
  color: string
}

export const TellWord: React.FC<OwnProps> = (props) => {
  return (
    <React.Fragment>
      <div className="TellWord">
        <h1 className="MainWord">{props.children}</h1>
        <h2 className="ThemaWord">{props.thema}</h2>
      </div>
      <style jsx>{`
        .TellWord {
          width: 800px;
          margin: 0 auto;
        }
        .MainWord {
          width: 800px;
          margin: 0 auto 10px auto;
          overflow: hidden;
          text-align: center;
          font-size: 50px;
          font-weight: bold;
          color: ${props.color};
          letter-spacing: 5px;
        }
        .ThemaWord {
          width: 600px;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          font-size: 25px;
          color: ${props.color};
          letter-spacing: 2px;
        }
      `}</style>
    </React.Fragment>
  )
}
