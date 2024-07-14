import React, { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Pagination, Select } from "antd";
import * as OrderService from "../../../services/OrderService";
import { useQuery } from "@tanstack/react-query";

import { QuestionCircleOutlined } from "@ant-design/icons";
import AdminOrderDetail from "../../components/AdminOrder/AdminOrderDetail";
import { updateDetailOrder } from "../../../redux/slides/orderSlice";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import * as AuthService from "../../../services/AuthService";
import { Option } from "antd/es/mentions";

const OrdersManagementPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const [dataTable, setDataTable] = useState([]);

  const refreshToken = async () => {
    try {
      const data = await AuthService.refreshToken();
      // console.log("data", data);
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

          // console.log("data in axiosJWT", data);
          // console.log("refreshUser", refreshUser);

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

  const { data: orders, refetch } = useQuery({
    queryKey: [pageNumber],
    queryFn: () => {
      return OrderService.getAllOrderAdmin(
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
    if (orders) {
      const filterOrders =
        orders?.contents?.length &&
        orders?.contents?.map((order) => {
          return {
            ...order,
            key: order.id,
            user: order.user?.email,
            address: `${order.address?.address}, ${order.address?.ward}, ${order.address?.district}, ${order.address?.city}`,
            userPaymentMethod: order.userPaymentMethod?.nameMethod,
          };
        });

      setDataTable(filterOrders);
    }
  }, [orders]);

  const renderAction = (key, status) => {
    return (
      <div style={{ textAlign: "center" }}>
        <QuestionCircleOutlined
          style={{ color: "#000", fontSize: "26px", cursor: "pointer" }}
          onClick={() => showModal(key)}
        />
      </div>
    );
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "DANG_CHO_XU_LY":
        return { text: "Đang xử lý", color: "gray" };
      case "DANG_XU_LY":
        return { text: "Đang xử lý", color: "gray" };
      case "DA_BI_NGUOI_DUNG_HUY":
        return { text: "Hủy", color: "red" };
      case "DA_BI_HE_THONG_HUY":
        return { text: "Hệ thống hủy", color: "red" };
      case "DANG_VAN_CHUYEN":
        return { text: "Đang vận chuyển", color: "yellow" };
      case "DA_GIAO_HANG":
        return { text: "Đã giao hàng", color: "pink" };
      case "BI_TU_CHOI":
        return { text: "Bị từ chối", color: "red" };
      case "DA_HOAN_TIEN":
        return { text: "Đã hoàn tiền", color: "red" };
      default:
        return { text: "Hoàn tất", color: "green" };
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      render: (text) => <a>{text}</a>,
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 2,
      },
    },
    {
      title: "Người mua",
      dataIndex: "user",
      render: (text) => <a>{text}</a>,
      sorter: {
        compare: (a, b) => a.user.localeCompare(b.user),
        multiple: 2,
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Giá đơn",
      dataIndex: "finalPayment",
      render: (text) => (
        <p style={{ fontWeight: "bold" }}>
          {text?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
      ),
      sorter: {
        compare: (a, b) => a.finalPayment - b.finalPayment,
        multiple: 2,
      },
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
      render: (text) => {
        const { text: displayText, color } = getStatusDisplay(text);
        return (
          <p style={{ color: color, fontWeight: "bold" }}>{displayText}</p>
        );
      },
      sorter: {
        compare: (a, b) => a.statusOrder.localeCompare(b.statusOrder),
        multiple: 2,
      },
    },
    {
      title: "Hành động",
      dataIndex: "key",
      render: (key, status) => renderAction(key, status),
    },
  ];

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
  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  const handleFilterProduct = () => {
    console.log("onclickFilter");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-extrabold">Quản lý đơn hàng</p>
      </div>

      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-1">
              <label htmlFor="name">Mã đơn:</label>
              <input type="text" id="name" className="py-1 rounded-lg" />
            </div>

            <div className="flex gap-1">
              <label htmlFor="cate">Email:</label>
              <input type="text" id="cate" className="py-1 rounded-lg" />
            </div>

            <div className="flex gap-1">
              <label htmlFor="number">Địa chỉ:</label>
              <input type="text" id="number" className="py-1 rounded-lg" />
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <div className="flex gap-1">
              <label htmlFor="status">Tình trạng:</label>
              <Select className="filter__product">
                <Option value="active">Active</Option>
                <Option value="inActive">Inctive</Option>
              </Select>
            </div>

            <div className="flex gap-1">
              <label htmlFor="paymentMethod">Phương thức thanh toán:</label>
              <Select className="filter__product">
                <Option value="COD">COD</Option>
                <Option value="VnPay">VnPay</Option>
              </Select>
            </div>
          </div>
        </div>

        <button
          className="text-white bg-black py-1 px-8 border border-transparent rounded-md font-bold tracking-wide cursor-pointer hover:opacity-70"
          onClick={handleFilterProduct}
        >
          Lọc
        </button>
      </div>

      <TableComponent columns={columns} data={dataTable} />

      <div className="flex justify-center mt-2">
        {orders && (
          <Pagination
            total={orders?.totalElements}
            pageSize={orders?.pageSize}
            defaultCurrent={pageNumber}
            showSizeChanger={false}
            onChange={onChange}
          />
        )}
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
        <AdminOrderDetail
          auth={auth}
          setIsModalOpen={setIsModalOpen}
          refetch={refetch}
        />
      </Modal>
    </div>
  );
};

export default OrdersManagementPage;