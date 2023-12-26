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
    `${process.env.REACT_APP_API_URL}auth/check_otp_login`,
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
export const sendOTP2 = async (data) => {
  console.log("da vao dc sendOTP2", data);
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}auth/send_otp`,
    data
  );
  return res.data;
};
export const changePassword = async (accessToken, data, axiosJWT) => {
  console.log("accessToken", accessToken);
  console.log("data", data);
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}auth/change_password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
export const forgotPassword = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}auth/forgot_password`,
    data
  );
  return res.data;
};
