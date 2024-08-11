import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import createAxiosInstance from "../../../services/createAxiosInstance";
import { useQuery } from "@tanstack/react-query";
import * as UserService from "../../../services/UserService";
import { Modal, Pagination, Select } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import TableComponent from "../../components/TableComponent/TableComponent";
import DetailAddressList from "./DetailAddressList.jsx";

const AddressManagementPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataTable, setDataTable] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idUser, setIdUser] = useState();

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

  const renderAction = (key, user) => {
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
          onClick={() => showModal(key)}
        />
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
      title: "Hành động",
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

  const showModal = async (key) => {
    setIdUser(key);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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

      <Modal
        title="Chi tiết địa chỉ"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "red", color: "white" },
        }}
        okText="Update"
        footer={null}
        width={700}
      >
        {isModalOpen && <DetailAddressList idUser={idUser} />}
      </Modal>
    </div>
  );
};

export default AddressManagementPage;
