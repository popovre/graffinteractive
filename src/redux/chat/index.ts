import { createSlice, Slice } from "@reduxjs/toolkit"

export const chatSlice: Slice = createSlice({
  name: "chat",
  initialState: {
    windowRef: null,
    inputRef: null,
    socket: null,
    members: [],
    messages: [],
  },
  selectors: {
    selectInput: state => {
      return state.input
    },
    selectWindow: state => {
      return state.window
    },
    selectMembers: state => {
      return state.members
    },
  },
  reducers: {
    setInputRef(state, action) {
      state.inputRef = action.payload
    },
    setWindowRef(state, action) {
      state.windowRef = action.payload
    },
    setSocket(state, action) {
      state.socket = action.payload
    },
    setMessages(state, action) {
      state.messages = [...state.window, ...action.payload]
    },
    setMembers(state, action) {
      state.members = [...state.members, ...action.payload]
    },
  },
})

export const { setWindowValue, setInputValue } = chatSlice.actions
export const { selectInput, selectWindow, setMembersValue } =
  chatSlice.selectors
