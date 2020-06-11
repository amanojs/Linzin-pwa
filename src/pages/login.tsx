import * as React from 'react'
import next, { NextPage } from 'next'
import Link from 'next/link'
import { InputText } from '../components/Atoms/InputText'
import { FormCard } from '../components/FormCard'
import { FormBody } from '../components/FormBody'
import { ApiEp } from '../globalvar'
import axios from 'axios'

const LoginPage: NextPage = () => {
  const [email, setEmail] = React.useState<string>('')
  const [pass, setPass] = React.useState<string>('')
  const [errmsg, setErrmsg] = React.useState<string>('')
  const [proc, setProc] = React.useState<boolean>(false)

  const login = async () => {
    if (proc) return
    setProc(true)
    const result = await axios.post(ApiEp + 'login', { email: email, pass: pass })
    if (result.data) {
      const key = result.data
      alert('ログイン成功')
      return
    }
    setErrmsg('メールアドレス、またはパスワードに誤りがあります')
    setProc(false)
  }

  return (
    <React.Fragment>
      <FormBody>
        <div>
          <div className="logo"></div>
          <h2 className="app_name">リンジン公式パートナー</h2>
        </div>
        <FormCard>
          {errmsg && <div className="error_msg">{errmsg}</div>}
          <InputText label="メールアドレス" value={email} changeEvent={setEmail} />
          <InputText label="パスワード" value={pass} changeEvent={setPass} />
          <button
            className="button"
            onClick={() => login()}
            style={{ backgroundColor: proc ? '#eee' : '#22a6b3' }}
            disabled={proc}
          >
            ログイン
          </button>
        </FormCard>
        <button className="button outline">パスワードをお忘れの方はこちら</button>
        <Link href={{ pathname: '/register' }}>
          <button className="button outline">公式パートナーエントリー</button>
        </Link>
      </FormBody>
      <style jsx global>{`
        body {
          padding: 0;
          margin: 0;
          font-family: 'Hiragino Kaku Gothic ProN', 'メイリオ', sans-serif;
        }
      `}</style>
      <style jsx>{`
        .app_name {
          margin: 0 0 10px 0;
          text-align: center;
          color: #fff;
          font-weight: bold;
          font-size: 32px;
        }
        .error_msg {
          margin-bottom: 10px;
          color: #d63031;
          font-size: 12px;
        }
        .button {
          width: 100px;
          padding: 9px;
          color: #fff;
          font-size: 9px;
          font-weight: bold;
          border: 0px solid #000;
          border-radius: 2px;
          background-color: #22a6b3;
          cursor: pointer;
          outline: none;
        }
        .outline {
          width: 100%;
          margin: 0 0 10px 0;
          padding: 10px;
          font-size: 13px;
          letter-spacing: 1.5px;
          border-radius: 5px;
          border: 1.2px solid #fff;
          background-color: rgba(0, 0, 0, 0);
        }
        @media screen and (max-width: 480px) {
          .app_name {
            margin: 0 0 10px 0;
            text-align: center;
            color: #fff;
            font-weight: bold;
            font-size: 29px;
          }
          .button {
            width: 100%;
          }
        }
      `}</style>
    </React.Fragment>
  )
}

export default LoginPage
