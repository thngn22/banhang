import React, { useEffect, useState } from "react";
import * as OrderService from "../../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/slides/authSlice";
import * as AuthService from "../../../services/AuthService";

const Order = ({ orderId, auth }) => {
  const dispatch = useDispatch();

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
  const { data: detailOrder } = useQuery({
    queryKey: ["detailOrder", orderId], // Sử dụng order.id làm một phần của key
    queryFn: () => {
      return OrderService.getDetailOrderUser(
        orderId,
        auth?.accessToken,
        axiosJWT
      );
    },
    retry: false,
    enabled: Boolean(auth?.accessToken),
  });

  const [orderItems, setOrderItems] = useState([]);
  useEffect(() => {
    if (detailOrder) {
      setOrderItems(detailOrder.orderItems);
    }
  }, [detailOrder]);

  return (
    <div>
      {orderItems.length > 0 ? (
        orderItems.map((item) => (
          <div key={item.id} className="p-3 border">
            <div className="flex">
              <div className="w-[5rem] h-[5rem] lg:w-[6rem] lg:h-[5rem]">
                <img
                  className="w-[5rem] h-[5rem] object-cover object-top"
                  src={item.productItemImage}
                  alt={item.productItemName}
                />
              </div>
              <div className="space-y-1 text-left w-[100%]">
                <p className="font-semibold">{item.productItemName}</p>
                <p className="opavity-70 text-[14px]">
                  Size: {item.size}, Color: {item.color}
                </p>
                <div className="flex items-start text-gray-900 justify-between">
                  <div className="flex space-x-2">
                    <p>{`x${item.quantity}`}</p>
                  </div>
                  <div className="flex space-x-2">
                    <p className="text-red-500">{`${item.totalPrice.toLocaleString(
                      "vi-VN",
                      {
                        style: "currency",
                        currency: "VND",
                      }
                    )}`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        // Nếu orderItems rỗng, hiển thị thông báo hoặc không hiển thị gì cả
        <p>Không có sản phẩm trong đơn hàng này.</p>
      )}
    </div>
  );
};

export default Order;
