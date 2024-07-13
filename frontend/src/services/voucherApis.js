const getVouchers = async (accessToken, axiosJWT) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}voucher/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

const getVoucherssAdmin = async (params, accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}voucher/admin`,
    {
      params,
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
  console.log(data);
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

const revokeVoucher = async (params, accessToken, axiosJWT) => {
  console.log(params);
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}voucher/revoke`,
    null, // No request body, so set to null
    {
      params, // Pass params in the config object, not the body
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

const getUserVouchers = async (axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}voucher/`,
    {}
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
  getUserVouchers,
};

export default apiVouchers;
