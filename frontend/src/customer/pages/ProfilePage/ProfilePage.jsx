import React, { useEffect, useState } from "react";
import UploadImage2 from "../../../Admin/components/UploadFile/UploadImage2";
import { message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../../services/UserService";
import { useMutationHook } from "../../../hooks/useMutationHook";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as AuthService from "../../../services/AuthService";
import * as OrderService from "../../../services/OrderService";
import { loginSuccess } from "../../../redux/slides/authSlice";
import { useNavigate } from "react-router-dom";
import { changeSuccess } from "../../../redux/slides/accessSlice";
import "./styles.css";
import {
  UserOutlined,
  FileDoneOutlined,
  HomeOutlined,
  LogoutOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import HistoryOrder from "./HistoryOrder";
import AddressUsers from "./AddressUsers";
import UpdateProfile from "./UpdateProfile";
import Default from "./Default";

const ProfilePage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [userIn4, setUserIn4] = useState();
  const [selected, setSelected] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const data = await AuthService.refreshToken();
      return data?.accessToken;
    } catch (err) {
      console.log("err", err);
    }
  };
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      if (auth?.accessToken) {
        const decodAccessToken = jwtDecode(auth?.accessToken);
        if (decodAccessToken.exp < date.getTime() / 1000) {
          const data = await refreshToken();
          const refreshUser = {
            ...auth,
            accessToken: data,
          };

          dispatch(loginSuccess(refreshUser));
          config.headers["Authorization"] = `Bearer ${data}`;
        }
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const { data: profileUser, refetch: refetchProfileUser } = useQuery({
    queryKey: ["profileUser"],
    queryFn: () => {
      return UserService.getProfileUser(auth?.accessToken, axiosJWT);
    },
  });

  const { data: historyOrder, refetch: refetchHistoryOrder } = useQuery({
    queryKey: ["historyOrder"],
    queryFn: () => {
      return OrderService.getHistoryOrderUser(auth.accessToken, axiosJWT);
    },
    retry: false,
    enabled: Boolean(auth?.accessToken),
  });

  const mutation = useMutationHook((data) => {
    const res = UserService.editProfileUser2(data, auth?.accessToken, axiosJWT);
    return res;
  });
  const mutationChange = useMutationHook((data) => {
    const res = AuthService.sendOTP2(data);
    return res;
  });

  useEffect(() => {
    if (profileUser) {
      setUserIn4(profileUser);
    }
  }, [profileUser]);

  const handleChangeAvatar = (value) => {
    setUserIn4((s) => ({
      ...s,
      avatar: value,
    }));
  };

  const handleChangeData = (type, value) => {
    setUserIn4((s) => ({
      ...s,
      [type]: value,
    }));
  };
  console.log(userIn4);

  const handleSelected = (value) => {
    setSelected(value);
  };

  const handleUpdateProfile = () => {
    const formData = new FormData();

    formData.append("firstName", userIn4?.firstName);
    formData.append("lastName", userIn4?.lastName);
    formData.append("avatar", userIn4?.avatar);
    formData.append("phoneNumber", userIn4?.phone);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    mutation.mutate(formData, {
      onSuccess: () => {
        message.success("Successed");
        refetchProfileUser();
      },
      onError: (err) => {
        message.error(`Error ${err}`);
      },
    });
  };

  const handleChangePassword = () => {
    mutationChange.mutate(
      {
        email: auth?.email,
      },
      {
        onSuccess: () => {
          message.success("Sended OTP");
          dispatch(
            changeSuccess({
              email: auth?.email,
            })
          );
          navigate(`/otp/change/${"changePassword"}`);
        },
        onError: (error) => {
          message.error(`Lỗi ${error.message}`);
        },
      }
    );
  };

  const renderPage = (key) => {
    switch (key) {
      case "updateUser":
        return (
          <UpdateProfile
            userIn4={userIn4}
            handleChangeData={handleChangeData}
            handleUpdateProfile={handleUpdateProfile}
          />
        );
      case "historyOrder":
        return (
          <HistoryOrder data={historyOrder} refetch={refetchHistoryOrder} />
        );
      case "addressUsers":
        return <AddressUsers />;
      default:
        return (
          <>
            <Default userIn4={userIn4} handleSelected={handleSelected} />
            <HistoryOrder data={historyOrder} refetch={refetchHistoryOrder} />
          </>
        );
    }
  };

  return (
    <div className="px-56 py-10">
      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <div className="profile bg-gray-100 flex flex-col items-center justify-between py-8 rounded-xl">
            <UploadImage2
              onImageChange={handleChangeAvatar}
              dataImage={userIn4?.avatar}
              isEdit={true}
            />

            <div className="flex gap-2 text-xl">
              <p>Hello </p>
              <p className="font-medium">
                {userIn4?.firstName} {userIn4?.lastName}
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-4 text-sm">
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-70"
                onClick={() => handleSelected("")}
              >
                <UserOutlined />
                <p>Account information</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-70"
                onClick={() => handleSelected("historyOrder")}
              >
                <FileDoneOutlined />
                <p>Order management</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-70"
                onClick={() => handleSelected("addressUsers")}
              >
                <HomeOutlined />
                <p>List of addresses</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-70"
                onClick={handleChangePassword}
              >
                <KeyOutlined />
                <p>Change Password</p>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-70">
                <LogoutOutlined />
                <p>Log out</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3">{renderPage(selected)}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
