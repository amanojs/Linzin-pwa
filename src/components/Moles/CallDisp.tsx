import * as React from 'react'
import { Video } from '../Atoms/Video'

interface OwnProps {}

export const CallDisp: React.FC<OwnProps> = (props) => {
  const own_video = React.useRef({} as HTMLVideoElement)
  const partner_video = React.useRef({} as HTMLVideoElement)
  return (
    <div>
      <Video ref={own_video} mute={false} />
      <Video ref={partner_video} mute={false} />
    </div>
  )
}
