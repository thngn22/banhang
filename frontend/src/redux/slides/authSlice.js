import { createSlice } from "@reduxjs/toolkit";
import { authReducer } from "../reducers/authReducer";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    loginStart: authReducer.loginStart,
    loginSuccess: authReducer.loginSuccess,
    loginFailed: authReducer.loginFailed,
    logoutSuccess: authReducer.logoutSuccess,
    updateAuth: authReducer.updateAuth,
  },
});

// Action creators are generated for each case reducer function
export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logoutSuccess,
  updateAuth,
} = authSlice.actions;

export default authSlice.reducer;
