import * as React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../rootReducer'
import store from '../../store'

interface OwnProps {
  mute: boolean
  mode: boolean
  width: string
  height: string
}

export const Video = React.forwardRef((props: OwnProps, ref: React.LegacyRef<HTMLVideoElement>) => {
  const { tasks } = useSelector((state: RootState) => state.tasks)
  console.log(tasks)
  return (
    <React.Fragment>
      <div>
        <video ref={ref} width={props.width} height={props.height} autoPlay muted={props.mute} playsInline className="Video" />
      </div>
      <style jsx>{`
        .Video {
          verticalalign: 'bottom';
          display: 'block';
          border-radius: ${props.mode ? '5px' : '0px'};
        }
        *::-webkit-media-controls-panel {
          display: none !important;
          -webkit-appearance: none;
        }
        *::--webkit-media-controls-play-button {
          display: none !important;
          -webkit-appearance: none;
        }
        *::-webkit-media-controls-start-playback-button {
          display: none !important;
          -webkit-appearance: none;
        }
      `}</style>
    </React.Fragment>
  )
})
