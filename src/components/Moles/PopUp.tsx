import * as React from 'react'
import { TransitionStatus } from 'react-transition-group/Transition'
import { Transition } from 'react-transition-group'

interface Props {
  children: React.ReactNode
  open_flg: boolean
}

export const PopUp: React.FC<Props> = (props) => {
  return (
    <Transition in={props.open_flg} timeout={200}>
      {(state: TransitionStatus) => (
        <React.Fragment>
          <div
            className="PopUp"
            style={{
              transition: '0.2s',
              opacity: state === 'entered' ? 1 : 0,
              display: state === 'exited' ? 'none' : 'block'
            }}
          >
            <div
              className="PopCard"
              style={{
                transition: '0.5s',
                position: 'fixed',
                top: state === 'entered' ? '30%' : '0',
                left: '50%',
                transform: 'translateY(-20%) translateX(-50%)',
                WebkitTransform: 'translateY(-20%) translateX(-50%)',
                margin: 'auto',
                borderRadius: '4px',
                backgroundColor: '#fff',
                zIndex: 6
              }}
            >
              {props.children}
            </div>
            <div className="Carvon"></div>
          </div>
          <style jsx>{`
            .Carvon {
              position: fixed;
              top: 0;
              width: 100vw;
              height: 100vh;
              background-color: rgba(0, 0, 0, 0.7);
              z-index: 5;
            }
            .PopCard {
              width: 430px;
              box-sizing: border-box;
              padding: 40px;
            }
            @media screen and (max-width: 480px) {
              .PopCard {
                width: 300px;
                box-sizing: border-box;
                padding: 40px;
              }
            }
          `}</style>
        </React.Fragment>
      )}
    </Transition>
  )
}
