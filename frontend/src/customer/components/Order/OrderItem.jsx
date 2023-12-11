import React, { useEffect, useState } from "react";
import * as OrderService from "../../../services/OrderService";
import { useQuery } from "@tanstack/react-query";

const Order = ({ orderId, accessToken }) => {
  const { data: detailOrder } = useQuery({
    queryKey: ["detailOrder", orderId], // Sử dụng order.id làm một phần của key
    queryFn: () => OrderService.getDetailOrderUser(orderId, accessToken),
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
                    <p className="text-red-500">{`${item.totalPrice} vnđ`}</p>
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
