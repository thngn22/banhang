import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import * as CartService from "../../../services/CartService";
import { Modal, Radio, message } from "antd";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as AuthService from "../../../services/AuthService";
import { loginSuccess } from "../../../redux/slides/authSlice";
import ProvinceSelection from "./Address";
import "./styles.css";
import { useNavigate } from "react-router-dom";

import logoShield from "../../../Data/image/img-shield.png";
import logoBusFreeShip from "../../../Data/image/img-busfreeship.png";
import logoBus2h from "../../../Data/image/img-bus2h.png";

const objectPrice = {
  1: 18000,
  2: 45000,
  3: 99000,
};

const Cart = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState(2);
  const [selectedShipment, setSelectedShipment] = React.useState(1);
  const [totalPrice, setTotalPrice] = useState();
  const [state, setState] = React.useState({
    city: "",
    district: "",
    ward: "",
    address: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
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

  const queryClient = useQueryClient();
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => {
      return CartService.getCartItems(auth.accessToken, axiosJWT);
    },
  });

  const mutation = useMutationHook((data) => {
    const res = CartService.checkOutCarts(data, auth.accessToken, axiosJWT);
    return res;
  });
  const { data, isSuccess } = mutation;
  useEffect(() => {
    if (isSuccess && data && selectedPayment === 1) {
      window.location.href = data;
    }
  }, [data, isSuccess]);

  const onChangePayment = (e) => {
    setSelectedPayment(e.target.value);
  };
  const onChangeShipment = (e) => {
    setSelectedShipment(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };
  const isPhoneNumberValid = (phoneNumber) => {
    const phoneNumberRegex = /^\+?[0-9]{10,12}$/;
    return phoneNumberRegex.test(phoneNumber);
  };
  const handleOk = () => {
    if (
      state.city !== "" &&
      state.district !== "" &&
      state.ward !== "" &&
      state.address !== "" &&
      phoneNumber !== ""
    ) {
      const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharacterRegex.test(state.address)) {
        message.error("Địa chỉ không được chứa các ký tự đặc biệt");
      } else if (!isPhoneNumberValid(phoneNumber)) {
        console.log(isPhoneNumberValid(phoneNumber));
        message.error("Số điện thoại không đúng định dạng.");
        return;
      } else {
        const idCarts = cart?.cartItems.map((item) => item.id);

        mutation.mutate(
          {
            cartItemId: idCarts,
            userAddressRequestv2: {
              city: state.city,
              district: state.district,
              ward: state.ward,
              address: state.address,
            },
            paymentMethodId: selectedPayment,
            deliveryId: selectedShipment,
            phoneNumber: phoneNumber,
          },
          {
            onSuccess: (data) => {
              queryClient.invalidateQueries({ queryKey: ["cart"] });
              message.success("Đặt hàng thành công");
              setIsModalOpen(false);
              setState((s) => ({
                ...s,
                city: "",
                streetAddress: "",
                zipCode: "",
              }));
            },
            onError: (err) => {
              message.error(`Lỗi ${err}`);
            },
          }
        );
      }
    } else {
      message.warning("Hãy nhập đầy đủ thông tin địa chỉ trước khi Đặt hàng");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const calculateTotalPrice = () => {
    if (cart) {
      return cart.totalPrice + objectPrice[selectedShipment];
    }
    return 0;
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [cart, selectedShipment]);

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, []);

  const hanldeCheckout = () => {
    navigate("/checkout");
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
                  nhiều hơn 10km nội thành).
                </p>
              </li>
              <li className="flex items-center">
                <img src={logoBus2h} alt="logoBus2h" className="w-8 mr-4" />
                <p>
                  Hỗ trợ giao hàng trong 2 giờ khi chọn phương thức nhân viên
                  Shop. Áp dụng cho khu vực TP. Hồ Chí Minh bán kính 10km từ thứ
                  Hai đến thứ Bảy (từ 8:00 - 11:00 và từ 14:00 - 17:00 trong
                  ngày).
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
                // onClick={() => setIsModalOpen(true)}
                onClick={hanldeCheckout}
              >
                Thủ tục thanh toán
              </Button>
            </div>

            <Modal
              title="Đặt hàng"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              okType="default"
              okText="Đặt hàng"
              cancelText="Hủy"
            >
              <div>
                <div className="border-[1px] p-2 bg-[#9155fd] text-white ">
                  Bạn đang đặt hàng cho {cart?.cartItems.length} sản phẩm
                </div>
                <h1 className="text-2xl font-bold">Thông tin đặt hàng</h1>
                <div>
                  <span style={{ marginRight: "20px" }}>Số điện thoại:</span>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Số điện thoại liên hệ"
                    style={{
                      border: "1px solid",
                      borderRadius: "14px",
                      height: "32px",
                      width: "60%",
                      paddingLeft: "10px",
                    }}
                  />
                </div>
                <ProvinceSelection
                  state={state}
                  setState={setState}
                  isModalOpen={isModalOpen}
                />
                <div className="mb-2 mt-4">
                  <label className="mr-2 block font-semibold">
                    Chọn phương thức thanh toán:
                  </label>
                  <Radio.Group
                    onChange={onChangePayment}
                    value={selectedPayment}
                  >
                    <Radio defaultChecked={true} value={2}>
                      COD
                    </Radio>
                    <Radio value={1}>VNPay</Radio>
                  </Radio.Group>
                </div>
                <div className="mb-2 mt-4">
                  <label className="mr-2 block font-semibold">
                    Chọn phương thức vận chuyển:
                  </label>
                  <Radio.Group
                    onChange={onChangeShipment}
                    value={selectedShipment}
                  >
                    <Radio defaultChecked={true} value={1}>
                      Chuyển phát nhanh
                    </Radio>
                    <Radio value={2}>Hỏa tốc</Radio>
                    <Radio value={3}>Chuyển giao trong ngày</Radio>
                  </Radio.Group>
                </div>
                <div className="flex justify-between pt-3 text-black">
                  <span>Giá sản phẩm:</span>
                  <span>
                    {cart?.totalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
                <div className="flex justify-between pt-3 text-black">
                  <span>Phí vận chuyển:</span>
                  <span className="opacity-60 text-gray-500">
                    {objectPrice[selectedShipment].toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
                <div className="flex justify-between pt-3 text-black">
                  <span className="font-semibold">Tổng:</span>
                  <span className="text-red-600 font-semibold">
                    {totalPrice &&
                      totalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                  </span>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
