import axios from "axios";

const axiosJWT = axios.create();

export const getAllOrderAdmin = async (accessToken, axiosJWT) => {
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

export const getHistoryOrderUser = async (accessToken, axiosJWT) => {
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

export const getDetailOrderUser = async (id, accessToken, axiosJWT) => {
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
export const cancelOrder = async (id, accessToken, axiosJWT) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}user/account/orders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
export const confirmOrder = async (id, accessToken, axiosJWT) => {
  console.log("accessToken", accessToken);
  console.log("id", id);
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}user/account/orders/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
export const ratingProductOrdered = async (orderId, data, accessToken) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}user/account/orders/${orderId}/rating`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
export const getRatingProductOrdered = async (orderId, accessToken) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}user/account/orders/${orderId}/rating`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
export const editStatusOrderAdmin = async (data, accessToken, axiosJWT) => {
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
