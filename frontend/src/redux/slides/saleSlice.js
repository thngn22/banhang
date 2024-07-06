import { createSlice } from "@reduxjs/toolkit";
import { saleReducer } from "../reducers/saleReducer";

export const saleSlice = createSlice({
  name: "sale",
  initialState: {
    createSale: {
      currentProduct: null,
      choosedProduct: null,
    },
  },
  reducers: {
    updateCurrentProductList: saleReducer.updateCurrentProductList,
    updateChoesedProductList: saleReducer.updateChoesedProductList,
    addProductToChoosedList: saleReducer.addProductToChoosedList,
    removeProductFromChoosedList: saleReducer.removeProductFromChoosedList,
  },
});

export const {
  updateCurrentProductList,
  updateChoesedProductList,
  addProductToChoosedList,
  removeProductFromChoosedList,
} = saleSlice.actions;

export default saleSlice.reducer;
