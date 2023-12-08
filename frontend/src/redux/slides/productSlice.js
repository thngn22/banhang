import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    productDetail: {
      currentProduct: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    updateProductDetail: (state, action) => {
      state.productDetail.currentProduct = action.payload;
      state.productDetail.isFetching = false;
      state.productDetail.error = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateProductDetail } = productSlice.actions;

export default productSlice.reducer;
