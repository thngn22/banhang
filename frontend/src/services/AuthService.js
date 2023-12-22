import axios from "axios";

export const refreshToken = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}auth/refresh`,
    null,
    {
      withCredentials: true,
    }
  );

  console.log("data", res.data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}auth/login`,
    data
  );
  return res.data;
};

export const signUp = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}auth/register`,
    data
  );
  return res.data;
};

export const sendOTP = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}auth/sendOTP`,
    data
  );
  return res.data;
};

export const logout = async (accessToken, axiosJWT) => {
  console.log("accessToken", accessToken);
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}auth/logout`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
