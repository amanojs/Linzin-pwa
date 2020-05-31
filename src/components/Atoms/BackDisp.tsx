import * as React from 'react'

interface OwnProps {
  bgc: string
  flex?: boolean
}

export const BackDisp: React.FC<OwnProps> = (props) => {
  return (
    <React.Fragment>
      <div className={'BackDisp' + ' ' + props.flex ? 'Flex' : ''}>{props.children}</div>
      <style jsx>{`
        .BackDisp {
          width: 100%;
          height: 100vh;
          background-color: ${props.bgc};
        }
      `}</style>
    </React.Fragment>
  )
}
