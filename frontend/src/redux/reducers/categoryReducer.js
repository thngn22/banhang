const getCategory = (state, action) => {
  state.multilevelCate.currentCate = action.payload;
  state.multilevelCate.isFetching = false;
  state.multilevelCate.error = false;
};

const updateCategory = (state, action) => {
  state.multilevelCate.currentCate = action.payload;
};

const updateCategoriesFather = (state, action) => {
  state.fatherCate.categories = action.payload;
};

export const categoryReducer = {
  getCategory,
  updateCategoriesFather,
  updateCategory,
};
