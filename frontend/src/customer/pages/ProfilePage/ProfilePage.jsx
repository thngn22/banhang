import React, { useEffect, useState } from "react";
import UploadImage2 from "../../../Admin/components/UploadFile/UploadImage2";
import { message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../../services/UserService";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as AuthService from "../../../services/AuthService";
import { changeSuccess } from "../../../redux/slides/accessSlice";
import { useNavigate } from "react-router-dom";
import createAxiosInstance from "../../../services/createAxiosInstance";
import UpdateProfile from "./UpdateProfile";
import AddressUsers from "./AddressUsers";
import Default from "./Default";
import "./styles.css";
import { updateUser } from "../../../redux/slides/userSlide";
import { updateAuth } from "../../../redux/slides/authSlice";

const ProfilePage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [userIn4, setUserIn4] = useState({});
  const [selected, setSelected] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxiosInstance(auth, dispatch);

  const { data: profileUser, refetch: refetchProfileUser } = useQuery({
    queryKey: ["profileUser"],
    queryFn: () => UserService.getProfileUser(auth?.accessToken, axiosJWT),
  });

  const mutation = useMutationHook((data) =>
    UserService.editProfileUser2(data, auth?.accessToken, axiosJWT)
  );

  const mutationChange = useMutationHook((data) => AuthService.sendOTP2(data));

  useEffect(() => {
    if (profileUser) {
      setUserIn4(profileUser);
      dispatch(updateUser(profileUser));
      dispatch(updateAuth(profileUser))
    }
  }, [profileUser]);

  const handleChangeAvatar = (value) => {
    setUserIn4((prev) => ({
      ...prev,
      avatar: value,
    }));
  };

  const handleChangeData = (type, value) => {
    setUserIn4((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleUpdateProfile = (data) => {
    const formData = new FormData();

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("phoneNumber", data.phone);
    if (userIn4.avatar) {
      if (userIn4.avatar instanceof File) {
        formData.append("avatar", userIn4.avatar);
      }
    }

    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    mutation.mutate(formData, {
      onSuccess: () => {
        message.success("Cập nhật thành công");
        refetchProfileUser();
      },
      onError: (err) => {
        console.error(`Lỗi ${err.message}`);
        message.error("Cập nhật không thành công");
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
          message.success("Đã gửi OTP");
          dispatch(changeSuccess({ email: auth?.email }));
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
            handleSelected={setSelected}
          />
        );
      case "addressUsers":
        return <AddressUsers />;
      default:
        return <Default userIn4={userIn4} handleSelected={setSelected} />;
    }
  };

  return (
    <div className="px-56 py-10">
      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <div className="profile bg-gray-100 flex flex-col items-center justify-between py-8 rounded-xl">
            <UploadImage2
              onImageChange={handleChangeAvatar}
              dataImage={userIn4.avatar}
              isEdit={true}
            />
            <div className="flex gap-2">
              <p>Xin chào</p>
              <p className="font-medium">
                {userIn4.firstName} {userIn4.lastName}
              </p>
            </div>
            <div className="flex flex-col gap-4 mt-4 text-sm">
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-70"
                onClick={() => setSelected("")}
              >
                <p>Thông tin tài khoản</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-70"
                onClick={() => setSelected("addressUsers")}
              >
                <p>Danh sách địa chỉ</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-70"
                onClick={handleChangePassword}
              >
                <p>Đổi mật khẩu</p>
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
