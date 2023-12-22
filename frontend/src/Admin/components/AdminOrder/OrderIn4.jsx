import React, { useEffect, useState } from "react";

const OrderIn4 = (props) => {
  const { detailOrder } = props;

  const getStatusDisplay = (statusOrder) => {
    switch (statusOrder) {
      case "DANG_CHO_XU_LY":
        return { text: "Đang xử lý", color: "gray" };
      case "DANG_XU_LY":
        return { text: "Đang xử lý", color: "gray" };
      case "DA_BI_NGUOI_DUNG_HUY":
        return { text: "Hủy", color: "red" };
      case "DA_BI_HE_THONG_HUY":
        return { text: "Hệ thống hủy", color: "red" };
      case "DANG_VAN_CHUYEN":
        return { text: "Đang vận chuyển", color: "yellow" };
      case "DA_GIAO_HANG":
        return { text: "Đã giao hàng", color: "pink" };
      case "BI_TU_CHOI":
        return { text: "Bị từ chối", color: "red" };
      case "DA_HOAN_TIEN":
        return { text: "Đã hoàn tiền", color: "red" };
      default:
        return { text: "Hoàn tất", color: "green" };
    }
  };

  const statusDisplay = getStatusDisplay(detailOrder.statusOrder);

  return (
    <div>
      <div className="space-y-1">
        <span className="font-semibold">Tình trạng:</span>
        <span
          className={"ml-5 opacity-70 font-semibold"}
          style={{ color: `${statusDisplay.color}` }}
        >
          {statusDisplay.text}
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
              {detailOrder.address.address}, {detailOrder.address.ward},{" "}
              {detailOrder.address.district}, {detailOrder.address.city}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderIn4;
