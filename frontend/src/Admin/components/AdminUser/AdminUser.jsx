import React from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import { useSelector } from "react-redux";
import * as UserService from "../../../services/UserService";
import { useQuery } from "@tanstack/react-query";

import { DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { message } from "antd";

const AdminUser = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);

  const getAllUser = async () => {
    const res = await UserService.getAllUser(auth.accessToken);
    return res;
  };
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUser,
  });
  // console.log("users", users)
  const mutation = useMutationHook((data) => {
    const res = UserService.changeStatusUser(data, auth.accessToken);
    return res;
  });
  const { data, status, isSuccess, isError } = mutation;

  const inActiveORActive = async (id) => {
    console.log("key delete", id);

    mutation.mutate(id, {
      onSuccess: () => {
        // Hiển thị thông báo thành công
        message.success("Chỉnh sửa trạng thái thành công");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      onError: (error) => {
        // Hiển thị thông báo lỗi
        message.error(`Đã xảy ra lỗi: ${error.message}`);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
    });
  };

  const renderAction = (key, user) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        {user.active ? (
          <DeleteOutlined
            style={{ color: "red", fontSize: "26px", cursor: "pointer" }}
            onClick={() => inActiveORActive(key)}
          />
        ) : (
          <CheckCircleOutlined
            style={{ color: "green", fontSize: "26px", cursor: "pointer" }}
            onClick={() => inActiveORActive(key)}
          />
        )}
      </div>
    );
  };

  const columns = [
    {
      title: "Mã người dùng",
      dataIndex: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => <a>{text}</a>,
    },
    // {
    //   title: "User Image",
    //   dataIndex: "userImage",
    //   render: (userImage) => (
    //     <img
    //       src={userImage}
    //       alt="userImage"
    //       style={{ maxWidth: "50px", maxHeight: "50px" }}
    //     />
    //   ),
    // },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Active",
      dataIndex: "active",
      render: (active) => (
        <span style={{ color: active ? "green" : "red", fontWeight: "bold" }}>
          {active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "key",
      render: (key, product) => renderAction(key, product),
    },
  ];

  const dataTable =
    users?.length &&
    users.map((product) => {
      return { ...product, key: product.id };
    });

  return (
    <div>
      <WrapperHeader>Quản lý Người dùng</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent data={dataTable} columns={columns} />
      </div>
    </div>
  );
};

export default AdminUser;
