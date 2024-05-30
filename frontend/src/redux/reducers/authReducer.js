const loginStart = (state) => {
    state.login.isFetching = true;
}

const loginSuccess = (state, action) => {
    state.login.currentUser = action.payload;
    state.login.isFetching = false;
    state.login.error = false;
}

const loginFailed = (state) => {
    state.login.isFetching = false;
    state.login.error = true;
}

const logoutSuccess = (state) => {
    state.login.currentUser = null
    state.login.isFetching = false;
    state.login.error = false;
  }

export const authReducer = {
    loginStart,
    loginSuccess,
    loginFailed,
    logoutSuccess
}