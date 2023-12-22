import axios from "axios";

export const getSizeInCate = async (params) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}category/size`, {
    params,
  });
  return res.data;
};

export const getColorInCate = async (params) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}category/color`,
    {
      params,
    }
  );
  return res.data;
};
