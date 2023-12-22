import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    multilevelCate: {
      currentCate: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getCategory: (state, action) => {
      state.multilevelCate.currentCate = action.payload;
      state.multilevelCate.isFetching = false;
      state.multilevelCate.error = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getCategory } = categorySlice.actions;

export default categorySlice.reducer;
