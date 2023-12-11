import { createSlice } from "@reduxjs/toolkit";

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
    updateDetailOrder: (state, action) => {
      state.detailOrder.currentOrder = action.payload;
      state.detailOrder.isFetching = false;
      state.detailOrder.error = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateDetailOrder } = orderSlice.actions;

export default orderSlice.reducer;
