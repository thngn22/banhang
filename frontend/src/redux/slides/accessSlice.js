import { createSlice } from "@reduxjs/toolkit";

export const accessSlice = createSlice({
  name: "access",
  initialState: {
    signUp: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
    forgot: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
    change: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    signSuccess: (state, action) => {
      state.signUp.currentUser = action.payload;
      state.signUp.isFetching = false;
      state.signUp.error = false;
    },
    forgotSuccess: (state, action) => {
      state.forgot.currentUser = action.payload;
      state.forgot.isFetching = false;
      state.forgot.error = false;
    },
    changeSuccess: (state, action) => {
      state.change.currentUser = action.payload;
      state.change.isFetching = false;
      state.change.error = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { signSuccess, forgotSuccess, changeSuccess } =
  accessSlice.actions;

export default accessSlice.reducer;
