const getCategory = (state, action) => {
    state.multilevelCate.currentCate = action.payload;
    state.multilevelCate.isFetching = false;
    state.multilevelCate.error = false;
}

export const categoryReducer = {
    getCategory
}