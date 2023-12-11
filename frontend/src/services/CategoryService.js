import axios from "axios";

const axiosJWT = axios.create();

export const getAllTreeCategory = async () => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}category/all`,
  );
  return res.data;
};
