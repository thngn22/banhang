const detailAddressList = (state, action) => {
  state.detailAddress.currentAddress = action.payload;
};

export const addressReducer = {
  detailAddressList,
};
