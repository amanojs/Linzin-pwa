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
          width: 100%;
          margin: 0 auto;
        }
        .MainWord {
          width: 100%;
          margin: 0 auto 10px auto;
          overflow: hidden;
          text-align: center;
          font-size: 50px;
          font-weight: bold;
          color: ${props.color};
          letter-spacing: 5px;
        }
        .ThemaWord {
          width: 100%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          font-size: 25px;
          color: ${props.color};
          letter-spacing: 2px;
        }
        @media screen and (max-width: 480px) {
          .MainWord {
            font-size: 25px;
            letter-spacing: 1px;
          }
          .ThemaWord {
            font-size: 16px;
            font-weight: normal;
            letter-spacing: 1px;
          }
        }
      `}</style>
    </React.Fragment>
  )
}
