import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  email: "",
  phone: "",
  avatar: "",
  accessToken: "",
  isAdmin: false
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { userName, email, phone, avatar, accessToken, isAdmin } = action.payload;
      console.log(action.payload);
      state.userName = userName;
      state.email = email;
      state.phone = phone;
      state.avatar = avatar;
      state.accessToken = accessToken;
      state.isAdmin = isAdmin
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
