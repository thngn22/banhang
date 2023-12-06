import axios from "axios";

const axiosJWT = axios.create();

export const updateCart = async (data, accessToken) => {
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}cart/`,
        data,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return res.data;
};
export const getCartItems = async (accessToken) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}cart/`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return res.data;
};