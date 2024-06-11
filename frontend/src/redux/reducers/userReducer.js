const updateUser = (state, action) => {
  const { userName, email, phone, avatar, accessToken, isAdmin } =
    action.payload;
  state.userName = userName;
  state.email = email;
  state.phone = phone;
  state.avatar = avatar;
  state.accessToken = accessToken;
  state.isAdmin = isAdmin;
};

const updateCart = (state, action) => {
  state.cart = action.payload;
};

const resetUser = (state) => {
  state.userName = "";
  state.email = "";
  state.phone = "";
  state.avatar = "";
  state.accessToken = "";
  state.isAdmin = false;
  state.cart = [];
};

export const userReducer = {
  updateUser,
  updateCart,
  resetUser,
};
