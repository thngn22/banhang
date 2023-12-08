import axios from "axios";

export const refreshToken = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}auth/refreshToken`,
    data
  );
  return res.data;
};
