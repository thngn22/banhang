import axios from "axios";

const axiosJWT = axios.create();

export const getAllOrderAdmin = async (accessToken) => {
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

export const getDetailOrderAdmin = async (id, accessToken) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}admin/orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const getHistoryOrderUser = async (accessToken) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}user/account/orders`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const getDetailOrderUser = async (id, accessToken) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}user/account/orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const editStatusOrderAdmin = async (data, accessToken) => {
  console.log("accessToken", accessToken);
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}admin/orders/${data.id}`,
    null, // Body là null vì bạn đang sử dụng query parameter
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        status: data.status,
      },
    }
  );

  return res.data;
};
