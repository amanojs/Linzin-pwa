import * as React from 'react'
import next, { NextPage, NextPageContext } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { InputText } from '../components/Atoms/InputText'
import { FormCard } from '../components/FormCard'
import { FormBody } from '../components/FormBody'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'universal-cookie'
import { ApiEp } from '../globalvar'

const LoginPage: NextPage = () => {
  const [email, setEmail] = React.useState<string>('')
  const [pass, setPass] = React.useState<string>('')
  const [errmsg, setErrmsg] = React.useState<string>('')
  const [proc, setProc] = React.useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login()
  }

  const login = async () => {
    if (proc) return
    setProc(true)
    const result = await axios.post(ApiEp + 'login', { email: email, pass: pass })
    if (result.data) {
      const key = result.data
      const cookies = new Cookies()
      cookies.set('linzinRSA', key)
      location.href = '/partners'
      return
    }
    setErrmsg('メールアドレス、またはパスワードに誤りがあります')
    setProc(false)
    return
  }

  return (
    <React.Fragment>
      <Head>
        <title>リンジン -ログイン-</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
        />
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </Head>
      <FormBody>
        <div>
          <div className="logo"></div>
          <h2 className="app_name">リンジン公式パートナー</h2>
        </div>
        <FormCard>
          <form onSubmit={(e) => handleSubmit(e)}>
            {errmsg && <div className="error_msg">{errmsg}</div>}
            <InputText label="メールアドレス" value={email} changeEvent={setEmail} />
            <InputText label="パスワード" value={pass} type="password" changeEvent={setPass} />
            <button
              className="button"
              type="submit"
              style={{ backgroundColor: proc ? '#eee' : '#22a6b3' }}
              disabled={proc}
            >
              ログイン
            </button>
          </form>
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

import { partnerCheck } from '../globalvar'
LoginPage.getInitialProps = async (context: NextPageContext) => {
  if (context.req && context.res) {
    const result: AxiosResponse | false = await partnerCheck(context.req)
    if (result) {
      context.res.writeHead(302, { Location: '/partners' })
      context.res.end()
    }
  }
  return {}
}

export default LoginPage
