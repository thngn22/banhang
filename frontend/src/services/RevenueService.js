export const getRevenue = async (params, accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}admin/revenue`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: params,
    }
  );
  return res.data;
};