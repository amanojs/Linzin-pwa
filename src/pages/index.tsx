import * as React from 'react'
import next, { NextPage } from 'next'

/* global var */
import store from '../store'
import { db } from '../plugins/firebase'
import { waitingroom, runroom, findDevices } from '../globalvar'
import { startPeer } from '../plugins/skyway'

/* models */
import { WaitingRoom } from '../models/Room'
import * as PeerType from 'skyway-js/skyway-js'

/* components */
import Link from 'next/link'
import Head from 'next/head'
import { Button } from '../components/Atoms/Button'
import { Provider } from 'react-redux'
import { CallDisp } from '../components/Moles/CallDisp'
import { TopLayout } from '../components/Moles/TopLayout'

const IndexPage: NextPage = () => {
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

  /* パートナー検索 */
  const tryCall = async () => {
    const result = await findDevices()
    if (!result.video || !result.audio) return alert('使用可能なカメラ、またはマイクを接続してください')
    try {
      const fb = db.ref(waitingroom)
      fb.once('child_added').then((snapshot) => {
        if (snapshot.val()) {
          const partnerinfo: WaitingRoom = snapshot.val()
          console.log('パートナー情報:', partnerinfo)
          connectPartner(partnerinfo)
        }
      })
    } catch (e) {
      /* エラー処理(まだどうするか考えてない) */
      alert('trycall error')
    }
    return
  }

  /* 通信確立 */
  const connectPartner = (partnerinfo: WaitingRoom) => {
    db.ref(runroom + '/' + partnerinfo.userid + '/guest').set({ userid: 'guest' })
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        setOwn(stream)
        const mediaConnection = peer.call(partnerinfo.peerid, stream)
        mediaConnection.once('close', () => {
          alert('通話が終了されました')
          setPartner(null)
          location.reload()
        })
        setEventListener(mediaConnection)
      })
      .catch(function(error) {
        console.error(error)
        return
      })
    db.ref(waitingroom + '/' + partnerinfo.userid).remove()
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
        <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png" sizes="192x192" />
        <script src="https://cdn.webrtc.ecl.ntt.com/skyway-latest.js"></script>
      </Head>
      <Provider store={store}>
        <TopLayout
          color="#04AA84"
          thema="高齢者向けビデオ通話サービス"
          isPartner={false}
          callMethod={tryCall}
          bgc="#fff"
        >
          今日はどんな１日だった？
        </TopLayout>
        <CallDisp
          Partner_mc={Partner_mc}
          own_videosrc={own_videosrc}
          partner_videosrc={partner_videosrc}
          display={own_videosrc != null ? true : false}
        />
        <button onClick={() => tryCall()}>Call</button>
        <Link href={{ pathname: '/TestPage', query: { name: 'Amano' } }} as="/Amano/TestPage">
          <a>
            <Button color="#fff" backcolor="#555" value="テストボタン" />
          </a>
        </Link>
        <Link href={{ pathname: '/partners' }}>
          <a>
            <Button color="#fff" backcolor="#f00" value="パートナーズ" />
          </a>
        </Link>
      </Provider>
      <style jsx global>{`
        body {
          margin: 0px;
        }
      `}</style>
    </React.Fragment>
  )
}

export default IndexPage
