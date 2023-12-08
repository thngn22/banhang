import React, { useState } from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import { useSelector } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Modal } from "antd";
import * as OrderService from "../../../services/OrderService"
import { useQuery } from "@tanstack/react-query";


const AdminOrder = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);

  const getAllOrdersAdmin = async () => {
    const res = await OrderService.getAllOrder(auth.accessToken);
    return res;
  };
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrdersAdmin,
  });


  const renderAction = (key) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <DeleteOutlined
          style={{ color: "red", fontSize: "26px", cursor: "pointer" }}
          onClick={() => inActive(key)}
        />
        <EditOutlined
          style={{ color: "blue", fontSize: "26px", cursor: "pointer" }}
          onClick={() => showModal(key)}
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Người mua",
      dataIndex: "userId",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Giá đơn",
      dataIndex: "finalPayment",
    },
    {
      title: "Phương thức",
      dataIndex: "userPaymentMethod",
    },
    {
      title: "Tình trạng",
      dataIndex: "statusOrder",
      render: (text) => <a>{text}</a>
    },
    {
      title: "Hành động",
      dataIndex: "key",
      // render: (key) => renderAction(key),
    },
  ];

  const dataTable =
    orders?.length &&
    orders.map((order) => {
      return { ...orders, key: orders.id };
    });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const inActive = async (key)=>{
    console.log("key delete",key);

    // try {
    //   const deleteProduct = await ProductService.deleteProduct({key}, auth.accessToken);
    //   console.log("Detail Product Data:", deleteProduct);
    //   // Do something with the detailProduct data if needed
    // } catch (error) {
    //   console.error("Error fetching product details:", error);
    // }
  }

  const showModal = async (key) => {
    console.log("key edit", key);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleRowClick = async (productId) => {

  };

  return (
    <div>
      <WrapperHeader>Quản lý Đơn hàng</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent columns={columns} data={dataTable} onRowClick={handleRowClick} />
      </div>

      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "red", color: "white" },
        }}
        okText="Update"
        footer={null}
        width={1000}
      >
      </Modal>
    </div>
  );
};

export default AdminOrder;
