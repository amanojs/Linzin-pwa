/* room names */
export const waitingroom: string = 'WaitingRoom'
export const runroom: string = 'RunRoom'

/* checkDevice */
export const findDevices = async (devices: MediaDeviceInfo[]) => {
  return new Promise<{ video: boolean; audio: boolean }>((resolve) => {
    let finded: { video: boolean; audio: boolean } = { video: false, audio: false }
    for (let i = 0; i < devices.length; i++) {
      console.log(devices.length)
      if (devices[i].kind == 'videoinput') finded.video = true
      if (devices[i].kind == 'audioinput') finded.audio = true
    }
    resolve(finded)
  })
}
