import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const OrderItems = (props) => {
  const orderItems = useSelector(
    (state) => state.order.detailOrder.currentOrder.orderItems
  );

  return (
    <div>
      {orderItems.map((orderItem) => (
        <div>
          <div
            className="p-3 rounded-md mb-3"
            style={{ border: "1px solid" }}
          >
            <div className="flex items-center">
              <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem]">
                <img
                  className="w-full h-full object-cover object-top"
                  src={orderItem.productItemImage}
                  alt={orderItem.productItemImage}
                />
              </div>
              <div className="ml-5 space-y-1">
                <p className="font-semibold">Windbreaker Black White AK077</p>
                <p className="opavity-70">
                  Size: {orderItem.size}, Color: {orderItem.color}
                </p>

                <div className="flex flex-col items-start justify-center space-y-2 text-gray-900 pt-6">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">Giá sản phẩm:</p>
                    <p>
                      {orderItem.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">Số lượng:</p>
                    <p>{orderItem.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">Tổng giá sản phẩm:</p>
                    <p className="text-green-600 font-semibold">
                      {orderItem.totalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItems;
