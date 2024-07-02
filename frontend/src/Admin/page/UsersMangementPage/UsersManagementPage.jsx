import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../../services/UserService";
import * as AuthService from "../../../services/AuthService";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import { useQuery } from "@tanstack/react-query";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { Pagination, Select, message } from "antd";
import { DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
import TableComponent from "../../components/TableComponent/TableComponent";
import { Option } from "antd/es/mentions";

const UsersManagementPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const [dataTable, setDataTable] = useState([]);

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

  const { data: users, refetch } = useQuery({
    queryKey: [pageNumber],
    queryFn: () => {
      return UserService.getAllUser(
        {
          page_number: pageNumber,
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
    console.log("key delete", id);

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

  const handleFilterProduct = () => {
    console.log("onclickFilter");
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
            <input type="text" id="idUser" className="ml-2 py-1 rounded-lg" />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" className="ml-2 py-1 rounded-lg" />
          </div>

          <div>
            <label htmlFor="status">Tình trạng:</label>
            <Select className="filter__product">
              <Option value="active">Active</Option>
              <Option value="inActive">Inctive</Option>
            </Select>
          </div>
        </div>
        <button
          className="text-white bg-black py-1 px-8 border border-transparent rounded-md font-bold tracking-wide cursor-pointer hover:opacity-70"
          onClick={handleFilterProduct}
        >
          Lọc
        </button>
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
