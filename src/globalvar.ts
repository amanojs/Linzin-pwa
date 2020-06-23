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
    console.log(key)
    if (!key) {
      console.log('ログイン状態ではありません')
      return resolve(false)
    }
    console.log('今からaxios', key)
    const result = await axios.post(ApiEp + 'checkPartner', { key: key })
    console.log('axiosからきた')
    console.log('axiosからとってきた', result.data)
    if (!result.data) {
      console.log('セッションデータとの照合に失敗しました')
      cookies.set('linzinRSA', null)
      return resolve(false)
    }
    return resolve(result)
  })
}

/* api endpoint */
export const ApiEp = 'https://linzin.net/'
//http://localhost:23450/
