import React from "react";
import { useSelector } from "react-redux";
import OrderItems from "./OrderItems";
import OrderDetailPrice from "./OrderDetailPrice";
import OrderIn4 from "./OrderIn4";

const AdminOrderDetail = () => {
  const detailOrder = useSelector(
    (state) => state.order.detailOrder.currentOrder
  );



  return (
    <div>
      <div>
        <h4 className="text-xl font-semibold mb-2">Thông tin cơ bản</h4>
        <OrderIn4 detailOrder={detailOrder} />
        <hr className="my-2 border-t-2 border-gray-300" />

        <h4 className="text-xl font-semibold mb-2">Danh sách sản phẩm</h4>
        <OrderItems />
        <hr className="my-2 border-t-2 border-gray-300" />

        <h4 className="text-xl font-semibold mb-2">Chi tiết giá</h4>
        <OrderDetailPrice detailOrder={detailOrder} />
      </div>
    </div>
  );
};

export default AdminOrderDetail;
