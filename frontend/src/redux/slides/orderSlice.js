import { createSlice } from "@reduxjs/toolkit";
import { orderReducer } from "../reducers/orderReducer";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    detailOrder: {
      currentOrder: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    updateDetailOrder: orderReducer.updateDetailOrder,
  },
});

// Action creators are generated for each case reducer function
export const { updateDetailOrder } = orderSlice.actions;

export default orderSlice.reducer;
