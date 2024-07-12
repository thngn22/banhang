const getAddressByUserAdmin = async (id, params, accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}admin/user_address/${id}`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const getAddressUser = async (accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}user/account/address`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const createAddressUser = async (data, accessToken, axiosJWT) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}user/account/address`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const deleteAddressUser = async (id, accessToken, axiosJWT) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}user/account/address/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const updateAddressUser = async (data, accessToken, axiosJWT) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}user/account/address`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const apiAddresses = {
  getAddressByUserAdmin,
  getAddressUser,
  createAddressUser,
  deleteAddressUser,
  updateAddressUser,
};

export default apiAddresses;
