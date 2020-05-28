import * as React from 'react'
import next, { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
/* global var */
import { db } from '../plugins/firebase'
import { waitingroom, runroom } from '../globalvar'
import { startPeer } from '../plugins/skyway'
/* models */
import { WaitingRoom } from '../models/Room'
import * as PeerType from 'skyway-js/skyway-js'
/* components */
import { Button } from '../components/Atoms/Button'
import { Video } from '../components/Atoms/Video'

const IndexPage: NextPage = () => {
  /* refs */
  const own_video = React.useRef({} as HTMLVideoElement)
  const partner_video = React.useRef({} as HTMLVideoElement)

  /* パートナーとの通信管理する */
  var Partner_mc: PeerType.MediaConnection

  var peer: PeerType.default
  React.useEffect(() => {
    /* Peerをnewする */
    peer = startPeer()
    peer.on('error', (err: Error) => {
      alert('通信エラーが発生しました')
      console.log('peer-error:' + err)
    })
    return () => {}
  }, [])

  /* パートナー検索 */
  const tryCall = () => {
    try {
      const fb = db.ref(waitingroom)
      fb.once('child_added').then((snapshot) => {
        if (snapshot.val()) {
          const partnerinfo: WaitingRoom = snapshot.val()
          console.log('パートナー情報:', partnerinfo)
          connectPartner(partnerinfo)
          return
        }
      })
      return
    } catch (e) {
      /* エラー処理(まだどうするか考えてない) */
      alert('trycall error')
      return
    }
  }

  const testAdd = () => {
    const id: string = '9000'
    const data: WaitingRoom = {
      userid: id,
      peerid: peer.id
    }
    const fb: firebase.database.Reference = db.ref(runroom + '/' + id)
    db.ref(waitingroom + '/' + id).set(data)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function(stream: MediaStream) {
        own_video.current.srcObject = stream
        own_video.current.play()
        fb.on('value', (snapshot: firebase.database.DataSnapshot) => {
          const users = snapshot.val()
          console.log('snapshot:', users)
          if (users.guest) console.log('guestが参加しました')
        })
        peer.on('call', (mediaConnection: any) => {
          mediaConnection.answer(stream)
          setEventListener(mediaConnection)
          mediaConnection.once('close', () => {
            console.log('通信が切断されました')
            partner_video.current.srcObject = null
          })
        })
      })
      .catch(function(error) {
        console.error(error)
        return
      })
    db.ref(runroom + '/' + id + '/' + id).set(data)
  }

  /* 通信確立 */
  const connectPartner = async (partnerinfo: WaitingRoom) => {
    var localstream
    db.ref(runroom + '/' + partnerinfo.userid + '/guest').set({ userid: 'guest' })
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(async function(stream: MediaStream) {
        own_video.current.srcObject = stream
        own_video.current.play()
        localstream = stream
        const mediaConnection = await peer.call(partnerinfo.peerid, localstream)
        mediaConnection.once('close', () => {
          alert('通話が終了しました')
          partner_video.current.srcObject = null
        })
        setEventListener(mediaConnection)
      })
      .catch(function(error) {
        console.error(error)
        return
      })
    db.ref(waitingroom + '/' + partnerinfo.userid).remove()
  }

  const hangUp = () => {
    Partner_mc.close(true)
    alert('通話を終了しました')
  }

  /* リモートストリームをvideoに設定 */
  const setEventListener = (mediaConnection: any) => {
    console.log('setEventListenerだよ')
    Partner_mc = mediaConnection
    mediaConnection.on('stream', (stream: MediaStream) => {
      partner_video.current.srcObject = stream
      partner_video.current.play()
    })
  }

  return (
    <React.Fragment>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <script src="https://cdn.webrtc.ecl.ntt.com/skyway-latest.js"></script>
      </Head>
      <Video ref={own_video} mute={false} />
      <Video ref={partner_video} mute={false} />
      <button onClick={() => tryCall()}>Call</button>
      <button onClick={() => testAdd()}>Add</button>
      <button onClick={() => hangUp()}>Hang up</button>
      <Link href={{ pathname: '/TestPage', query: { name: 'Amano' } }} as="/Amano/TestPage">
        <a>
          <Button color="#fff" backcolor="#555" value="テストボタン" />
        </a>
      </Link>
    </React.Fragment>
  )
}

export default IndexPage
