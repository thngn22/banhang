const detailVoucher = (state, action) => {
  state.detailVoucher.currentVoucher = action.payload;
};

export const voucherReducer = {
  detailVoucher,
};
