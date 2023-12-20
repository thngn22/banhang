import React, { useEffect, useState } from "react";
import { WrapperHeader } from "./style";
import UploadImage from "../../../Admin/components/UploadFile/UploadImage";
import InputField from "../../../customer/components/InputField";
import { Button, message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../../services/UserService";
import { useMutationHook } from "../../../hooks/useMutationHook";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as AuthService from "../../../services/AuthService";
import { loginSuccess } from "../../../redux/slides/authSlice";

const ProfilePage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [userIn4, setUserIn4] = useState();
  const dispatch = useDispatch();

  const styleInputField = {
    width: "388px",
  };
  const titleSpanStyle = {
    textAlign: "left",
    width: "100px", // Độ dài cố định của các span "Tiêu đề"
    marginRight: "10px", // Khoảng cách 10px giữa span "Tiêu đề" và InputField
    fontWeight: "bold",
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
    const res = UserService.editProfileUser(data, auth?.accessToken, axiosJWT);
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
        mutation.mutate(
          {
            firstName: userIn4.firstName,
            lastName: userIn4.lastName,
            avatar: userIn4.avatar,
            dob: "",
          },
          {
            onSuccess: (data) => {
              message.success("Cập nhật thông tin tài khoản thành công");
              refetch();
            },
            onError: (err) => {
              message.error(`Lỗi ${err}`);
            },
          }
        );
      }
    } else {
      message.warning("Hãy nhập đầy đủ thông tin địa chỉ trước khi Đặt hàng");
    }
  };

  return (
    <div
      style={{ minHeight: "70vh", backgroundColor: "rgba(169, 169, 169, 0.2)" }}
    >
      <div
        style={{
          height: "100%",
          padding: "10px 120px",
          margin: "0 10rem",
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        <section className="text-2xl text-left font-semibold mt-2">
          Thông tin người dùng
        </section>
        <hr class="w-full mb-4 mt-1 border-t border-gray-300" />
        <img
          style={{ height: "480px", position: "absolute", right: "25px" }}
          src="https://cdn.printgo.vn/uploads/media/774255/logo-giay-1_1586510617.jpg"
          alt="https://cdn.printgo.vn/uploads/media/774255/logo-giay-1_1586510617.jpg"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <UploadImage
            onImageChange={handleChangeAvatar}
            dataImage={userIn4?.avatar}
            isEdit={true}
          />
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={titleSpanStyle}>Họ:</span>
              <InputField
                value={userIn4?.firstName}
                handleOnChange={handleChangeFirtName}
                style={styleInputField}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={titleSpanStyle}>Tên:</span>
              <InputField
                value={userIn4?.lastName}
                handleOnChange={handleChangeLastName}
                style={styleInputField}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={titleSpanStyle}>Email:</span>
              <InputField
                disable={true}
                value={userIn4?.email}
                style={styleInputField}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={titleSpanStyle}>SĐT:</span>
              <InputField
                disable={true}
                value={userIn4?.phone}
                style={styleInputField}
              />
            </div>
          </div>
        </div>

        <Button
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginTop: "16px",
            backgroundColor: "blue",
            color: "white",
            fontWeight: "600",
            fontSize: "18px",
            height: "50px",
            padding: "10px",
          }}
          onClick={handleUpdateProfile}
        >
          <span>Cập nhập thông tin tài khoản</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
