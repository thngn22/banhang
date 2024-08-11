import React, { useEffect, useState } from "react";
import OrderIn4 from "./OrderIn4";
import OrderDetailPrice from "./OrderDetailPrice";
import { useSelector } from "react-redux";
import OrderItemFix from "./OrderItemFix";

const OrderDetail = (props) => {
  const detailOrder = useSelector(
    (state) => state.order.detailOrder.currentOrder
  );

  const [orderItems, setOrderItems] = useState([]);
  useEffect(() => {
    if (detailOrder) {
      setOrderItems(detailOrder?.orderItems);
    }
  }, [detailOrder]);

  console.log("detailOrder", detailOrder);
  console.log("orderItems", orderItems);

  return (
    <div>
      <h4 className="text-xl font-semibold mb-2">Thông tin cơ bản</h4>
      <OrderIn4 detailOrder={detailOrder} />
      <hr className="my-2 border-t-2 border-gray-300" />

      <h4 className="text-xl font-semibold mb-2">Danh sách sản phẩm</h4>
      {/* <OrderItems setIsModalOpen={props.setIsModalOpen} /> */}
      {orderItems?.map((orderItem) => (
        <OrderItemFix
          setIsModalOpen={props.setIsModalOpen}
          orderItem={orderItem}
        />
      ))}
      <hr className="my-2 border-t-2 border-gray-300" />

      <h4 className="text-xl font-semibold mb-2">Chi tiết giá</h4>
      <OrderDetailPrice detailOrder={detailOrder} />
    </div>
  );
};

export default OrderDetail;
