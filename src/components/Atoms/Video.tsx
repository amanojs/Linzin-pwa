import * as React from 'react'

interface OwnProps {
  mute: boolean
}

export const Video = React.forwardRef(
  (props: OwnProps, ref: React.LegacyRef<HTMLVideoElement>) => {
    return (
      <video ref={ref} width="400px" autoPlay muted={props.mute} playsInline />
    )
  }
)
