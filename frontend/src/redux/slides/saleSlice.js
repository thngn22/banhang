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
    updateSale: {
      currentSale: null,
    },
  },
  reducers: {
    updateCurrentProductList: saleReducer.updateCurrentProductList,
    updateChoesedProductList: saleReducer.updateChoesedProductList,
    addProductToChoosedList: saleReducer.addProductToChoosedList,
    removeProductFromChoosedList: saleReducer.removeProductFromChoosedList,
    detailSale: saleReducer.detailSale,
    detailSaleUpdate: saleReducer.detailSaleUpdate,
    removeProductFromChoosedList_Update:
      saleReducer.removeProductFromChoosedList_Update,
    addProductFromChoosedList_Update:
      saleReducer.addProductFromChoosedList_Update,
  },
});

export const {
  updateCurrentProductList,
  updateChoesedProductList,
  addProductToChoosedList,
  removeProductFromChoosedList,
  detailSale,
  detailSaleUpdate,
  removeProductFromChoosedList_Update,
  addProductFromChoosedList_Update,
} = saleSlice.actions;

export default saleSlice.reducer;
