import axios from "axios";

export const getListChatUsers = async (accessToken, axiosJWT) => {
  const res = await axiosJWT.get("http://localhost:7586/users", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export const findChatMessages = async (params, accessToken, axiosJWT) => {
  const res = await axiosJWT.get("http://localhost:7586/messages", {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
