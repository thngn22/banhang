const updateDetailOrder = (state, action) => {
    state.detailOrder.currentOrder = action.payload;
    state.detailOrder.isFetching = false;
    state.detailOrder.error = false;
}

export const orderReducer = {
    updateDetailOrder
}