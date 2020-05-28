declare var Peer: any

export const startPeer = () => {
  return new Peer({
    key: process.env.SKYWAY_KEY,
    debug: 3
  })
}
