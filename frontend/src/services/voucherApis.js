const getVouchers = async (accessToken, axiosJWT) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}voucher/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

const getVoucherssAdmin = async (accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}voucher/admin`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const getDetailVouchers = async (id, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}voucher/${id}`
  );
  return res.data;
};

const createVoucherAdmin = async (data, accessToken, axiosJWT) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}voucher/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const useVoucher = async (data, accessToken, axiosJWT) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}voucher/apply`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const revokeVoucher = async (cartId, accessToken, axiosJWT) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}voucher/revoke`,
    { params: cartId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const editVoucherAdmin = async (data, accessToken, axiosJWT) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}voucher/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const deleteVoucherAdmin = async (id, accessToken, axiosJWT) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}voucher/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const apiVouchers = {
  getVouchers,
  getVoucherssAdmin,
  getDetailVouchers,
  createVoucherAdmin,
  useVoucher,
  revokeVoucher,
  editVoucherAdmin,
  deleteVoucherAdmin,
};

export default apiVouchers;
