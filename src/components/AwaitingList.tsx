import * as React from 'react'
import axios from 'axios'
import { ApiEp } from '../globalvar'
import { Awaiting } from '../models/Awaiting'
import { PartnerIn } from '../models/Partner'

interface OwnProps {
  setFlag(v: boolean): void
}

export const AwaitingList: React.FC<OwnProps> = (props) => {
  const [lists, setLists] = React.useState<Awaiting[]>([])
  React.useEffect(() => {
    fetchList()
  }, [])

  const fetchList = async () => {
    let result = await axios.get(ApiEp + 'awaiting')
    console.log(result.data)
    setLists(result.data)
  }

  const authAwaiting = async (awaiting: Awaiting) => {
    const PartnerIn: PartnerIn = { email: awaiting.email, pass: awaiting.pass, card_url: awaiting.idcard }
    let result = await axios.post(ApiEp + 'awaiting/auth', PartnerIn)
    if (result.data) {
      alert('承認しました')
    } else {
      alert('認証に失敗しました')
    }
    fetchList()
  }

  return (
    <React.Fragment>
      <h3>承認待ち一覧</h3>
      <button onClick={() => fetchList()}>更新</button>
      <button onClick={() => props.setFlag(false)}>戻る</button>
      <div className="list">
        {lists.map((list, index) => {
          return (
            <div className="lists" key={index}>
              <div>{list.email}</div>
              <div>{list.date}</div>
              <img src={list.idcard} alt="身分証明書" />
              <button onClick={() => authAwaiting(list)}>承認</button>
              <button>破棄</button>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .list {
          display: flex;
          flex-wrap: wrap;
        }
        .lists {
          width: 300px;
        }
        .lists img {
          width: 100%;
        }
      `}</style>
    </React.Fragment>
  )
}
