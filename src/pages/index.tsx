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
import { PopUp } from '../components/Moles/PopUp'
import { resolve } from 'path'

const IndexPage: NextPage = () => {
  const [own_videosrc, setOwn] = React.useState<MediaStream | null>(null)
  const [partner_videosrc, setPartner] = React.useState<MediaStream | null>(null)
  const [Partner_mc, setMc] = React.useState<PeerType.MediaConnection | null>(null)
  const [errpop, setErrPop] = React.useState<boolean>(false)
  const [errmsg, setErrMsg] = React.useState<string>('')
  const [callpop, setCallpop] = React.useState<boolean>(false)
  const [waitmode, setWait] = React.useState<boolean>(false)
  let calling: boolean = false

  var peer: PeerType.default
  React.useEffect(() => {
    const ws = new WebSocket('wss://linzin.net/ws?type=partner')
    ws.onopen = function(e) {
      console.log('コネクションを開始しまいた。')
    }

    //エラーが発生したされた時の動き
    ws.onerror = function(error) {
      console.log('エラーが発生しました。')
    }
    peer = startPeer()
    peer.on('error', (err: Error) => {
      setErrMsg('peer通信に問題が発生しました')
      setErrPop(true)
      console.log('peer-error:' + err)
    })
    return () => {}
  }, [])

  /* パートナー検索 */
  const tryCall = async () => {
    if (waitmode) return
    const result = await findDevices()
    if (!result.video || !result.audio) {
      setErrMsg('使用可能なカメラ、またはマイクを接続してください')
      setErrPop(true)
      return
    }
    try {
      setWait(true)
      let partnerinfo: WaitingRoom | null = null
      const fb = db.ref(waitingroom)
      fb.once('child_added', (snapshot) => {
        console.log('snapshot', snapshot.val())
        console.log(snapshot.val())
        if (snapshot.val()) {
          partnerinfo = snapshot.val()
          console.log('パートナー情報:', partnerinfo)
          if (partnerinfo != null) connectPartner(partnerinfo)
          fb.off()
          return
        } else {
          console.log('通話待機中のパートナーがいません。時間をおいてもう一度お試しください。')
          setErrMsg('通話待機中のパートナーがいません。時間をおいてもう一度お試しください。')
          setErrPop(true)
          fb.off()
          return
        }
      })
    } catch (e) {
      alert('trycall error')
      throw e
    }
  }

  /* 通信確立 */
  const connectPartner = (partnerinfo: WaitingRoom) => {
    console.log('ぴあID', partnerinfo.peerid)
    //db.ref(runroom + '/' + partnerinfo.userid + '/guest').set({ userid: 'guest' })
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        setOwn(stream)
        console.log('ぴあID', partnerinfo.peerid)
        const option = {
          connectionId: 'user'
        }
        const mediaConnection = peer.call(partnerinfo.peerid, stream, option)
        db.ref(waitingroom + '/' + partnerinfo.userid).remove()
        mediaConnection.once('close', () => {
          setCallpop(true)
          setPartner(null)
        })
        setEventListener(mediaConnection)
      })
      .catch(function(error) {
        console.error(error)
        return
      })
  }

  /* リモートストリームをvideoに設定 */
  const setEventListener = async (mediaConnection: PeerType.MediaConnection) => {
    setMc(mediaConnection)
    mediaConnection.on('stream', (stream: MediaStream) => {
      calling = true
      setPartner(stream)
      return
    })
    await sleep()
    if (calling === false) {
      setErrMsg('通話待機中のパートナーがいません。時間をおいてもう一度お試しください。')
      setErrPop(true)
    }
  }

  const sleep = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 2500)
    })
  }

  return (
    <React.Fragment>
      <Head>
        <title>リンジン -今日はどんな一日だった？-</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/icons/Icon-196.png" sizes="196x196" />
        <script src="https://cdn.webrtc.ecl.ntt.com/skyway-latest.js"></script>
      </Head>
      <Provider store={store}>
        <a href="/partners" className="toPartners">
          パートナーズへ
        </a>

        <PopUp open_flg={errpop}>
          <div className="done_label">{errmsg}</div>
          <button
            className="button"
            onClick={() => {
              location.reload()
            }}
          >
            はい
          </button>
        </PopUp>

        <PopUp open_flg={callpop}>
          <div className="done_label">通話が終了されました</div>
          <button
            className="button"
            onClick={() => {
              location.reload()
            }}
          >
            閉じる
          </button>
        </PopUp>

        <TopLayout
          color="#04AA84"
          thema="高齢者向けビデオ通話サービス【リンジン】"
          isPartner={false}
          callMethod={tryCall}
          wait={waitmode}
          bgc="#fff"
        >
          今日はどんな１日だった？
        </TopLayout>
        <CallDisp
          Partner_mc={Partner_mc}
          own_videosrc={own_videosrc}
          partner_videosrc={partner_videosrc}
          setCallPop={setCallpop}
          display={own_videosrc != null ? true : false}
        />
      </Provider>
      <style jsx global>{`
        body {
          margin: 0px;
          font-family: 'Hiragino Kaku Gothic ProN', 'メイリオ', sans-serif;
        }
      `}</style>
      <style jsx>{`
        .toPartners {
          position: absolute;
          top: 10px;
          right: 10px;
          color: #fff;
          text-decoration: none;
          font-size: 15px;
          font-weight: bold;
          letter-spacing: 0px;
          padding: 5px 10px;
          background-color: rgb(4, 170, 132);
          border-radius: 2px;
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
        @media screen and (max-width: 480px) {
          .button {
            width: 100%;
            margin: 0;
          }
        }
      `}</style>
    </React.Fragment>
  )
}

export default IndexPage
