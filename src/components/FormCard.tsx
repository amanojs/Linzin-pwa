import * as React from 'react'

export const FormCard: React.FC = (props) => {
  return (
    <React.Fragment>
      <div className="form">{props.children}</div>
      <style jsx>{`
        .form {
          width: 100%;
          box-sizing: border-box;
          padding: 40px;
          margin-bottom: 20px;
          background-color: #fff;
          border-radius: 2px 2px 2px 2px;
        }
      `}</style>
    </React.Fragment>
  )
}
