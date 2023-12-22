import axios from "axios";

export const getAllTreeCategory = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}category/all`,
  );
  return res.data;
};
