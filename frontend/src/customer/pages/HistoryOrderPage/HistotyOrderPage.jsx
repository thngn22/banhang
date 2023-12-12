import React, { useState } from "react";
import { WrapperHeader } from "./style";
import UploadImage from "../../../Admin/components/UploadFile/UploadImage";
import InputField from "../../components/InputField";
import { Button, Modal } from "antd";
import OrderItem from "../../components/Order/OrderItem";
import OrderDetail from "./OrderDetail";
import * as OrderService from "../../../services/OrderService";
import { useDispatch, useSelector } from "react-redux";
import { updateDetailOrder } from "../../../redux/slides/orderSlice";
import { useQuery } from "@tanstack/react-query";
import { useMutationHook } from '../../../hooks/useMutationHook';

const HistotyOrderPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();

  const fakeAPI = [
    {
      id: 31,
      totalPayment: 716000,
      totalItem: 2,
      createdAt: "2023-12-07 08:54:17",
      updateAt: "2023-12-07 08:54:17",
      user: {
        id: 2,
        email: "admin1@gmail.com",
        firstName: "Admin",
        lastName: "test",
        phone: "0216495242",
      },
      address: {
        id: 33,
        city: "lmao",
        streetAddress: "darrk",
        zipCode: "darrk burh",
      },
      userPaymentMethod: {
        id: 1,
        nameMethod: "COD",
        paymentMethodId: 2,
      },
      delivery: {
        id: 1,
        name: "Chuyển phát nhanh",
        price: 18000,
        description: "Chuyển phát trong vòng 5 ngày kể từ khi đặt hàng",
        estimatedShippingTime: 5,
      },
      statusOrder: "HOAN_TAT",
      finalPayment: 734000,
    },
    {
      id: 33,
      totalPayment: 1432000,
      totalItem: 4,
      createdAt: "2023-12-07 09:16:58",
      updateAt: "2023-12-07 09:16:58",
      user: {
        id: 2,
        email: "admin1@gmail.com",
        firstName: "Admin",
        lastName: "test",
        phone: "0216495242",
      },
      address: {
        id: 35,
        city: "lmao",
        streetAddress: "darrk",
        zipCode: "darrk burh",
      },
      userPaymentMethod: {
        id: 1,
        nameMethod: "COD",
        paymentMethodId: 2,
      },
      delivery: {
        id: 1,
        name: "Chuyển phát nhanh",
        price: 18000,
        description: "Chuyển phát trong vòng 5 ngày kể từ khi đặt hàng",
        estimatedShippingTime: 5,
      },
      statusOrder: "DANG_CHO_XU_LY",
      finalPayment: 1450000,
    },
    {
      id: 34,
      totalPayment: 716000,
      totalItem: 2,
      createdAt: "2023-12-07 13:13:20",
      updateAt: "2023-12-07 13:13:20",
      user: {
        id: 2,
        email: "admin1@gmail.com",
        firstName: "Admin",
        lastName: "test",
        phone: "0216495242",
      },
      address: {
        id: 36,
        city: "lmao",
        streetAddress: "darrk",
        zipCode: "darrk burh",
      },
      userPaymentMethod: {
        id: 1,
        nameMethod: "COD",
        paymentMethodId: 2,
      },
      delivery: {
        id: 1,
        name: "Chuyển phát nhanh",
        price: 18000,
        description: "Chuyển phát trong vòng 5 ngày kể từ khi đặt hàng",
        estimatedShippingTime: 5,
      },
      statusOrder: "DANG_CHO_XU_LY",
      finalPayment: 734000,
    },
    {
      id: 35,
      totalPayment: 716000,
      totalItem: 2,
      createdAt: "2023-12-07 21:15:08",
      updateAt: "2023-12-07 21:15:08",
      user: {
        id: 2,
        email: "admin1@gmail.com",
        firstName: "Admin",
        lastName: "test",
        phone: "0216495242",
      },
      address: {
        id: 37,
        city: "lmao",
        streetAddress: "darrk",
        zipCode: "darrk burh",
      },
      userPaymentMethod: {
        id: 1,
        nameMethod: "COD",
        paymentMethodId: 2,
      },
      delivery: {
        id: 1,
        name: "Chuyển phát nhanh",
        price: 18000,
        description: "Chuyển phát trong vòng 5 ngày kể từ khi đặt hàng",
        estimatedShippingTime: 5,
      },
      statusOrder: "DA_BI_NGUOI_DUNG_HUY",
      finalPayment: 734000,
    },
  ];

  const getHistoryOrder = async () => {
    const res = await OrderService.getHistoryOrderUser(auth.accessToken);
    return res;
  };

  const { data: historyOrder, refetch } = useQuery({
    queryKey: ["historyOrder"],
    queryFn: getHistoryOrder,
  });

  const styleInputField = {
    width: "388px",
  };
  const titleSpanStyle = {
    textAlign: "left",
    width: "100px", // Độ dài cố định của các span "Tiêu đề"
    marginRight: "10px", // Khoảng cách 10px giữa span "Tiêu đề" và InputField
    fontWeight: "bold",
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const [popoverFieldValue, setPopoverFieldValue] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = async (orderId) => {

    try {
      const detailOrder = await OrderService.getDetailOrderUser(
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
  const getStatusColor = (orderStatus) => {
    switch (orderStatus) {
      case "HOAN_TAT":
        return "blue";
      case "CHO_XAC_NHAN":
        return "green";
      case "DA_BI_NGUOI_DUNG_HUY":
        return "gray";
      default:
        return "red";
    }
  };
  const mutationCancel = useMutationHook((data) => {
    const res = OrderService.cancelOrder(data, auth.accessToken);
    return res;
  });
  const mutationConfirm = useMutationHook((data) => {
    const res = OrderService.cancelOrder(data, auth.accessToken);
    return res;
  });
  return (
    <div>
      <div style={{ backgroundColor: "rgba(169, 169, 169, 0.2)" }}>
        <div
          style={{
            padding: "10px 120px",
            margin: "0 10rem",
            backgroundColor: "#fff",
            position: "relative",
            minHeight: "70vh",
          }}
        >
          <WrapperHeader>Lịch sử đơn hàng</WrapperHeader>
          {historyOrder ? (
            historyOrder.map((order, index) => (
              <div
                key={index}
                className="rounded-md"
                style={{
                  boxShadow: "0 0 4px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "0 16px",
                  height: "100%", // Đảm bảo chiếm hết độ cao của cha
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    height: "20px",
                    width: "100%",
                    paddingBottom: "4px",
                    marginTop: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p>{order.createdAt}</p>
                  <div style={{ display: "flex" }}>
                    <p
                      style={{ paddingRight: "10px", borderRight: "1px solid" }}
                    >
                      {order.delivery.name}
                    </p>
                    <p style={{ paddingLeft: "10px" }}>{order.statusOrder}</p>
                  </div>
                </div>
                <div style={{ width: "100%" }}>
                  <OrderItem
                    orderId={order.id}
                    accessToken={auth.accessToken}
                  />
                </div>
                <div style={{ width: "100%", textAlign: "right" }}>
                  <span style={{ marginRight: "10px" }}>Tổng tiền:</span>
                  <span className="font-semibold text-green-600">
                    {order.finalPayment} vnđ
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-end",
                    margin: "6px 0",
                  }}
                >
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginRight: "10px",
                      backgroundColor: "orange",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "16px",
                      height: "40px",
                    }}
                    onClick={() => showModal(order.id)}
                  >
                    <span>Xem chi tiết</span>
                  </Button>
                  <Button
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      backgroundColor: getStatusColor(order?.statusOrder),
                      color: "white",
                      fontWeight: "600",
                      fontSize: "16px",
                      height: "40px",
                    }}
                    onClick={() => {
                      if (order?.statusOrder === "DANG_CHO_XU_LY") {
                        mutationCancel.mutate(order?.id, {
                          onSuccess: () => {
                            alert("Hủy đơn hàng thành công")
                            refetch()
                          }
                        })
                      } else if (order?.statusOrder === "CHO_XAC_NHAN") {
                        mutationConfirm.mutate(order?.id, {
                          onSuccess: () => {
                            alert("Xác nhận đơn hàng thành công")
                            refetch()
                          }
                        })

                      }
                    }}
                    disabled={order?.statusOrder === "HOAN_TAT" || order?.statusOrder === "DA_BI_NGUOI_DUNG_HUY"}
                  >
                    {order?.statusOrder === "HOAN_TAT" && <span>Hoàn thành</span>}
                    {order?.statusOrder === "DA_BI_NGUOI_DUNG_HUY" && <span>Đã hủy</span>}
                    {order?.statusOrder === "DANG_CHO_XU_LY" && <span>Hủy</span>}
                    {order?.statusOrder === "CHO_XAC_NHAN" && <span>Xác nhận đơn hàng</span>}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>Không có đơn hàng để hiển thị.</p>
          )}
        </div>
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
        <OrderDetail />
      </Modal>
    </div>
  );
};

export default HistotyOrderPage;
