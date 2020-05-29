import * as React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../rootReducer'
import store from '../../store'

interface OwnProps {
  mute: boolean
}

export const Video = React.forwardRef((props: OwnProps, ref: React.LegacyRef<HTMLVideoElement>) => {
  const { tasks } = useSelector((state: RootState) => state.tasks)
  console.log(tasks)
  return (
    <div>
      <video ref={ref} width="400px" autoPlay muted={props.mute} playsInline />
    </div>
  )
})
