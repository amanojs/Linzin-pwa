import * as React from 'react'
import axios from 'axios'
import { ApiEp } from '../globalvar'

export const AwaitingList: React.FC = () => {
  const [lists, setLists] = React.useState([])
  React.useEffect(() => {
    fetchList()
  })
  const fetchList = async () => {
    let result: [] = await axios.get(ApiEp + '/awaiting')
    setLists(result)
  }
  return (
    <React.Fragment>
      <div className="list">
        {lists.map((list, index) => {
          return (
            <div className="lists">
              <div>{list}</div>
              <img src={list} alt="身分証明書" />
              <button>承認</button>
              <button>破棄</button>
            </div>
          )
        })}
      </div>
    </React.Fragment>
  )
}
