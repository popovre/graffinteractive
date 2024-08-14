import { createSlice, Slice } from "@reduxjs/toolkit"

export const chatSlice: Slice = createSlice({
  name: "chat",
  initialState: {
    pageId: "",
    input: "",
  },
  selectors: {
    selectInput: state => {
      return state.input
    },
  },
  reducers: {
    setInputValue(state, action) {
      state.input = action.payload.input
    },
    setPageId(state, action) {
      state.pageId = action.payload.pageId
    },
  },
})

export const { setInputValue, setPageId } = chatSlice.actions
export const { selectInput } = chatSlice.selectors
