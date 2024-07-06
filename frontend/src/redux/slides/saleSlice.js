import { createSlice } from "@reduxjs/toolkit";
import { saleReducer } from "../reducers/saleReducer";

export const saleSlice = createSlice({
  name: "sale",
  initialState: {
    createSale: {
      currentProduct: null,
      choosedProduct: null,
    },
    detailSale: {
      currentSale: null,
    },
  },
  reducers: {
    updateCurrentProductList: saleReducer.updateCurrentProductList,
    updateChoesedProductList: saleReducer.updateChoesedProductList,
    addProductToChoosedList: saleReducer.addProductToChoosedList,
    removeProductFromChoosedList: saleReducer.removeProductFromChoosedList,
    detailSale: saleReducer.detailSale,
  },
});

export const {
  updateCurrentProductList,
  updateChoesedProductList,
  addProductToChoosedList,
  removeProductFromChoosedList,
  detailSale,
} = saleSlice.actions;

export default saleSlice.reducer;
