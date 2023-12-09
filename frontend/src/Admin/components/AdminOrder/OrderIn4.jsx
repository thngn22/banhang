import React, { useEffect, useState } from "react";

const OrderIn4 = (props) => {
  const { detailOrder } = props;

  return (
    <div>
      <div className="space-y-1">
        <span className="font-semibold">Tình trạng:</span>
        <span className="ml-5 opavity-70 text-green-600 ">
          {detailOrder.statusOrder}
        </span>

        <div className="flex flex-col items-start justify-center space-y-2 text-gray-900 pt-6">
          <div className="flex items-center space-x-2">
            <p className="font-semibold">Mã đơn:</p>
            <p>{detailOrder.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-semibold">Ngày tạo:</p>
            <p>{detailOrder.createdAt}</p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-semibold">Người tạo:</p>
            <p>{detailOrder.user.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-semibold">Địa chỉ:</p>
            <p>
              {detailOrder.address.zipCode}, đường{" "}
              {detailOrder.address.streetAddress}, thành phố{" "}
              {detailOrder.address.city}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderIn4;
