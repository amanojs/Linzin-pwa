import * as React from 'react'
import next, { NextPage } from 'next'
import * as PeerType from 'skyway-js/skyway-js'
import { startPeer } from '../plugins/skyway'
import { db } from '../plugins/firebase'
import { waitingroom, runroom, findDevices } from '../globalvar'
import { WaitingRoom } from '../models/Room'
import { CallDisp } from '../components/Moles/CallDisp'
import Head from 'next/head'
import { Provider } from 'react-redux'
import store from '../store'
import { resolve } from 'dns'

const PartnersPage: NextPage = () => {
  const [own_videosrc, setOwn] = React.useState<MediaStream | null>(null)
  const [partner_videosrc, setPartner] = React.useState<MediaStream | null>(null)
  const [Partner_mc, setMc] = React.useState<PeerType.MediaConnection | null>(null)

  var peer: PeerType.default
  React.useEffect(() => {
    peer = startPeer()
    peer.on('error', (err: Error) => {
      alert('通信エラーが発生しました')
      console.log('peer-error:' + err)
    })
    return () => {}
  }, [])

  const testAdd = () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(async (devices: MediaDeviceInfo[]) => {
        const result = await findDevices(devices)
        if (!result.video || !result.audio) return alert('使用可能なカメラ、またはマイクを接続してください')
        const id: string = '9000'
        const data: WaitingRoom = {
          userid: id,
          peerid: peer.id
        }
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(function(stream: MediaStream) {
            console.log('getUserMedia')
            db.ref(waitingroom + '/' + id).set(data)
            db.ref(runroom + '/' + id + '/' + id).set(data)
            setOwn(stream)
            db.ref(runroom + '/' + id).on('value', (snapshot: firebase.database.DataSnapshot) => {
              const users = snapshot.val()
              console.log('snapshot:', users)
              if (users.guest) console.log('guestが参加しました')
            })
            peer.on('call', (mediaConnection: PeerType.MediaConnection) => {
              mediaConnection.answer(stream)
              setEventListener(mediaConnection)
              mediaConnection.once('close', () => {
                console.log('通信が切断されました')
                setPartner(null)
              })
            })
          })
          .catch(function(err: Error) {
            alert('カメラ、オーディオの使用を許可してください')
            console.error('エラーだよ' + err)
            return
          })
      })
      .catch((err: Error) => {
        console.log('errorです:', Error)
        alert('使用可能なカメラ、またはマイクを接続してください')
      })
    return
  }

  /* リモートストリームをvideoに設定 */
  const setEventListener = (mediaConnection: PeerType.MediaConnection) => {
    setMc(mediaConnection)
    mediaConnection.on('stream', (stream: MediaStream) => {
      setPartner(stream)
    })
  }

  return (
    <React.Fragment>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <script src="https://cdn.webrtc.ecl.ntt.com/skyway-latest.js"></script>
      </Head>
      <Provider store={store}>
        <div>
          改善版
          <CallDisp Partner_mc={Partner_mc} own_videosrc={own_videosrc} partner_videosrc={partner_videosrc} />
          <button onClick={() => testAdd()}>待機</button>
        </div>
      </Provider>
    </React.Fragment>
  )
}

export default PartnersPage
