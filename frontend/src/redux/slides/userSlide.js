import { createSlice } from "@reduxjs/toolkit";
import { userReducer } from "../reducers/userReducer";

const initialState = {
  userName: "",
  email: "",
  phone: "",
  avatar: "",
  accessToken: "",
  isAdmin: false,
  cart: [],
  addressList: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: userReducer.updateUser,
    updateCart: userReducer.updateCart,
    resetUser: userReducer.resetUser,
    updateAddressList: userReducer.updateAddressList,
  },
});

export const { updateUser, updateCart, resetUser, updateAddressList } =
  userSlice.actions;

export default userSlice.reducer;
