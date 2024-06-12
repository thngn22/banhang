import React, { useEffect, useState } from "react";
import UploadImage2 from "../../../Admin/components/UploadFile/UploadImage2";
import InputField from "../../../Customer/components/InputField";
import { message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../../services/UserService";
import { useMutationHook } from "../../../hooks/useMutationHook";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as AuthService from "../../../services/AuthService";
import { loginSuccess } from "../../../redux/slides/authSlice";
import { useNavigate } from "react-router-dom";
import { changeSuccess } from "../../../redux/slides/accessSlice";
import "./styles.css";
import {
  UserOutlined,
  FileDoneOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const ProfilePage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [userIn4, setUserIn4] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const styleInputField = {
    width: "388px",
  };

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

  const { data: profileUser, refetch } = useQuery({
    queryKey: ["profileUser"],
    queryFn: () => {
      return UserService.getProfileUser(auth?.accessToken, axiosJWT);
    },
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

  const handleChangeFirtName = (value) => {
    setUserIn4((s) => ({
      ...s,
      firstName: value,
    }));
  };
  const handleChangeLastName = (value) => {
    setUserIn4((s) => ({
      ...s,
      lastName: value,
    }));
  };
  const handleChangeAvatar = (value) => {
    setUserIn4((s) => ({
      ...s,
      avatar: value,
    }));
  };
  const handleUpdateProfile = () => {
    if (userIn4.firstName !== "" && userIn4.lastName !== "") {
      const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (
        specialCharacterRegex.test(userIn4.firstName) ||
        specialCharacterRegex.test(userIn4.lastName)
      ) {
        message.error("Tên không được chứa các ký tự đặc biệt");
      } else {
        const formData = new FormData();

        formData.append("firstName", userIn4?.firstName);
        formData.append("lastName", userIn4?.lastName);
        formData.append("avatar", userIn4?.avatar);

        mutation.mutate(formData, {
          onSuccess: (data) => {
            message.success("Cập nhật thông tin tài khoản thành công");
            refetch();
          },
          onError: (err) => {
            message.error(`Lỗi ${err}`);
          },
        });
      }
    } else {
      message.warning("Hãy nhập đầy đủ thông tin địa chỉ trước khi Đặt hàng");
    }
  };

  const handleChangePassword = () => {
    mutationChange.mutate(
      {
        email: auth?.email,
      },
      {
        onSuccess: () => {
          message.success("Đã gửi mã OTP");
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

  console.log(userIn4);

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
                {auth?.firstName} {auth?.lastName}
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <UserOutlined />
                <p>Account information</p>
              </div>
              <div className="flex items-center gap-2">
                <FileDoneOutlined />
                <p>Order management</p>
              </div>
              <div className="flex items-center gap-2">
                <HomeOutlined />
                <p>List of addresses</p>
              </div>
              <div className="flex items-center gap-2">
                <LogoutOutlined />
                <p>Log out</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 pl-8 flex">
          <div className="flex flex-col w-full">
            <p className="text-2xl font-extrabold">Information User</p>

            <div className="flex items-center mb-4">
              <p className="w-32">First Name:</p>
              <InputField
                value={userIn4?.firstName}
                handleOnChange={handleChangeFirtName}
                style={styleInputField}
              />
            </div>
            <div className="flex items-center mb-4">
              <p className="w-32">Last Name:</p>
              <InputField
                value={userIn4?.lastName}
                handleOnChange={handleChangeLastName}
                style={styleInputField}
              />
            </div>
            <div className="flex items-center mb-4">
              <p className="w-32">Email:</p>
              <InputField
                disable={true}
                value={userIn4?.email}
                style={styleInputField}
              />
            </div>
            <div className="flex items-center mb-4">
              <p className="w-32">Phone number:</p>
              <InputField
                disable={true}
                value={userIn4?.phone}
                style={styleInputField}
              />
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-4 pl-8 mt-12">
          <button
            className="px-4 py-4 bg-black text-white text-lg hover:opacity-80 rounded-xl font-medium"
            onClick={handleUpdateProfile}
          >
            Update User Infor
          </button>
          <button
            className="px-4 py-4 bg-red-600 text-white text-lg hover:opacity-80 rounded-xl font-medium"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
