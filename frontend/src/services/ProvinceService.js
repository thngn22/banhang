import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://vapi.vnappmob.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProvinces = async () => {
  try {
    const response = await axiosInstance.get("api/province/");
    return response.data.results;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

export const getDistricts = async (province_id) => {
  try {
    const response = await axiosInstance.get(
      `api/province/district/${province_id}`
    );
    return response.data.results;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

export const getWards = async (district_id) => {
  try {
    const response = await axiosInstance.get(
      `api/province/ward/${district_id}`
    );
    return response.data.results;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const addressApi = {
  getProvinces,
  getDistricts,
  getWards,
};

export default addressApi;
