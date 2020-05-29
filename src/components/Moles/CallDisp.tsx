import * as React from 'react'
import { Video } from '../Atoms/Video'
import * as PeerType from 'skyway-js/skyway-js'

interface OwnProps {
  own_videosrc: MediaStream | null
  partner_videosrc: MediaStream | null
  Partner_mc: PeerType.MediaConnection | null
}

export const CallDisp: React.FC<OwnProps> = (props) => {
  const ownRef = React.useRef({} as HTMLVideoElement)
  const partnerRef = React.useRef({} as HTMLVideoElement)
  const [windowmode, changeMode] = React.useState(false)
  React.useEffect(() => {
    //own_video.current.srcObject = null
    //partner_video.current.srcObject = null
  })
  ownRef.current.srcObject = props.own_videosrc
  partnerRef.current.srcObject = props.partner_videosrc

  /* 通話切断処理 */
  const hangUp = () => {
    if (props.Partner_mc) props.Partner_mc.close(true)
    alert('通話を終了しました')
  }

  return (
    <React.Fragment>
      <div className="CallDisp" style={{ position: 'absolute' }}>
        {windowmode && <Video ref={ownRef} mute={false} />}
        <Video ref={partnerRef} mute={false} />
        <div className="UIboard">
          <div className="CloseBtn" onClick={() => hangUp()}>
            ✖
          </div>
        </div>
      </div>
      <style jsx>{`
        .CallDisp {
          position: absolute;
          bottom: 0;
          right: 0;
          border-radius: 10px;
          background-color: #222;
        }
        .UIboard {
          display: flex;
          justify-content: center;
          width: 100%;
          position: absolute;
          bottom: 10px;
        }
        .CloseBtn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          color: #fff;
          background-color: #e74c3c;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.5s;
        }
        .CloseBtn:hover {
          background-color: #c0392b;
        }
      `}</style>
    </React.Fragment>
  )
}
