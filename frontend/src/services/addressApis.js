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

const apiAddresses = {
  getAddressByUserAdmin,
};

export default apiAddresses;
