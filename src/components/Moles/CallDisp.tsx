import * as React from 'react'
import { Video } from '../Atoms/Video'

interface OwnProps {
  own_videosrc: MediaStream | null
  partner_videosrc: MediaStream | null
}

export const CallDisp: React.FC<OwnProps> = (props) => {
  const ownRef = React.useRef({} as HTMLVideoElement)
  const partnerRef = React.useRef({} as HTMLVideoElement)
  React.useEffect(() => {
    //own_video.current.srcObject = null
    //partner_video.current.srcObject = null
  })
  ownRef.current.srcObject = props.own_videosrc
  partnerRef.current.srcObject = props.partner_videosrc
  return (
    <div>
      <Video ref={ownRef} mute={false} />
      <Video ref={partnerRef} mute={false} />
    </div>
  )
}
