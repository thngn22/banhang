const updateProductDetail = (state, action) => {
    state.productDetail.currentProduct = action.payload;
    state.productDetail.isFetching = false;
    state.productDetail.error = false;
}

export const productReducer = {
    updateProductDetail
}