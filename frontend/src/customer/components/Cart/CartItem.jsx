import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateQuantity } from '../../../redux/slides/userSlide';
import { useMutationHook } from '../../../hooks/useMutationHook';
import * as CartService from "../../../services/CartService";
import { useQueryClient } from '@tanstack/react-query'
const CartItem = ({ product }) => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth.login.currentUser);
  const mutation = useMutationHook((data) => {
    const res = CartService.updateCart(data, auth.accessToken);
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
    mutation.mutate([{
      productItemId: product?.productItem?.id,
      quantity: 1
    }],
      {
        onSuccess: (data) => {

          queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
      })
  }
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
    mutation.mutate([{
      productItemId: product?.productItem?.id,
      quantity: -1
    }],
      {
        onSuccess: (data) => {

          queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
      })
  }
  const handleRemove = () => {
    // dispatch(removeItem({
    //   ...product
    // }))
    mutation.mutate([{
      productItemId: product?.productItem?.id,
      quantity: -(product?.quantity)
    }],
      {
        onSuccess: (data) => {

          queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
      })
  }
  return (
    <div className="p-5 shadow-lg border rounded-md mb-5">
      <div className="flex items-center">
        <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem]">
          <img
            className="w-full h-full object-cover object-top"
            src={`${product?.productItem.productImage}`}
            alt={`${product?.productItem.productImage}`}
          />
        </div>
        <div className="ml-5 space-y-1">
          <p className="font-semibold">{product?.productItem.name}</p>
          {/* <p className="opavity-70">Size: {product.sizeBuy}, Color: {product.colorBuy}</p> */}
          {/* <p className="opacity-70 mt-2">Local Brand Teelab Studio</p> */}

          <div className="flex items-center justify-center space-x-5 text-gray-900 pt-6">
            <p className="font-semibold">Price: {product.totalPrice}đ</p>
            {/* <p className="line-through opacity-50">250.000đ</p>
            <p className="text-green-600 font-semibold">-40%</p> */}
          </div>
        </div>
      </div>
      <div className="lg:flex items-center lg:space-x-10 pt-4">
        <div className="flex items-center space-x-2">
          <IconButton onClick={() => handleSubQuantity()}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          <span className="py-1 px-7 border rounded-sm">{product.quantity}</span>
          <IconButton onClick={() => handlePlusQuantity()} sx={{ color: "RGB(145,85,253)" }}>
            <AddCircleOutlineIcon />
          </IconButton>
        </div>

        <div className="">
          <Button onClick={() => handleRemove()} sx={{ color: "RGB(220,20,60)", fontWeight: "bold" }}>
            remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
