const updateCurrentProductList = (state, action) => {
  state.createSale.currentProduct = action.payload;
};

const updateChoesedProductList = (state, action) => {
  state.createSale.choosedProduct = action.payload;
};

const addProductToChoosedList = (state, action) => {
  const product = action.payload;
  if (!state.createSale.choosedProduct) {
    state.createSale.choosedProduct = [product];
  } else {
    state.createSale.choosedProduct = [
      ...state.createSale.choosedProduct,
      product,
    ];
  }
};

const removeProductFromChoosedList = (state, action) => {
  const productId = action.payload;
  if (state.createSale.choosedProduct?.length > 0) {
    state.createSale.choosedProduct = state.createSale.choosedProduct.filter(
      (product) => product.id !== productId
    );
  }
};

const detailSale = (state, action) => {
  state.detailSale.currentSale = action.payload;
};

export const saleReducer = {
  updateCurrentProductList,
  updateChoesedProductList,
  addProductToChoosedList,
  removeProductFromChoosedList,
  detailSale,
};
