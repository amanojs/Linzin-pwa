import * as React from 'react'
import next, { NextPage } from 'next'
import { FormBody } from '../components/FormBody'
import { FormCard } from '../components/FormCard'
import { InputText } from '../components/Atoms/InputText'
import Link from 'next/link'
import { url } from 'inspector'

const RegisterPage: NextPage = () => {
  const [img_file, setImg] = React.useState<string | ArrayBuffer | null>()
  const file_types = ['image/jpeg', 'image/png', 'image/gif']
  const file_preview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (file_types.indexOf(e.target.files[0].type) + 1) {
        const reader: FileReader = new FileReader()
        const file: File = e.target.files[0]
        reader.onload = (e) => setImg(reader.result)
        reader.readAsDataURL(file)
        return
      }
    }
    alert('適切なファイルをアップロードしてください')
  }
  return (
    <React.Fragment>
      <FormBody>
        <h2 className="page_name">リンジン公式パートナー登録</h2>
        <FormCard>
          <InputText label="メールアドレス" />
          <InputText label="パスワード" />
          <InputText label="パスワード(再入力)" />
          <label className="idcard_label">身分証明証アップロード</label>
          <div className="preview" style={{ backgroundImage: img_file ? `url(${img_file})` : 'none' }}>
            <label className="file_label">
              <img src="/images/imageicon.png" alt="image icon" />
              <input
                type="file"
                id="file"
                accept={file_types.join()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => file_preview(e)}
              />
            </label>
          </div>
          <button className="button">確認</button>
          <Link href="/login">
            <button className="button cancel">戻る</button>
          </Link>
        </FormCard>
      </FormBody>
      <style jsx global>{`
        body {
          padding: 0;
          margin: 0;
          font-family: 'Hiragino Kaku Gothic ProN', 'メイリオ', sans-serif;
        }
      `}</style>
      <style jsx>{`
        .page_name {
          margin: 0 0 10px 0;
          text-align: center;
          color: #fff;
          font-weight: bold;
          font-size: 28px;
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
        .cancel {
          margin: 0 0 0 5px;
          background-color: #555;
        }
        .preview {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 190px;
          margin: 0 0 10px 0;
          background-color: #efefef;
          background-size: cover;
          background-position: center;
          border: 1.5px solid #ddd;
          border-radius: 2px;
        }
        .idcard_label {
          font-size: 13px;
          color: #555;
          font-weight: bold;
          margin: 0 0 3px 0;
        }
        .file_label {
          display: block;
          width: 20px;
          height: 20px;
          padding: 20px;
          background-color: #fff;
          border-radius: 40px;
          box-shadow: 0 0 3px gray;
          transition: 0.3s;
          cursor: pointer;
        }
        .file_label:hover {
          background-color: #ddd;
          box-shadow: 0 0 1px gray;
        }
        .file_label img {
          width: 100%;
        }
        #file {
          display: none;
        }
        @media screen and (max-width: 480px) {
          .page_name {
            margin: 0 0 10px 0;
            text-align: center;
            color: #fff;
            font-weight: bold;
            font-size: 24px;
          }
          .preview {
            height: 150px;
          }
          .button {
            width: 100%;
            margin: 0;
          }
          .cancel {
            margin: 5px 0 0 0;
          }
        }
      `}</style>
    </React.Fragment>
  )
}
export default RegisterPage
