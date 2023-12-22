import React from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderItems from "./OrderItems";
import OrderDetailPrice from "./OrderDetailPrice";
import OrderIn4 from "./OrderIn4";
import { Button, Popover, message } from "antd";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as OrderService from "../../../services/OrderService";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import * as AuthService from "../../../services/AuthService";

const AdminOrderDetail = (props) => {
  const detailOrder = useSelector(
    (state) => state.order.detailOrder.currentOrder
  );
  const dispatch = useDispatch();

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
      if (props?.auth?.accessToken) {
        const decodAccessToken = jwtDecode(props?.auth?.accessToken);
        if (decodAccessToken.exp < date.getTime() / 1000) {
          const data = await refreshToken();
          const refreshUser = {
            ...props?.auth,
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

  const mutation = useMutationHook((data) => {
    const res = OrderService.editStatusOrderAdmin(
      data,
      props?.auth?.accessToken,
      axiosJWT
    );
    return res;
  });

  const handleChangeStatus = (value) => {
    console.log("id", detailOrder?.id);
    console.log("statusChange", value);
    mutation.mutate(
      { id: detailOrder?.id, status: value },
      {
        onSuccess: () => {
          // Hiển thị thông báo thành công
          message.success("Chỉnh sửa sản phẩm thành công");
          props?.setIsModalOpen(false);
          props?.refetch({ queryKey: ["orders"] });
        },
        onError: (error) => {
          // Hiển thị thông báo lỗi
          message.error(`Đã xảy ra lỗi: ${error.message}`);
          props?.setIsModalOpen(false);
          props?.refetch({ queryKey: ["orders"] });
        },
      }
    );
  };

  const getStatusDisplay = (statusOrder) => {
    switch (statusOrder) {
      case "DANG_CHO_XU_LY":
        return {
          text: "Đang xử lý",
          color: "gray",
          change: "DA_BI_HE_THONG_HUY",
          textChange: "Hủy",
        };
      case "DANG_XU_LY":
        return {
          text: "Đang xử lý",
          color: "gray",
          change: "DA_BI_HE_THONG_HUY",
          textChange: "Hủy",
        };
      case "DA_BI_NGUOI_DUNG_HUY":
        return { text: "Hủy", color: "red" };
      case "DA_BI_HE_THONG_HUY":
        return { text: "Hệ thống hủy", color: "red" };
      case "DANG_VAN_CHUYEN":
        return {
          text: "Đang vận chuyển",
          color: "green",
          change: "DA_GIAO_HANG",
          textChange: "Đã giao hàng",
        };
      case "DA_GIAO_HANG":
        return {
          text: "Đã giao hàng",
          color: "pink",
          change: "HOAN_TAT",
          textChange: "Hoàn thành đơn",
        };
      case "BI_TU_CHOI":
        return {
          text: "Bị từ chối",
          color: "red",
          change: "DA_HOAN_TIEN",
          textChange: "Hoàn tiền",
        };
      case "DA_HOAN_TIEN":
        return { text: "Đã hoàn tiền", color: "red" };
      default:
        return { text: "Hoàn tất", color: "green" };
    }
  };

  const checkHiddenButton = (statusOrder, nameMethod) => {
    switch (nameMethod) {
      case "COD": {
        if (
          statusOrder === "DA_BI_NGUOI_DUNG_HUY" ||
          statusOrder === "DA_BI_HE_THONG_HUY" ||
          statusOrder === "DA_GIAO_HANG" ||
          statusOrder === "BI_TU_CHOI" ||
          statusOrder === "HOAN_TAT"
        ) {
          return false;
        }
        return true;
      }
      default: {
        if (
          statusOrder === "DA_BI_NGUOI_DUNG_HUY" ||
          statusOrder === "DA_BI_HE_THONG_HUY" ||
          statusOrder === "DA_GIAO_HANG" ||
          statusOrder === "DA_HOAN_TIEN" ||
          statusOrder === "HOAN_TAT"
        ) {
          return false;
        }
        return true;
      }
    }
  };

  return (
    <div>
      <div>
        <h4 className="text-xl font-semibold mb-2">Thông tin cơ bản</h4>
        <OrderIn4 detailOrder={detailOrder} />
        <hr className="my-2 border-t-2 border-gray-300" />

        <h4 className="text-xl font-semibold mb-2">Danh sách sản phẩm</h4>
        <OrderItems />
        <hr className="my-2 border-t-2 border-gray-300" />

        <h4 className="text-xl font-semibold mb-2">Chi tiết giá</h4>
        <OrderDetailPrice detailOrder={detailOrder} />
      </div>
      <div style={{ textAlign: "right", marginTop: "16px" }}>
        {checkHiddenButton(
          detailOrder?.statusOrder,
          detailOrder?.userPaymentMethod?.nameMethod
        ) && (
          <>
            <Button
              className="font-semibold"
              style={{
                width: "120px",
                height: "40px",
                backgroundColor: `${
                  getStatusDisplay(detailOrder?.statusOrder).color
                }`,
                color: "#fff",
              }}
              onClick={() =>
                handleChangeStatus(
                  getStatusDisplay(detailOrder?.statusOrder).change
                )
              }
            >
              {getStatusDisplay(detailOrder.statusOrder).textChange}
            </Button>
            {detailOrder?.statusOrder === "DANG_VAN_CHUYEN" && (
              <Button
                className="font-semibold"
                style={{
                  width: "120px",
                  height: "40px",
                  backgroundColor: "red",
                  color: "#fff",
                }}
                onClick={() => handleChangeStatus("BI_TU_CHOI")}
              >
                Bị từ chối
              </Button>
            )}
            {(detailOrder?.statusOrder === "DANG_XU_LY" ||
              detailOrder?.statusOrder === "DANG_CHO_XU_LY") && (
              <Button
                className="font-semibold"
                style={{
                  width: "160px",
                  height: "40px",
                  backgroundColor: "Purple",
                  color: "#fff",
                }}
                onClick={() => handleChangeStatus("DANG_VAN_CHUYEN")}
              >
                Đang vận chuyển
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetail;
