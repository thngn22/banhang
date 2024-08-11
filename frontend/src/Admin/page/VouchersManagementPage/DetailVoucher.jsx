import React from "react";
import { useSelector } from "react-redux";
import { formatDateInHisoryOrder } from "../../../utils/untils";

const DetailVoucher = () => {
  const detailVoucher = useSelector(
    (state) => state.voucher.detailVoucher.currentVoucher
  );

  return (
    <div className="font-montserrat">
      {detailVoucher && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex gap-2">
                <strong>ID:</strong>
                <p>{detailVoucher.id}</p>
              </div>
              <div className="flex gap-2">
                <strong>Tên:</strong>
                <p>{detailVoucher.name}</p>
              </div>
              <div className="flex gap-2">
                <strong>Mô tả:</strong>
                <p>{detailVoucher.description}</p>
              </div>
              <div className="flex gap-2">
                <strong>Mã voucher:</strong>
                <p>{detailVoucher.voucherCode}</p>
              </div>
              <div className="flex gap-2">
                <strong>Tình trạng:</strong>
                <p>{detailVoucher.active ? "Active" : "Inactive"}</p>
              </div>
              <div className="flex gap-2">
                <strong>Tỉ lệ giảm:</strong>
                <p>{detailVoucher.discountRate}%</p>
              </div>
              <div className="flex gap-2">
                <strong>Số lượng:</strong>
                <p>{detailVoucher.quantity}</p>
              </div>
              <div className="flex gap-2">
                <strong>Tổng giá trị tối đa được giảm:</strong>
                <p>
                  {detailVoucher.maximumDiscountValidPrice.toLocaleString(
                    "vi-VN",
                    {
                      style: "currency",
                      currency: "VND",
                    }
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <strong>Giá trị đơn hàng tối thiểu:</strong>
                <p>
                  {detailVoucher.minimumCartPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <strong>Số lượng hiện tại:</strong>
                <p>{detailVoucher.currentQuantity}</p>
              </div>
            </div>

            <div>
              <div className="flex gap-2">
                <strong>Ngày bắt đầu:</strong>
                <p>{formatDateInHisoryOrder(detailVoucher.startDate)}</p>
              </div>
              <div className="flex gap-2">
                <strong>Ngày kết thúc:</strong>
                <p>{formatDateInHisoryOrder(detailVoucher.endDate)}</p>
              </div>
              <div className="flex gap-2">
                <strong>Ngày tạo:</strong>
                <p>{formatDateInHisoryOrder(detailVoucher.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailVoucher;
