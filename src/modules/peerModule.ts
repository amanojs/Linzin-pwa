import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit'
import { type } from 'os'

type Task = {
  id: number
  title: string
  done: boolean
}

type State = {
  count: number
  tasks: Task[]
}

const initialState: State = {
  count: 2,
  tasks: [
    {
      id: 1,
      title: '風呂に入る',
      done: false
    },
    {
      id: 2,
      title: '歯を磨く',
      done: false
    }
  ]
}

const tasksModule = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state: State, action: PayloadAction<string>) {
      state.count++
      const newTask: Task = {
        id: state.count,
        title: action.payload,
        done: false
      }
      state.tasks = [newTask, ...state.tasks]
    }
  }
})

export const { addTask } = tasksModule.actions
export default tasksModule
