import axios from "axios";

export const getAllTreeCategory = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}category/all`);
  return res.data;
};

export const getChildCate = async (id, accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}category/${id}/nested`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const createCate = async (data, accessToken, axiosJWT) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}category/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const updateCate = async (data, accessToken, axiosJWT) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}category/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const deleteCate = async (id, accessToken, axiosJWT) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}category/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
