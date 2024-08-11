import { createSlice } from "@reduxjs/toolkit";
import { accessReducer } from "../reducers/accessReducer";

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
    signSuccess: accessReducer.signSuccess,
    forgotSuccess: accessReducer.forgotSuccess,
    changeSuccess: accessReducer.changeSuccess,
  },
});

// Action creators are generated for each case reducer function
export const { signSuccess, forgotSuccess, changeSuccess } =
  accessSlice.actions;

export default accessSlice.reducer;
