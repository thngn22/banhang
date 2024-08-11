import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../../services/UserService";
import { useQuery } from "@tanstack/react-query";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { Pagination, Select, Modal, message } from "antd";
import { DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
import TableComponent from "../../components/TableComponent/TableComponent";
import { Option } from "antd/es/mentions";
import createAxiosInstance from "../../../services/createAxiosInstance";

const UsersManagementPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataTable, setDataTable] = useState([]);
  const [idUserSearch, setIdUserSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const { data: users, refetch } = useQuery({
    queryKey: [pageNumber, idUserSearch, emailSearch, activeSearch],
    queryFn: () => {
      return UserService.getAllUser(
        {
          page_number: pageNumber,
          user_id: idUserSearch,
          email: emailSearch,
          state: activeSearch,
        },
        auth.accessToken,
        axiosJWT
      );
    },
    enabled: Boolean(auth?.accessToken),
  });

  useEffect(() => {
    const filterUsers =
      users?.contents?.length &&
      users?.contents?.map((user) => {
        return { ...user, key: user.id };
      });

    setDataTable(filterUsers);
  }, [users]);

  const mutation = useMutationHook((data) => {
    const res = UserService.changeStatusUser(data, auth.accessToken, axiosJWT);
    return res;
  });

  const inActiveORActive = async (id) => {
    mutation.mutate(id, {
      onSuccess: () => {
        // Hiển thị thông báo thành công
        message.success("Chỉnh sửa trạng thái thành công");
        refetch({ queryKey: ["users"] });
      },
      onError: (error) => {
        // Hiển thị thông báo lỗi
        message.error(`Đã xảy ra lỗi: ${error.message}`);
        refetch({ queryKey: ["users"] });
      },
    });
  };

  const confirmInActive = (id) => {
    Modal.confirm({
      title:
        "Thao tác này sẽ không thể thay đổi. Bạn có chắc chắn với quyết định này?",
      okText: "OK",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => inActiveORActive(id),
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
        {user.active && (
          <DeleteOutlined
            style={{ color: "red", fontSize: "26px", cursor: "pointer" }}
            onClick={() => confirmInActive(key)}
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

  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-extrabold">Quản lý người dùng</p>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-4">
          <div>
            <label htmlFor="idUser">Mã người dùng:</label>
            <input
              type="text"
              id="idUser"
              className="ml-2 py-1 px-2 rounded-lg"
              value={idUserSearch}
              onChange={(e) => setIdUserSearch(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              className="ml-2 py-1 px-2 rounded-lg"
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="status">Tình trạng:</label>
            <Select
              className="filter__product"
              value={activeSearch}
              defaultValue={""}
              onChange={(value) => setActiveSearch(value)}
            >
              <Option value="">Không lọc</Option>
              <Option value="true">Active</Option>
              <Option value="false">Inactive</Option>
            </Select>
          </div>
        </div>
      </div>

      <TableComponent data={dataTable} columns={columns} />

      <div className="flex justify-center mt-2">
        {users && (
          <Pagination
            total={users?.totalElements}
            pageSize={users?.pageSize}
            defaultCurrent={pageNumber}
            showSizeChanger={false}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
};

export default UsersManagementPage;
