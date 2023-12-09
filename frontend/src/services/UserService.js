import axios from "axios";

const axiosJWT = axios.create();

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

export const getProfileUser = async (accessToken) => {
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


//Mới viết
export const getAllUser = async (accessToken) => {
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