import { configureStore } from '@reduxjs/toolkit'
import { counterSlice } from "./slides/counterSlide"

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
})