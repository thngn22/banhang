import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import * as CartService from "../../../services/CartService";
import { Modal, Input, Radio, message } from "antd";
import { useMutationHook } from "../../../hooks/useMutationHook";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as AuthService from "../../../services/AuthService";
import { loginSuccess } from "../../../redux/slides/authSlice";
import ProvinceSelection from "./Address";

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

  console.log(cart);

  const mutation = useMutationHook((data) => {
    const res = CartService.checkOutCarts(data, auth.accessToken, axiosJWT);
    return res;
  });
  const { data, status, isSuccess, isError } = mutation;
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
    // Lần đầu được mounted
    setTotalPrice(calculateTotalPrice());
  }, []);

  // console.log("totalPrice", totalPrice);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
      <section className="text-2xl text-left font-semibold">
        Giỏ hàng của bạn
      </section>
      <hr class="w-full mb-4 mt-1 border-t border-gray-300" />

      <div className="lg:grid grid-cols-3 relative">
        <div className="col-span-2">
          {cart?.cartItems?.map((item, index) => (
            <CartItem key={index} product={item} />
          ))}
        </div>

        <div className="pl-5 top-0 h-[100vh] mt-5 lg:mt-0">
          <div className="border rounded-md pl-2 pr-2">
            <p className="uppercase text-xl pb-2 pt-2 text-left">
              Thông tin đơn hàng
            </p>
            <hr class="mt-1 border-t border-gray-300" />

            <div className="space-y-3">
              <div className="flex text-lg justify-between pt-3 text-black mb-5">
                <span className="font-semibold">Tổng tiền: </span>
                <span className="text-red-600 font-semibold">
                  {cart?.totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
            </div>
            <hr class="mt-1 border-t border-gray-300 pb-3" />

            <ul className="list-disc pl-5 text-sm text-left mb-5">
              <li>Phí vận chuyển sẽ được tính khi bạn Đặt hàng</li>
              <li>Hãy điền đầy đủ thông tin khi tiến hàng Đặt hàng</li>
            </ul>

            <Button
              variant="contained"
              className="w-full mt-10"
              sx={{
                px: "2.5rem",
                py: ".7rem",
                bgcolor: "#9155fd",
                marginBottom: "14px",
              }}
              onClick={() => setIsModalOpen(true)}
            >
              checkout
            </Button>

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
