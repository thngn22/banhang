import axios from "axios";

const axiosJWT = axios.create();

export const getProfileUser = async (accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}user/account/profile`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const getProfileUserInLogin = async (accessToken) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}user/account/profile`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const editProfileUser = async (data, accessToken, axiosJWT) => {
  console.log("data", data);
  console.log("accessToken", accessToken);
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}user/account/profile`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

//Mới viết
export const getAllUser = async (accessToken, axiosJWT) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}admin/users`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

export const changeStatusUser = async (id, accessToken, axiosJWT) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}admin/users/active`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        id: id,
      },
    }
  );

  return res.data;
};
