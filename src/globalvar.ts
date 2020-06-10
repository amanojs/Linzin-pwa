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

/* api endpoint */
export const ApiEp = 'http://localhost:23450/'
