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

    fatherCate: {
      categories: [],
    },
  },
  reducers: {
    getCategory: categoryReducer.getCategory,
    updateCategory: categoryReducer.updateCategory,
    updateCategoriesFather: categoryReducer.updateCategoriesFather,
  },
});

// Action creators are generated for each case reducer function
export const { getCategory, updateCategoriesFather, updateCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
