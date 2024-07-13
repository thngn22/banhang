import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as AuthService from "./AuthService";
import { loginSuccess } from "../redux/slides/authSlice";

const createAxiosInstance = (auth, dispatch) => {
  const axiosInstance = axios.create();

  const refreshToken = async () => {
    try {
      const data = await AuthService.refreshToken();
      return data?.accessToken;
    } catch (err) {
      console.log("err", err);
    }
  };

  axiosInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      if (auth?.accessToken) {
        const decodAccessToken = jwtDecode(auth?.accessToken);
        if (decodAccessToken.exp < date.getTime() / 1000) {
          const newAccessToken = await refreshToken();
          const refreshUser = {
            ...auth,
            accessToken: newAccessToken,
          };

          dispatch(loginSuccess(refreshUser));
          config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        } else {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;
