import * as React from 'react'
import { Video } from '../Atoms/Video'
import * as PeerType from 'skyway-js/skyway-js'

interface OwnProps {
  own_videosrc: MediaStream | null
  partner_videosrc: MediaStream | null
  Partner_mc: PeerType.MediaConnection | null
  display: boolean
  setCallPop: React.Dispatch<React.SetStateAction<boolean>>
  partnerMethod?(): void
}

export const CallDisp: React.FC<OwnProps> = (props) => {
  const ownRef = React.useRef({} as HTMLVideoElement)
  const partnerRef = React.useRef({} as HTMLVideoElement)
  const [windowmode, changeMode] = React.useState(false)
  const [isMobile, setMobile] = React.useState(false)

  React.useEffect(() => {
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
      changeMode(true)
      setMobile(true)
    }
    return () => {
      windowmode
    }
  }, [])

  ownRef.current.srcObject = props.own_videosrc
  partnerRef.current.srcObject = props.partner_videosrc

  /* 通話切断処理 */
  const hangUp = () => {
    if (!props.Partner_mc) return
    props.Partner_mc.close(true)
    props.setCallPop(true)
  }

  /* ウィンドウモード変更 */
  const changeWindow = () => {
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/) && windowmode) {
      return alert('現在スマートフォンではサイズの変更ができません')
    }
    changeMode(!windowmode)
  }

  return (
    <React.Fragment>
      <div
        className="CallDisp"
        style={{
          width: windowmode ? '100%' : '400px',
          height: windowmode ? '100vh' : '250px'
        }}
      >
        <div className="OwnVideo">
          <Video
            ref={ownRef}
            mute={true}
            mode={windowmode}
            width={windowmode ? '200px' : '100px'}
            height={windowmode ? '120px' : '60px'}
          />
        </div>
        <Video
          ref={partnerRef}
          mute={false}
          mode={windowmode}
          width={windowmode ? '100%' : '400px'}
          height={windowmode ? '100%' : '250px'}
        />
        <div className="UIboard">
          <div className="WindowMode Btn" onClick={() => changeWindow()}>
            {windowmode ? '⇘' : '⇖'}
          </div>
          <div className="CloseBtn Btn" onClick={() => hangUp()}>
            ✖
          </div>
          <div className="StopHost Btn" onClick={() => (props.partnerMethod ? props.partnerMethod() : null)}>
            👤
          </div>
        </div>
      </div>
      <style jsx>{`
        .CallDisp {
          display: ${props.display ? 'flex' : 'none'};
          justify-content: center;
          align-items: center;
          position: absolute;
          bottom: 0;
          right: 0;
          overflow: hidden;
          border-radius: ${windowmode ? '0px' : '10px'};
          background-color: #222;
          transition: 0.5s;
          z-index: 2;
        }
        .OwnVideo {
          position: absolute;
          top: ${windowmode ? '20px' : '5px'};
          right: ${windowmode ? '20px' : '5px'};
          width: ${windowmode ? '200px' : '100px'};
          height: ${windowmode ? '120px' : '60px'};
          background-color: #333;
          border-radius: 5px;
          transition: 0.2s;
          z-index: 3;
        }
        .UIboard {
          display: flex;
          justify-content: center;
          width: 100%;
          position: absolute;
          bottom: 10px;
          z-index: 4;
        }
        .Btn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          color: #fff;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.5s;
        }
        .CloseBtn {
          margin: 0 10px 0 10px;
          background-color: #e74c3c;
        }
        .CloseBtn:hover {
          background-color: #c0392b;
        }
        .WindowMode {
          background-color: #34495e;
        }
        .StopHost {
          background-color: #34495e;
        }
        .WindowMode:hover {
          background-color: #2c3e50;
        }
        @media screen and (max-width: 480px) {
          .CallDisp {
            width: ${windowmode ? '100%' : '45%'};
            height: ${windowmode ? '100vh' : '120px'};
          }
        }
      `}</style>
    </React.Fragment>
  )
}
