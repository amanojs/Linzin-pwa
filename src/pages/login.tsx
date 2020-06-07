import * as React from 'react'
import next, { NextPage } from 'next'
import Link from 'next/link'
import { InputText } from '../components/Atoms/InputText'
import { FormCard } from '../components/FormCard'
import { FormBody } from '../components/FormBody'

const LoginPage: NextPage = () => {
  return (
    <React.Fragment>
      <FormBody>
        <div>
          <div className="logo"></div>
          <h2 className="app_name">リンジン公式パートナー</h2>
        </div>
        <FormCard>
          <InputText label="メールアドレス" />
          <InputText label="パスワード" />
          <button className="button">ログイン</button>
        </FormCard>
        <button className="button outline">パスワードをお忘れの方はこちら</button>
        <Link href={{ pathname: '/register' }}>
          <button className="button outline">公式パートナー登録</button>
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
