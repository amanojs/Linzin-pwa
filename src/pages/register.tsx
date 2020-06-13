import * as React from 'react'
import next, { NextPage } from 'next'
import axios from 'axios'
import { storage } from '../plugins/firebase'
import { ApiEp } from '../globalvar'
import Link from 'next/link'
import { FormBody } from '../components/FormBody'
import { FormCard } from '../components/FormCard'
import { InputText } from '../components/Atoms/InputText'
import { PopUp } from '../components/Moles/PopUp'

const RegisterPage: NextPage = () => {
  const [email, setEmail] = React.useState<string>('')
  const [pass, setPass] = React.useState<string>('')
  const [pass_r, setPass_r] = React.useState<string>('')
  const [img_file, setImg] = React.useState<string | ArrayBuffer | null>()
  const [up_file, setUp] = React.useState<Blob | ArrayBuffer | Uint8Array>()
  const [errmsg, setErrmsg] = React.useState<string[]>([])
  const [email_e, setEmail_e] = React.useState<boolean>(false)
  const [pass_e, setPass_e] = React.useState<boolean>(false)
  const [pass_r_e, setPass_r_e] = React.useState<boolean>(false)
  const [upfile_e, setUpfile_e] = React.useState<boolean>(false)
  const [checkpop, setCheckpop] = React.useState<boolean>(false)
  const [donepop, setDonepop] = React.useState<boolean>(false)
  const [register_flag, setResister_flag] = React.useState<boolean>(false)

  const file_types = ['image/jpeg', 'image/png', 'image/gif']

  const file_preview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      if (file_types.indexOf(e.target.files[0].type) + 1) {
        const reader: FileReader = new FileReader()
        const file: Blob = e.target.files[0]
        setUp(e.target.files[0])
        reader.onload = () => setImg(reader.result)
        reader.readAsDataURL(file)
        return
      } else e.target.files = null
    }
  }

  const validateCheck = () => {
    errmsg.length = 0
    setEmail_e(false), setPass_e(false), setPass_r_e(false), setUpfile_e(false)
    const PassPattern = /^[a-zA-Z]{8,20}$/
    if (!email) {
      errmsg.push('メールアドレスが未入力です')
      setEmail_e(true)
    }
    if (!pass) {
      errmsg.push('パスワードが未入力です')
      setPass_e(true)
    }
    if (!PassPattern.test(pass) && pass) {
      errmsg.push('適切なパスワードを入力してください')
      setPass_e(true)
    }
    if (pass !== pass_r && PassPattern.test(pass) && pass) {
      errmsg.push('パスワードが一致しません')
      setPass_r_e(true)
    }
    if (!up_file) {
      errmsg.push('適切なファイルを選択してください')
      setUpfile_e(true)
    }
    if (errmsg.length === 0) {
      setCheckpop(true)
    }
  }

  const fileUpload = () => {
    return new Promise<string | false>((resolve) => {
      const file_name = new Date().getTime().toString(16) + Math.floor(10 * Math.random()).toString(16)
      const storageRef: firebase.storage.Reference = storage.ref()
      if (up_file) {
        const uploadTask = storageRef.child('idcard/' + file_name).put(up_file)
        uploadTask.on(
          'state_changed',
          (snapshot: firebase.storage.UploadTaskSnapshot) => {
            console.log('snapshot:', snapshot)
          },
          (error: Error) => {
            console.log('error:', error)
            resolve(false)
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL: string) => {
              console.log('Faile avaiable:', downloadURL)
              resolve(downloadURL)
            })
          }
        )
      }
    })
  }

  const register = async () => {
    if (!checkpop) return
    setResister_flag(true)
    const exist = await axios.get(ApiEp + 'users/' + email, {})
    console.log(exist)
    if (!exist) {
      errmsg.push('既に登録されているメールアドレスです')
      setEmail_e(true)
      setCheckpop(false)
      return
    }
    const card_url: string | false = await fileUpload()
    if (!card_url) return console.log('画像アップロードに失敗しました')
    const result = await axios.post(ApiEp + 'awaiting', {
      email: email,
      pass: pass,
      card_url: card_url
    })
    if (!result) return console.log('エントリー処理に失敗しました')
    setCheckpop(false)
    setDonepop(true)
  }

  return (
    <React.Fragment>
      <PopUp open_flg={checkpop}>
        <div className="check_label">この内容でエントリーしてもよろしいですか？</div>
        <InputText label="メールアドレス" disable={true} value={email} changeEvent={setEmail} />
        <InputText
          label="パスワード(ここでは表示できません)"
          disable={true}
          value={pass}
          type="password"
          changeEvent={setPass}
        />
        <label className="idcard_label">身分証明証アップロード</label>
        <div className="preview" style={{ backgroundImage: img_file ? `url(${img_file})` : 'none' }}></div>
        <button
          className="button"
          onClick={() => register()}
          disabled={register_flag}
          style={{ backgroundColor: register_flag ? '#eee' : '#22a6b3' }}
        >
          はい
        </button>
        <button className="button cancel" onClick={() => setCheckpop(false)}>
          いいえ
        </button>
      </PopUp>

      <PopUp open_flg={donepop}>
        <div className="done_label">
          エントリーが完了しました
          <br />
          審査に通り次第エントリーされたEメールに連絡させていただきます
        </div>
        <button
          className="button"
          onClick={() => {
            location.href = '/login'
          }}
        >
          はい
        </button>
      </PopUp>

      <FormBody>
        <h2 className="page_name">公式パートナーエントリー</h2>
        <FormCard>
          {errmsg.map((msg: string, index: number) => {
            return (
              <div
                className="error_msg"
                key={index}
                style={{ marginBottom: errmsg.length == index + 1 ? '10px' : '0' }}
              >
                {msg}
              </div>
            )
          })}
          <InputText label="メールアドレス" value={email} changeEvent={setEmail} error={email_e} />
          <InputText
            label="パスワード(半角英数字、8~20字)"
            value={pass}
            type="password"
            changeEvent={setPass}
            error={pass_e}
          />
          <InputText
            label="パスワード(再入力)"
            value={pass_r}
            type="password"
            changeEvent={setPass_r}
            error={pass_r_e}
          />
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
          <button className="button" onClick={() => validateCheck()}>
            確認
          </button>
          <a href="/login">
            <button className="button cancel">戻る</button>
          </a>
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
        .error_msg {
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
          border: 1.5px solid #${upfile_e ? 'd63031' : 'ddd'};
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
        .check_label {
          color: #444;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .done_label {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 200px;
          font-size: 14px;
          font-weight: bold;
          color: #555;
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
          .check_label {
            font-size: 14px;
          }
        }
      `}</style>
    </React.Fragment>
  )
}
export default RegisterPage
