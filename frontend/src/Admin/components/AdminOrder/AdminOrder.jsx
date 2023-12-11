import React, { useState } from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import { useDispatch, useSelector } from "react-redux";
// import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Modal, message } from "antd";
import * as OrderService from "../../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
// import {} from "icons"
import { Popover } from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import AdminOrderDetail from "./AdminOrderDetail";
import { updateDetailOrder } from "../../../redux/slides/orderSlice";
import { useMutationHook } from "../../../hooks/useMutationHook";

const AdminOrder = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();

  const getAllOrdersAdmin = async () => {
    const res = await OrderService.getAllOrderAdmin(auth.accessToken);
    return res;
  };
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrdersAdmin,
  });
  const mutation = useMutationHook((data) => {
    const res = OrderService.editStatusOrderAdmin(data, auth.accessToken);
    return res;
  });
  const { data, status, isSuccess, isError } = mutation;

  const [selectedRow, setSelectedRow] = useState(null);
  const [popoverFieldValue, setPopoverFieldValue] = useState(null);
  const handlePopoverClick = (orderId) => {
    console.log("Clicked on order ID in Popover:", orderId);
    // Thực hiện xử lý khi click vào dòng trong Popover, bạn có thể làm gì đó ở đây
  };
  const handlePopoverEnter = (orderId) => {
    setSelectedRow(orderId);
  };
  const handlePopoverFieldClick = (value, orderId) => {
    console.log("Clicked on Popover field:", value);
    console.log("Order ID:", orderId); // In ra id của order

    mutation.mutate({ id: orderId, status: value }, {
      onSuccess: () => {
        // Hiển thị thông báo thành công
        message.success("Chỉnh sửa sản phẩm thành công");
        // props.setIsModalOpen(false);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      onError: (error) => {
        // Hiển thị thông báo lỗi
        message.error(`Đã xảy ra lỗi: ${error.message}`);
        // props.setIsModalOpen(false);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
    });

    setPopoverFieldValue(value);
  };

  const renderAction = (key, status) => {
    const getContentBasedOnStatus = (currentStatus) => {
      switch (currentStatus) {
        case "DANG_XU_LY" || "DANG_CHO_XU_LY":
          return (
            <>
              <p
                className="font-semibold text-yellow-600"
                onClick={() => handlePopoverFieldClick("DANG_VAN_CHUYEN", key)}
              >
                Đang vận chuyển
              </p>
              <p
                className="font-semibold text-red-600"
                onClick={() => handlePopoverFieldClick("HUY", key)}
              >
                Hủy
              </p>
            </>
          );
        case "DANG_VAN_CHUYEN":
          return (
            <>
              <p
                className="font-semibold text-pink-600"
                onClick={() => handlePopoverFieldClick("DA_GIAO_HANG", key)}
              >
                Đã giao hàng
              </p>
              <p
                className="font-semibold text-gray-600"
                onClick={() => handlePopoverFieldClick("BI_TU_CHOI", key)}
              >
                Giao thất bại
              </p>
            </>
          );
        case "DA_GIAO_HANG":
          return (
            <>
              <p
                className="font-semibold text-green-600"
                onClick={() => handlePopoverFieldClick("HOAN_TAT", key)}
              >
                Hoàn tất đơn
              </p>
            </>
          );
        default:
          return null; // Trường hợp còn lại không hiển thị gì cả
      }
    };
  
    const content = getContentBasedOnStatus(status.statusOrder);

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

        <Popover content={content}>
          <EllipsisOutlined
            style={{ fontWeight: "bold", fontSize: "24px" }}
            onMouseEnter={() => handlePopoverEnter(key)}
          />
        </Popover>
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
      dataIndex: "user",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Giá đơn",
      dataIndex: "finalPayment",
      render: (text) => <p style={{ fontWeight: "bold" }}>{text}</p>,
    },
    {
      title: "Phương thức",
      dataIndex: "userPaymentMethod",
      render: (text) => (
        <p
          style={{
            fontWeight: "bold",
            textAlign: "center",
            color: text === "COD" ? "blue" : "red",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "statusOrder",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Hành động",
      dataIndex: "key",
      render: (key, status) => renderAction(key, status),
    },
  ];
  const dataTable =
    orders?.length &&
    orders.map((order) => ({
      ...order,
      key: order.id,
      user: order.user.email,
      address: `${order.address.zipCode}/${order.address.streetAddress}/${order.address.city}`,
      userPaymentMethod: order.userPaymentMethod.nameMethod,
    }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = async (orderId) => {
    try {
      const detailOrder = await OrderService.getDetailOrderAdmin(
        orderId,
        auth.accessToken
      );
      // console.log("Detail Product Data:", detailProduct);
      dispatch(updateDetailOrder({}));
      dispatch(updateDetailOrder(detailOrder));
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <WrapperHeader>Quản lý Đơn hàng</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent columns={columns} data={dataTable} />
      </div>

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { backgroundColor: "red", color: "white" },
        }}
        okText="Update"
        footer={null}
        width={800}
      >
        <AdminOrderDetail />
      </Modal>
    </div>
  );
};

export default AdminOrder;