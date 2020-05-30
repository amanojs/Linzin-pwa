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

  var myid: string = ''
  var peer: PeerType.default
  React.useEffect(() => {
    peer = startPeer()
    peer.on('error', (err: Error) => {
      alert('通信エラーが発生しました')
      console.log('peer-error:' + err)
    })
    return () => {}
  }, [])

  const testAdd = async () => {
    myid = new Date().getTime().toString(16) + Math.floor(10 * Math.random()).toString(16)
    const data: WaitingRoom = { userid: myid, peerid: peer.id }
    const result = await findDevices()
    if (!result.video || !result.audio) return alert('使用可能なカメラ、またはマイクを接続してください')
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function(stream: MediaStream) {
        setOwn(stream)
        db.ref(waitingroom + '/' + myid).set(data)
        db.ref(runroom + '/' + myid + '/' + myid).set(data)
        peer.on('call', (mediaConnection: PeerType.MediaConnection) => {
          mediaConnection.answer(stream)
          setEventListener(mediaConnection)
          mediaConnection.once('close', () => {
            alert('通信が切断されました')
            setPartner(null)
          })
        })
      })
      .catch(function(err: Error) {
        alert('カメラ、オーディオの使用を許可してください')
        console.error('エラーだよ' + err)
      })
    return
  }

  /* 待機中止 */
  const stopHost = () => {
    db.ref(waitingroom + '/' + myid).remove()
    alert('ホストを中断しました')
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
          <CallDisp Partner_mc={Partner_mc} own_videosrc={own_videosrc} partner_videosrc={partner_videosrc} display={own_videosrc != null ? true : false} />
          <button onClick={() => testAdd()}>待機</button>
          <button onClick={() => stopHost()}>中止</button>
        </div>
      </Provider>
    </React.Fragment>
  )
}

export default PartnersPage
