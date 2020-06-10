import * as React from 'react'

export const FormBody: React.FC = (props) => {
  return (
    <React.Fragment>
      <div className="form_body">
        <div className="login_body">{props.children}</div>
      </div>
      <style jsx>{`
        .form_body {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          min-height: 100vh;
          background: url(/images/care.jpg) no-repeat center;
          background-size: cover;
          position: relative;
          z-index: 0;
          overflow: hidden;
        }
        .form_body:before {
          content: '';
          background: inherit;
          -webkit-filter: blur(10px);
          -moz-filter: blur(10px);
          -o-filter: blur(10px);
          -ms-filter: blur(10px);
          filter: blur(10px);
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          z-index: -1;
        }
        .login_body {
          width: 400px;
        }
        @media screen and (max-width: 480px) {
          @media screen and (max-height: 700px) {
            .form_body {
              box-sizing: border-box;
              padding: 60px 0 0 0;
              align-items: flex-start;
            }
          }
          .login_body {
            width: 330px;
          }
        }
      `}</style>
    </React.Fragment>
  )
}
