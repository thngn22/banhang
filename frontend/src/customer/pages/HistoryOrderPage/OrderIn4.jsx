import React from "react";

const OrderIn4 = (props) => {
  const { detailOrder } = props;

  const renderTextState = (orderStatus) => {
    switch (orderStatus) {
      case "DA_VAN_CHUYEN":
        return "Đang vận chuyển";
      case "DA_GIAO_HANG":
        return "Đã giao hàng";
      case "GIAO_THAT_BAI":
        return "Giao thất bại";
      case "DA_BI_NGUOI_DUNG_HUY":
        return "Hủy";
      case "Da_BI_HE_THONG_HUY":
        return "Hệ thống hủy";
      case "DANG_XU_LY":
        return "Đang xử lý";
      case "DANG_CHO_XU_LY":
        return "Đang xử lý";
      case "HOAN_TAT":
        return "Đơn hoàn thành";
      default:
        return "Hoàn tiền";
    }
  };

  return (
    <div>
      <div className="space-y-1">
        <span className="font-semibold">Tình trạng:</span>
        <span className="ml-5 opavity-70 text-green-600 ">
          {renderTextState(detailOrder.statusOrder)}
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
              {detailOrder.address.address}, {detailOrder.address.ward}, {detailOrder.address.district}, {detailOrder.address.city}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderIn4;
