import { createSlice } from "@reduxjs/toolkit";
import { categoryReducer } from "../reducers/categoryReducer";

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
    getCategory: categoryReducer.getCategory,
  },
});

// Action creators are generated for each case reducer function
export const { getCategory } = categorySlice.actions;

export default categorySlice.reducer;
