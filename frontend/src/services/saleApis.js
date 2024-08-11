const getSalesAdmin = async (params, accessToken, axiosJWT) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}sale`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

const getSaleDetailAdmin = async (id, accessToken, axiosJWT) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}sale/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

const createSaleAdmin = async (data, accessToken, axiosJWT) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}sale/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const editSaleAdmin = async (data, accessToken, axiosJWT) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}sale/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const deleteSaleAdmin = async (id, accessToken, axiosJWT) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}sale/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const getProductByCateWithoutCreate = async (params, accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}category/with_out_flash_sale_create`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const getProductByCateWithoutEdit = async (params, accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}category/with_out_flash_sale_edit`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const apiSales = {
  getSalesAdmin,
  getSaleDetailAdmin,
  createSaleAdmin,
  editSaleAdmin,
  deleteSaleAdmin,
  getProductByCateWithoutCreate,
  getProductByCateWithoutEdit,
};

export default apiSales;
