import React, { useState } from "react";
import { WrapperHeader } from "./style";
import UploadImage from "../../../Admin/components/UploadFile/UploadImage";
import InputField from "../../components/InputField";
import { Button, Modal, Select, Slider, Pagination } from "antd";
import { Option } from "antd/es/mentions";
import OrderItem from "../../components/Order/OrderItem";
import OrderDetail from "./OrderDetail";
import * as OrderService from "../../../services/OrderService";
import { useDispatch, useSelector } from "react-redux";
import { updateDetailOrder } from "../../../redux/slides/orderSlice";
import { useQuery } from "@tanstack/react-query";
import { useMutationHook } from "../../../hooks/useMutationHook";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import * as AuthService from "../../../services/AuthService";

const HistotyOrderPage = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);

  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

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

  const getHistoryOrder = async () => {
    const res = await OrderService.getHistoryOrderUser(
      auth.accessToken,
      axiosJWT
    );

    const filteredHistoryOrder = res
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        const filterDate = new Date();
        return orderDate < filterDate;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return filteredHistoryOrder;
  };

  const { data: historyOrder, refetch } = useQuery({
    queryKey: ["historyOrder"],
    queryFn: getHistoryOrder,
    retry: false,
    enabled: Boolean(auth?.accessToken),
  });

  const pageSize = 3;
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleHistoryOrder = historyOrder
    ? historyOrder.slice(startIndex, endIndex)
    : [];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = async (orderId) => {
    try {
      const detailOrder = await OrderService.getDetailOrderUser(
        orderId,
        auth.accessToken,
        axiosJWT
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
      case "DA_GIAO_HANG":
        return "blue";
      case "DANG_XU_LY":
        return "red";
      default:
        return "gray";
    }
  };
  const mutationCancel = useMutationHook((data) => {
    const res = OrderService.cancelOrder(data, auth.accessToken, axiosJWT);
    return res;
  });
  const mutationConfirm = useMutationHook((data) => {
    const res = OrderService.confirmOrder(data, auth.accessToken, axiosJWT);
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

          {/* List */}
          {visibleHistoryOrder ? (
            visibleHistoryOrder.map((order, index) => (
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
                  <OrderItem orderId={order.id} auth={auth} />
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

                  {order?.statusOrder === "DANG_XU_LY" ||
                  order?.statusOrder === "DA_GIAO_HANG" ? (
                    <Button
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        backgroundColor: getStatusColor(order?.statusOrder),
                        color: "white",
                        marginLeft: "10px",
                        fontWeight: "600",
                        fontSize: "16px",
                        height: "40px",
                      }}
                      onClick={() => {
                        if (order?.statusOrder === "DANG_XU_LY") {
                          mutationCancel.mutate(order?.id, {
                            onSuccess: () => {
                              alert("Hủy đơn hàng thành công");
                              refetch();
                            },
                          });
                        } else if (order?.statusOrder === "DA_GIAO_HANG") {
                          mutationConfirm.mutate(order?.id, {
                            onSuccess: () => {
                              alert("Hoàn thành đơn hàng thành công");
                              refetch();
                            },
                            onError: () => {
                              console.log("lỗi");
                            },
                          });
                        }
                      }}
                    >
                      {order?.statusOrder === "DANG_XU_LY" && <span>Hủy</span>}
                      {order?.statusOrder === "DA_GIAO_HANG" && (
                        <span>Xác nhận đơn hàng</span>
                      )}
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <p>Không có đơn hàng để hiển thị.</p>
          )}

          {historyOrder && (
            <Pagination
              total={historyOrder.length}
              pageSize={pageSize}
              defaultCurrent={1}
              onChange={onChange}
            />
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
