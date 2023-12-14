import React from "react";
import CartItem from "./CartItem";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from '@tanstack/react-query'
import * as CartService from "../../../services/CartService";
import { Modal, Input, Radio } from 'antd';
import { useMutationHook } from '../../../hooks/useMutationHook';
import { useQueryClient } from '@tanstack/react-query'
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as AuthService from "../../../services/AuthService"
import { loginSuccess } from "../../../redux/slides/authSlice";

const objectPrice = {
  1: 18000,
  2: 45000,
  3: 99000,
}
const Cart = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState(2);
  const [selectedShipment, setSelectedShipment] = React.useState(1);
  const [state, setState] = React.useState({
    city: '',
    streetAddress: '',
    zipCode: ''
  })
  const dispatch = useDispatch()

  const refreshToken = async () => {
    try {
      const data = await AuthService.refreshToken();
      console.log("data", data);
      return data?.accessToken;
    } catch (err) {
      console.log("err", err);
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      console.log("vao lai");
      let date = new Date();
      if (auth?.accessToken) {
        const decodAccessToken = jwtDecode(auth?.accessToken);
        if (decodAccessToken.exp < date.getTime() / 1000) {
          const data = await refreshToken();
          const refreshUser = {
            ...auth,
            accessToken: data,
          };

          console.log("data in axiosJWT", data);
          console.log("refreshUser", refreshUser);

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

  const queryClient = useQueryClient()
  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => {
      return CartService.getCartItems(auth.accessToken,axiosJWT)
    }
  })


  const mutation = useMutationHook((data) => {
    const res = CartService.checkOutCarts(data, auth.accessToken, axiosJWT);
    return res;
  });
  const onChangeText = (name) => (e) => {
    setState(s => ({
      ...s,
      [name]: e?.target?.value || '',
    }));
  }

  const onChangePayment = (e) => {

    setSelectedPayment(e.target.value);
  };
  const onChangeShipment = (e) => {

    setSelectedShipment(e.target.value);
  };
  const handleOk = () => {
    const idCarts = cart?.cartItems.map((item) => item.id)
    mutation.mutate({
      cartItemId: idCarts,
      userAddressRequestv2: {
        city: state.city,
        streetAddress: state.streetAddress,
        zipCode: state.zipCode,
      },
      paymentMethodId: selectedPayment,
      deliveryId: selectedShipment
    },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ['cart'] })
          alert('Đặt hàng thành công')
          setIsModalOpen(false);
          setState(s => ({
            ...s,
            city: '',
            streetAddress: '',
            zipCode: ''
          }))
        }
      })
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // const cartItems = useSelector((state) => state.user.cart)
  // const totalPrice = React.useMemo(
  //   () =>
  //     cartItems?.reduce((result, current) => {
  //       return result + current.price
  //     }, 0),
  //   [cartItems]
  // )

  return (
    <div className="lg:grid grid-cols-3 lg:px-16 relative">
      <div className="col-span-2">
        {cart?.cartItems?.map((item, index) => (
          <CartItem key={index} product={item} />
        ))}
      </div>

      <div className="px-5 top-0 h-[100vh] mt-5 lg:mt-0">
        <div className="border">
          <p className="uppercase font-bold opacity-60 pb-4">price detail</p>
          <hr />

          <div className="space-y-3 font-semibold">
            <div className="flex justify-between pt-3 text-black">
              <span>Price</span>
              <span>{cart?.totalPrice}đ</span>
            </div>

            {/* <div className="flex justify-between pt-3 text-black">
              <span>Disscount</span>
              <span className="text-green-600">123đ</span>
            </div>

            <div className="flex justify-between pt-3 text-black">
              <span>Delivery Charge</span>
              <span className="text-green-600">123đ</span>
            </div> */}

            <div className="flex justify-between pt-3 font-bold">
              <span>Total Amount</span>
              <span className="text-green-600">{cart?.totalPrice}đ</span>
            </div>
          </div>

          <Button
            variant="contained"
            className="w-full mt-5"
            sx={{ px: "2.5rem", py: ".7rem", bgcolor: "#9155fd" }}
            onClick={() => setIsModalOpen(true)}
          >
            checkout
          </Button>
          <Modal title="Đặt hàng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okType='default' okText="Đặt hàng" cancelText="Hủy">
            <div>
              <div className='border-[1px] p-2 bg-[#9155fd] text-white '>
                Bạn đang đặt hàng cho {cart?.cartItems.length} sản phẩm
              </div>
              <h1 className='text-2xl font-bold'>Thông tin đặt hàng</h1>
              <div className='mt-2'>
                <label>Địa chỉ giao hàng</label>
                <Input value={state.streetAddress} onChange={onChangeText('streetAddress')} placeholder="Địa chỉ giao hàng" />
              </div>
              <div className='my-2'>
                <label>Thành phố</label>
                <Input value={state.city} onChange={onChangeText('city')} placeholder="Thành phố" />
              </div>
              <div className='mb-2'>
                <label>Zip code</label>
                <Input value={state.zipCode} onChange={onChangeText('zipCode')} placeholder='Zip code' />
              </div>
              <div className='mb-2'>
                <label className='mr-2 block'>Chọn phương thức thanh toán:</label>
                <Radio.Group onChange={onChangePayment} value={selectedPayment}>
                  <Radio value={1}>VNPay</Radio>
                  <Radio defaultChecked={true} value={2}>COD</Radio>
                </Radio.Group>
              </div>
              <div className='mb-2'>
                <label className='mr-2'>Chọn phương thức vận chuyển:</label>
                <Radio.Group onChange={onChangeShipment} value={selectedShipment}>
                  <Radio defaultChecked={true} value={1}>Chuyển phát nhanh</Radio>
                  <Radio value={2}>Hỏa tốc</Radio>
                  <Radio value={3}>Chuyển giao trong ngày</Radio>
                </Radio.Group>
              </div>
              <div className="flex justify-between pt-3 text-black">
                <span> Price</span>
                <span>{cart?.totalPrice}đ</span>
              </div>
              <div className="flex justify-between pt-3 text-black">
                <span>Delivery Charge</span>
                <span>{objectPrice[selectedShipment]}đ</span>
              </div>
              <div className="flex justify-between pt-3 text-black">
                <span>Total Price</span>
                <span>{cart?.totalPrice + objectPrice[selectedShipment]}đ</span>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Cart;
