import * as React from 'react'
import next, { NextPage } from 'next'
import axios from 'axios'
import { ApiEp } from '../../globalvar'
import Link from 'next/link'
import { InputText } from '../../components/Atoms/InputText'
import { AwaitingList } from '../../components/AwaitingList'

const AuthAwaiting: NextPage = () => {
  const [id, setId] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [listflag, setListflag] = React.useState(false)

  const loginAdmin = async () => {
    const result = await axios.post(ApiEp + 'admin', { id: id, pass: pass })
    if (result) {
      setListflag(true)
    }
    return
  }

  return (
    <React.Fragment>
      <div className="form">
        <InputText label="ID" value={id} changeEvent={setId} type="password"></InputText>
        <InputText label="Password" value={pass} changeEvent={setPass} type="password"></InputText>
        <button>操作開始</button>
      </div>
      {listflag && <AwaitingList />}
      <style jsx>{`
        .form {
          width: 300px;
        }
      `}</style>
    </React.Fragment>
  )
}

export default AuthAwaiting
