import { createSlice } from "@reduxjs/toolkit";
import { addressReducer } from "../reducers/addressReducer";

export const addressSlice = createSlice({
  name: "address",
  initialState: {
    detailAddress: {
      currentAddress: null,
    },
  },
  reducers: {
    detailAddressList: addressReducer.detailAddressList,
  },
});

export const { detailAddressList } = addressSlice.actions;

export default addressSlice.reducer;
