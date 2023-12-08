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
      state.multilevelCate.currentCate = action.payload;
      state.multilevelCate.isFetching = false;
      state.multilevelCate.error = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateDetailOrder } = orderSlice.actions;

export default orderSlice.reducer;
