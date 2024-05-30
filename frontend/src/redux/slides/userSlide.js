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
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: userReducer.updateUser,
    addToCart: userReducer.addToCart,
    updateQuantity: userReducer.updateQuantity,
    removeItem: userReducer.removeItem,
    resetUser: userReducer.resetUser,
  },
});

// Action creators are generated for each case reducer function
export const { updateUser, addToCart, updateQuantity, removeItem, resetUser } = userSlice.actions;

export default userSlice.reducer;
