import axios from "axios";

const axiosJWT = axios.create();

export const getAllOrder = async (accessToken) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}admin/orders`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};


export const getDetailOrder = async (id, accessToken) => {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  };