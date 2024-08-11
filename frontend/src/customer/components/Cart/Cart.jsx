import React, { useEffect } from "react";
import CartItem from "./CartItem";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import * as CartService from "../../../services/CartService";
import { message } from "antd";
import { useMutationHook } from "../../../hooks/useMutationHook";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as AuthService from "../../../services/AuthService";
import { loginSuccess } from "../../../redux/slides/authSlice";
import "./styles.css";
import { useNavigate } from "react-router-dom";

import logoShield from "../../../Data/image/img-shield.png";
import logoBusFreeShip from "../../../Data/image/img-busfreeship.png";
import logoBus2h from "../../../Data/image/img-bus2h.png";

const Cart = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => {
      return CartService.getCartItems(auth?.accessToken, axiosJWT);
    },
    enabled: Boolean(auth?.accessToken),
  });

  const hanldeCheckout = () => {
    if (cart && cart?.totalItem > 0) {
      navigate("/checkout");
    } else {
      message.error("Bạn chưa có sản phẩm nào trong Giỏ hàng");
    }
  };

  return (
    <div className="px-8 py-10">
      <p className="text-2xl text-left uppercase font-bold">Giỏ hàng của bạn</p>
      <hr class="w-full mb-4 mt-1 border-t border-gray-300" />

      <div className="grid grid-cols-3 relative">
        <div className="col-span-2">
          {cart?.cartItems?.map((item, index) => (
            <CartItem key={index} product={item} />
          ))}
        </div>

        <div className="pl-5">
          <div className="border rounded-md p-4">
            <p className="text-xl font-semibold">Tóm tắt đơn hàng</p>

            <div className="space-y-3">
              <div className="flex text-lg justify-between pt-3 text-black">
                <p className="font-base text-base">Tổng tiền:</p>
                <p className="text-red-600 font-bold text-lg">
                  {cart?.totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            </div>
            <hr class="mt-1 border-t border-gray-300 pb-3" />

            <ul className="text-sm mb-5 flex flex-col gap-4">
              <li className="flex items-center">
                <img src={logoShield} alt="logoShield" className="w-8 mr-4" />
                <p>Cam kết chính hãng 100%.</p>
              </li>
              <li className="flex items-center">
                <img
                  src={logoBusFreeShip}
                  alt="logoFreeShip"
                  className="w-8 mr-4"
                />
                <p>
                  Hỗ trợ vận chuyển Grab cho đơn hàng ngoại thành (và bán kính
                  nhiều hơn 7km nội thành).
                </p>
              </li>
              <li className="flex items-center">
                <img src={logoBus2h} alt="logoBus2h" className="w-8 mr-4" />
                <p>
                  Hỗ trợ giao hàng trong 2 giờ. Áp dụng cho khu vực TP. Hồ Chí
                  Minh bán kính 7km từ thứ Hai đến thứ Bảy (từ 8:00 - 11:00 và
                  từ 14:00 - 17:00 trong ngày).
                </p>
              </li>
            </ul>

            <div className="btn-checkout-custom">
              <Button
                variant="contained"
                className="w-full mt-10"
                sx={{
                  px: "2.5rem",
                  py: ".7rem",
                  bgcolor: "black",
                  color: "white",
                }}
                onClick={hanldeCheckout}
              >
                Thủ tục thanh toán
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
