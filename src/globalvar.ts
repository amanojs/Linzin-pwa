/* room names */
export const waitingroom: string = 'WaitingRoom'
export const runroom: string = 'RunRoom'

/* checkDevice */
export const findDevices = async () => {
  return new Promise<{ video: boolean; audio: boolean }>((resolve) => {
    let finded: { video: boolean; audio: boolean } = { video: false, audio: false }
    navigator.mediaDevices
      .enumerateDevices()
      .then(async (devices: MediaDeviceInfo[]) => {
        for (let i = 0; i < devices.length; i++) {
          console.log(devices.length)
          if (devices[i].kind == 'videoinput') finded.video = true
          if (devices[i].kind == 'audioinput') finded.audio = true
        }
        resolve(finded)
      })
      .catch((err: Error) => {
        console.log('errorです:', Error)
        alert('使用可能なカメラ、またはマイクを接続してください')
        resolve(finded)
      })
  })
}

/* ログイン状態確認 */
import Cookies from 'universal-cookie'
import axios, { AxiosResponse } from 'axios'
import { IncomingMessage } from 'http'

export const partnerCheck = (req: IncomingMessage) => {
  return new Promise<AxiosResponse | false>(async (resolve) => {
    const cookies = new Cookies(req.headers.cookie)
    const key = cookies.get('linzinRSA')
    if (!key) {
      console.log('クッキーがありません')
      resolve(false)
    }
    console.log('今からaxios', key)
    const result = await axios.post(ApiEp + 'checkPartner', { key: key })
    console.log('axiosからきた')
    if (!result) {
      console.log('セッションデータとの照合に失敗しました')
      cookies.set('linzinRSA', null)
      resolve(false)
    }
    resolve(result)
  })
}

/* api endpoint */
export const ApiEp = 'http://localhost:23450/'
