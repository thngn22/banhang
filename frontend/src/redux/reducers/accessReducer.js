const signSuccess = (state, action) => {
    state.signUp.currentUser = action.payload;
    state.signUp.isFetching = false;
    state.signUp.error = false;
}

const forgotSuccess = (state, action) => {
    state.forgot.currentUser = action.payload;
    state.forgot.isFetching = false;
    state.forgot.error = false;
}

const changeSuccess = (state, action) => {
    state.change.currentUser = action.payload;
    state.change.isFetching = false;
    state.change.error = false;
}

export const accessReducer = {
    signSuccess,
    forgotSuccess,
    changeSuccess
}