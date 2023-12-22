import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateQuantity } from "../../../redux/slides/userSlide";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as CartService from "../../../services/CartService";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import * as AuthService from "../../../services/AuthService";
import { CloseOutlined } from "@ant-design/icons";

const CartItem = ({ product }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.login.currentUser);

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

  const mutation = useMutationHook((data) => {
    const res = CartService.updateCart(data, auth.accessToken, axiosJWT);
    return res;
  });

  const handlePlusQuantity = () => {
    // const newPrice = product.price + (product.price / product.quantity)
    // const newQuantity = product.quantity + 1;

    // dispatch(updateQuantity({
    //   ...product,
    //   quantity: newQuantity,
    //   price: newPrice
    // }))

    mutation.mutate(
      [
        {
          productItemId: product?.productItem?.id,
          quantity: 1,
        },
      ],
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
      }
    );
  };
  const handleSubQuantity = () => {
    // const newPrice = product.price - (product.price / product.quantity)
    // const newQuantity = product.quantity - 1;
    // if (newQuantity === 0) {
    //   dispatch(removeItem({
    //     ...product
    //   }))
    // } else {
    //   dispatch(updateQuantity({
    //     ...product,
    //     quantity: newQuantity,
    //     price: newPrice
    //   }))
    // }
    mutation.mutate(
      [
        {
          productItemId: product?.productItem?.id,
          quantity: -1,
        },
      ],
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
      }
    );
  };
  const handleRemove = () => {
    // dispatch(removeItem({
    //   ...product
    // }))
    mutation.mutate(
      [
        {
          productItemId: product?.productItem?.id,
          quantity: -product?.quantity,
        },
      ],
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
      }
    );
  };
  return (
    <div className="p-5 border rounded-md mb-5 flex relative">
      <div className="w-[3rem] h-[3rem] lg:w-[6rem] lg:h-[6rem]">
        <img
          className="w-full h-full object-cover object-top"
          src={`${product?.productItem.productImage}`}
          alt={`${product?.productItem.productImage}`}
        />
      </div>
      <div className="ml-2 flex-col">
        <p className="">{product?.productItem.name}</p>
        <div className="flex space-x-5 text-gray-900 pt-6">
          <p className="text-red-600">
            {product.totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>
      </div>
      <div className="ml-auto flex">
        {" "}
        {/* Thêm class ml-auto để đưa phần tử về góc phải */}
        <div className="lg:flex items-center lg:space-x-10 pt-4">
          <div className="flex items-center space-x-2">
            <IconButton onClick={() => handleSubQuantity()}>
              <RemoveCircleOutlineIcon />
            </IconButton>
            <span className="py-1 px-7 border rounded-sm">
              {product.quantity}
            </span>
            <IconButton
              onClick={() => handlePlusQuantity()}
              sx={{ color: "RGB(145,85,253)" }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </div>

          <div className="">
            <Button
              onClick={() => handleRemove()}
              sx={{
                color: "RGB(220,20,60)",
                fontWeight: "bold",
                position: "absolute",
                top: 0,
                right: 0,
              }}
            >
              <CloseOutlined />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
