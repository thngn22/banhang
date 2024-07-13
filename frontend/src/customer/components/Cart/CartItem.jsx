import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useSelector, useDispatch } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as CartService from "../../../services/CartService";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../../redux/slides/authSlice";
import * as AuthService from "../../../services/AuthService";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

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
      <Link className="flex" to={`/product/${product?.productItem.productId}`}>
        <div className="w-[8rem] h-[8rem]">
          <img
            className="w-full object-cover object-top rounded-xl"
            src={`${product?.productItem.productImage}`}
            alt={`${product?.productItem.productImage}`}
          />
        </div>
        <div className="ml-2 flex flex-col justify-between">
          <div className="flex flex-col text-gray-900">
            <p className="text-xl font-bold">{product?.productItem.name}</p>
            <div className="flex gap-2 text-sm">
              <p>Color: </p>
              <p className="text-gray-400 font-medium">
                {product?.productItem.color}
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              <p>Size: </p>
              <p className="text-gray-400 font-medium">
                {product?.productItem.size}
              </p>
            </div>
          </div>
          <p className="text-red-600 text-xl font-bold">
            {product.totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>
      </Link>

      <div className="ml-auto flex">
        <div className="flex items-end pt-4">
          <div className="flex items-center">
            <IconButton
              onClick={() => handleSubQuantity()}
              sx={{ color: "black" }}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
            <p className="py-1 px-4 border border-black rounded-sm font-semibold">
              {product.quantity}
            </p>
            <IconButton
              onClick={() => handlePlusQuantity()}
              sx={{ color: "red" }}
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
