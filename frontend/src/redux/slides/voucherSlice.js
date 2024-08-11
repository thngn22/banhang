import { createSlice } from "@reduxjs/toolkit";
import { voucherReducer } from "../reducers/voucherReducer";

export const voucherSlice = createSlice({
  name: "voucher",
  initialState: {
    detailVoucher: {
      currentVoucher: null,
    },
  },
  reducers: {
    detailVoucher: voucherReducer.detailVoucher,
  },
});

export const { detailVoucher } = voucherSlice.actions;

export default voucherSlice.reducer;
