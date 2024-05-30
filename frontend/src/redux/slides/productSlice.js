import { createSlice } from "@reduxjs/toolkit";
import { productReducer } from "../reducers/productReducer";

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
    updateProductDetail: productReducer.updateProductDetail,
  },
});

// Action creators are generated for each case reducer function
export const { updateProductDetail } = productSlice.actions;

export default productSlice.reducer;
