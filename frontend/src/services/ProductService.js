import axios from "axios";

const axiosJWT = axios.create();

export const getAllProduct = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}product/2`);
  return res.data;
};

export const getAllProductUser = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}product/`);
  return res.data;
};
export const getAllProductByCategory = async (params) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}category`, {
    params,
  });
  return res.data;
};
export const getFilterProduct = async (params) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}product/search`,
    {
      params,
    }
  );
  return res.data;
};
export const getProductDetail = async (productId) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}product/${productId}`
  );
  return res.data;
};
export const getProductAdmin = async (params, accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}admin/products`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const createProduct = async (data, accessToken, axiosJWT) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}product/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const createProduct2 = async (data, accessToken, axiosJWT) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}product/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const editProduct = async (data, accessToken, axiosJWT) => {
  console.log("data", data);
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}product/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const deleteProduct = async (data, accessToken) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}product/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const getDetailProduct = async (id, accessToken) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}product/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const getDetailProductForAdmin = async (id, accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}admin/products/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const changeStatusProduct = async (id, accessToken, axiosJWT) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}product/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const getProductTopRatingHome = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}product/carousel_rating`
  );
  return res.data;
};
export const getProductTopSoldHome = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}product/carousel_sold`
  );
  return res.data;
};
export const getProductTopInDetail = async (params) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}product/carousel_product`,
    {
      params,
    }
  );
  return res.data;
};

export const getProductsRS = async (params, accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}product/recommend`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const getProductSales = async (params) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}sale/all`, {
    params,
  });
  return res.data;
};

export const getMiniSearchProducts = async (params) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}product/mini_search`,
    {
      params,
    }
  );
  return res.data;
};
