import { combineSlices, configureStore } from "@reduxjs/toolkit"
export const store = configureStore({
  reducer: combineSlices(),
})
