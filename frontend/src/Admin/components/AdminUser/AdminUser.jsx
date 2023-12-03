import React from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import { useSelector } from "react-redux";
import * as UserService from "../../../services/UserService";
import { useQuery } from "@tanstack/react-query";

import { EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";

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

  console.log("users", users);

  const renderAction = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <QuestionCircleOutlined
          style={{ color: "#000", fontSize: "26px", cursor: "pointer" }}
        />
        <EditOutlined
          style={{ color: "blue", fontSize: "26px", cursor: "pointer" }}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "User Image",
      dataIndex: "userImage",
      render: (userImage) => (
        <img
          src={userImage}
          alt="userImage"
          style={{ maxWidth: "50px", maxHeight: "50px" }}
        />
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Active",
      dataIndex: "active",
      render: (active) => (
        <p style={{ color: active ? "orange" : "gray" }}>
          {active ? "Active" : "Inactive"}
        </p>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
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
