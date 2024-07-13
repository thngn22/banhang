const loginStart = (state) => {
  state.login.isFetching = true;
};

const loginSuccess = (state, action) => {
  state.login.currentUser = action.payload;
  state.login.isFetching = false;
  state.login.error = false;
};

const loginFailed = (state) => {
  state.login.isFetching = false;
  state.login.error = true;
};

const logoutSuccess = (state) => {
  state.login.currentUser = null;
  state.login.isFetching = false;
  state.login.error = false;
};

const updateAuth = (state, action) => {
  const { firstName, lastName, phone, avatar } = action.payload;
  state.login.currentUser.firstName = firstName;
  state.login.currentUser.lastName = lastName;
  state.login.currentUser.phone = phone;
  state.login.currentUser.avatar = avatar;
};

export const authReducer = {
  loginStart,
  loginSuccess,
  loginFailed,
  logoutSuccess,
  updateAuth,
};
