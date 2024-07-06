import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import createAxiosInstance from "../../../services/createAxiosInstance";
import { useQuery } from "@tanstack/react-query";
import * as UserService from "../../../services/UserService";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { message, Modal, Pagination, Select } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import TableComponent from "../../components/TableComponent/TableComponent";
import apiAddresses from "../../../services/addressApis.js";
import { detailAddressList } from "../../../redux/slides/addressSlice.js";
import DetailAddressList from "./DetailAddressList.jsx";

const AddressManagementPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [pageNumber, setPageNumber] = useState(1);
  const [dataTable, setDataTable] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const mutationDetailAddress = useMutationHook((data) => {
    const res = apiAddresses.getAddressByUserAdmin(
      data,
      auth.accessToken,
      axiosJWT
    );
    return res;
  });
  const { data: dataDetail } = mutationDetailAddress;
  useEffect(() => {
    if (dataDetail) dispatch(detailAddressList(dataDetail));
  }, [dataDetail]);

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
    mutationDetailAddress.mutate(key);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    dispatch(detailAddressList(null));
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    dispatch(detailAddressList(null));
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
        {isModalOpen && <DetailAddressList />}
      </Modal>
    </div>
  );
};

export default AddressManagementPage;
