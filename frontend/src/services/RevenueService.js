export const getRevenue = async (accessToken, axiosJWT) => {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL}admin/revenue`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  };