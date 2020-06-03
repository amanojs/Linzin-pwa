import * as React from 'react'
import { TellWord } from '../Atoms/TellWord'

interface OwnProps {
  children: string
  thema: string
  color: string
  isPartner: boolean
  bgc: string
  callMethod(): void
}

export const TopLayout: React.FC<OwnProps> = (props) => {
  return (
    <React.Fragment>
      <div className="Flex">
        <div className="TopLayout">
          <TellWord color={props.color} thema={props.thema}>
            {props.children}
          </TellWord>
          <div className="Logo"></div>
          <div className="Ui">
            <button className="CallBtn" onClick={() => props.callMethod()}>
              {props.isPartner ? '通話を募集する' : 'いますぐ話す'}
            </button>
            <p>▲クリックでビデオ通話{props.isPartner ? '募集' : '開始'}</p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .TopLayout {
          width: 1300px;
        }
        .Flex {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          background-color: ${props.bgc};
        }
        .Logo {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 330px;
          height: 230px;
          margin: 40px auto 0 auto;
          background-color: ;
          background-image: url(/handshake.png);
          background-position: center;
          background-size: cover;
          border-radius: 5px;
          color: #444;
          font-weight: bold;
        }
        .Ui {
          width: 520px;
          margin: 0 auto;
          padding: 60px 0 0 0;
        }
        .CallBtn {
          width: 100%;
          padding: 30px;
          color: ${props.bgc};
          font-size: 20px;
          font-weight: bold;
          border: 0 solid #fff;
          background-color: ${props.color};
          border-radius: 60px;
          cursor: pointer;
          outline: 0;
        }
        .Ui p {
          text-align: center;
          color: ${props.color};
          font-weight: bold;
          letter-spacing: 1px;
        }
        @media screen and (max-width: 480px) {
          .TopLayout {
            width: 350px;
          }
          .Ui {
            width: 350px;
            margin: 0 auto;
            padding: 60px 0 0 0;
          }
          .CallBtn {
            padding: 20px;
          }
          .Ui p {
            letter-spacing: 0px;
          }
        }
      `}</style>
    </React.Fragment>
  )
}
