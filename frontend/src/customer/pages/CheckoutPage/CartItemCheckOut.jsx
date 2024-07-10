import React from "react";

const CartItemCheckOut = ({ product }) => {
  return (
    <div className="flex relative cursor-pointer">
      <div className="w-[4rem] h-[4rem]">
        <img
          className="w-full h-full object-cover object-top rounded-xl border-2 border-black"
          src={`${product?.productItem.productImage}`}
          alt={`${product?.productItem.productImage}`}
        />
      </div>
      <div className="ml-2 flex flex-col justify-between w-full">
        <div className="flex flex-col text-gray-900 w-full">
          <p
            className="font-medium truncate"
            style={{ maxWidth: "18rem" }}
            title={product?.productItem.name}
          >
            {product?.productItem.name}
          </p>
          <div className="flex gap-1 text-sm">
            <p className="text-gray-400">{product?.productItem.color}</p>/
            <p className="text-gray-400">{product?.productItem.size}</p>
          </div>
        </div>
        <div className="flex justify-between w-full">
          <p className="text-red-600 font-medium">
            {product.totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
          <p>Số lượng: {product.quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default CartItemCheckOut;
