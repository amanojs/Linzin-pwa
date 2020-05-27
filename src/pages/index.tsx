import * as React from 'react'
import next, { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { db } from '../plugins/firebase'
import { Button } from '../components/Atoms/Button'
import { Video } from '../components/Atoms/Video'
declare var Peer: any

interface WaitingRoom {
  userid: string
  peerid: string
}

const IndexPage: NextPage = () => {
  /* refs */
  const own_video = React.useRef({} as HTMLVideoElement)
  const partner_video = React.useRef({} as HTMLVideoElement)

  const waitingroom: string = 'TestRoom'
  const runroom: string = 'RunRoom'
  var peer: any

  var partner: string

  React.useEffect(() => {
    peer = new Peer({
      key: 'b89bb244-f3d2-4bf9-aa78-049eae962ad2',
      debug: 3
    })
    return () => {
      db.ref(runroom + '/' + partner).remove()
    }
  }, [])

  /* パートナー検索 */
  const tryCall = () => {
    try {
      const fb = db.ref(waitingroom)
      fb.once('child_added').then((snapshot) => {
        if (snapshot.val()) {
          const partnerinfo: WaitingRoom = snapshot.val()
          console.log('パートナー情報:', partnerinfo)
          partner = partnerinfo.userid
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
    var localstream: MediaStream
    const id = '9000'
    const data: WaitingRoom = {
      userid: id,
      peerid: peer.id
    }
    const fb = db.ref(runroom + '/' + id)
    db.ref(waitingroom + '/' + id).set(data)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function(stream: MediaStream) {
        own_video.current.srcObject = stream
        own_video.current.play()
        localstream = stream
        fb.on('value', (snapshot) => {
          const users = snapshot.val()
          console.log('snapshot:', users)
          if (users.guest) console.log('guestが参加しました')
        })
        peer.on('call', (mediaConnection: any) => {
          mediaConnection.answer(localstream)
          setEventListener(mediaConnection)
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
        setEventListener(mediaConnection)
      })
      .catch(function(error) {
        console.error(error)
        return
      })
    db.ref(waitingroom + '/' + partnerinfo.userid).remove()
  }

  const setEventListener = (mediaConnection: any) => {
    console.log('setEventListenerだよ')
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
      <Link href={{ pathname: '/TestPage', query: { name: 'Amano' } }} as="/Amano/TestPage">
        <a>
          <Button color="#fff" backcolor="#555" value="テストボタン" />
        </a>
      </Link>
    </React.Fragment>
  )
}

export default IndexPage
