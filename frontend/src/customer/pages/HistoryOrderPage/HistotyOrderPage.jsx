import React, { useState } from "react";
import { WrapperHeader } from "./style";
import UploadImage from "../../../Admin/components/UploadFile/UploadImage";
import InputField from "../../components/InputField";
import { Button, Modal, Select, Slider, Pagination, message } from "antd";
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
        const orderDate = new Date(order.updateAt);
        const filterDate = new Date();
        return orderDate < filterDate;
      })
      .sort((a, b) => new Date(b.updateAt) - new Date(a.updateAt));
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
  const renderTextState = (orderStatus) => {
    switch (orderStatus) {
      case "DA_VAN_CHUYEN":
        return "Đang vận chuyển";
      case "DA_GIAO_HANG":
        return "Đã giao hàng";
      case "GIAO_THAT_BAI":
        return "Giao thất bại";
      case "DA_BI_NGUOI_DUNG_HUY":
        return "Hủy";
      case "DA_BI_HE_THONG_HUY":
        return "Hệ thống hủy";
      case "DANG_XU_LY":
        return "Đang xử lý";
      case "DANG_CHO_XU_LY":
        return "Đang xử lý";
      case "HOAN_TAT":
        return "Đơn hoàn thành";
      default:
        return "Hoàn tiền";
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
          <section className="text-2xl text-left font-semibold mt-2">
            Lịch sử mua hàng
          </section>
          <hr class="w-full mb-4 mt-1 border-t border-gray-300" />

          {/* List */}
          {visibleHistoryOrder ? (
            visibleHistoryOrder.map((order, index) => (
              <div
                key={index}
                className=""
                style={{
                  border: "1px solid",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%", // Đảm bảo chiếm hết độ cao của cha
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    height: "20px",
                    width: "100%",
                    padding: "0 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: "28px",
                    backgroundColor: "#034ea1",
                    color: "#fff",
                  }}
                  className="font-semibold"
                >
                  <p>{order.createdAt}</p>
                  <div style={{ display: "flex" }}>
                    <p
                      style={{ paddingRight: "10px", borderRight: "1px solid" }}
                    >
                      {order.delivery.name}
                    </p>
                    <p style={{ paddingLeft: "10px" }}>
                      {renderTextState(order.statusOrder)}
                    </p>
                  </div>
                </div>
                <div style={{ width: "100%" }}>
                  <OrderItem orderId={order.id} auth={auth} />
                </div>
                <div
                  style={{
                    width: "100%",
                    textAlign: "right",
                    marginRight: "24px",
                  }}
                >
                  <span style={{ marginRight: "10px" }}>Tổng tiền:</span>
                  <span className="font-semibold text-green-600">
                    {order.finalPayment.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-end",
                    margin: "6px 0",
                    marginRight: "24px",
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
                              message.success("Hủy đơn hàng thành công");
                              refetch();
                            },
                            onError: (err) => {
                              console.log(`Lỗi ${err}`);
                            },
                          });
                        } else if (order?.statusOrder === "DA_GIAO_HANG") {
                          mutationConfirm.mutate(order?.id, {
                            onSuccess: () => {
                              message.success("Hoàn thành đơn hàng thành công");
                              refetch();
                            },
                            onError: (err) => {
                              console.log(`Lỗi ${err}`);
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
        <OrderDetail setIsModalOpen={setIsModalOpen} />
      </Modal>
    </div>
  );
};

export default HistotyOrderPage;
