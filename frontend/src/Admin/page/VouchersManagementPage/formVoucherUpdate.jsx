import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";
import { formatDayjs } from "../../../utils/untils";

const FormVoucherUpdate = ({
  registerUpdate,
  control,
  errors,
  navigate,
  detailVoucher,
  setValueUpdate,
}) => {
  const { RangePicker } = DatePicker;

  const [time, setTime] = useState([
    detailVoucher?.startDate,
    detailVoucher?.endDate,
  ]);

  useEffect(() => {
    if (detailVoucher)
      setTime([detailVoucher?.startDate, detailVoucher?.endDate]);
  }, [detailVoucher]);

  const handleChangeTime = (value, onChange) => {
    const formattedValues = [];
    formattedValues.push(value[0] ? formatDayjs(value[0]) : "");
    formattedValues.push(value[1] ? formatDayjs(value[1]) : "");
    setTime(formattedValues);
    onChange(formattedValues);
  };

  const handleComeback = () => {
    navigate("/admin/vouchers");
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <label className="block font-semibold" htmlFor="voucherCode">
          Mã Voucher:
        </label>
        <input
          type="text"
          id="voucherCode"
          placeholder="Nhập mã voucher"
          {...registerUpdate("voucherCode")}
          defaultValue={detailVoucher?.voucherCode}
          className="w-full p-3 rounded border"
        />
        {errors.voucherCode && (
          <span className="text-red-600 text-sm">
            {errors.voucherCode.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <label className="block font-semibold" htmlFor="name">
          Tên:
        </label>
        <input
          type="text"
          id="name"
          placeholder="Nhập tên"
          {...registerUpdate("name")}
          defaultValue={detailVoucher?.name}
          className="w-full p-3 rounded border"
        />
        {errors.name && (
          <span className="text-red-600 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div className="w-full">
        <label className="block font-semibold" htmlFor="discountRate">
          Tỉ lệ giảm giá:
        </label>
        <input
          type="text"
          id="discountRate"
          placeholder="Nhập tỉ lệ giảm giá"
          {...registerUpdate("discountRate")}
          defaultValue={detailVoucher?.discountRate}
          className="w-full p-3 rounded border"
        />
        {errors.discountRate && (
          <span className="text-red-600 text-sm">
            {errors.discountRate.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <label
          className="block font-semibold"
          htmlFor="maximumDiscountValidPrice"
        >
          Giá trị giảm giá tối đa:
        </label>
        <input
          type="text"
          id="maximumDiscountValidPrice"
          placeholder="Nhập giá trị giảm giá tối đa"
          {...registerUpdate("maximumDiscountValidPrice")}
          defaultValue={detailVoucher?.maximumDiscountValidPrice}
          className="w-full p-3 rounded border"
        />
        {errors.maximumDiscountValidPrice && (
          <span className="text-red-600 text-sm">
            {errors.maximumDiscountValidPrice.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <label className="block font-semibold" htmlFor="minimumCartPrice">
          Giá trị đơn hàng tối thiểu:
        </label>
        <input
          type="text"
          id="minimumCartPrice"
          placeholder="Nhập giá trị đơn hàng tối thiểu"
          {...registerUpdate("minimumCartPrice")}
          defaultValue={detailVoucher?.minimumCartPrice}
          className="w-full p-3 rounded border"
        />
        {errors.minimumCartPrice && (
          <span className="text-red-600 text-sm">
            {errors.minimumCartPrice.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <label className="block font-semibold" htmlFor="quantity">
          Số lượng:
        </label>
        <input
          type="text"
          id="quantity"
          placeholder="Nhập số lượng"
          {...registerUpdate("quantity")}
          defaultValue={detailVoucher?.quantity}
          className="w-full p-3 rounded border"
        />
        {errors.quantity && (
          <span className="text-red-600 text-sm">
            {errors.quantity.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <label className="block font-semibold" htmlFor="dateRange">
          Ngày áp dụng:
        </label>
        <Controller
          name="dateRange"
          control={control}
          render={({ field: { onChange } }) => (
            <RangePicker
              id="dateRange"
              className="w-full"
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              value={[
                time[0] ? dayjs(time[0], "DD-MM-YYYY HH:mm:ss") : null,
                time[1] ? dayjs(time[1], "DD-MM-YYYY HH:mm:ss") : null,
              ]}
              format={"DD/MM/YYYY"}
              onChange={(value) => handleChangeTime(value, onChange)}
            />
          )}
        />
        {errors.dateRange && (
          <span className="text-red-600 text-sm">
            {errors.dateRange.message}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="cursor-pointer" onClick={handleComeback}>
          {"<"} Quay lại
        </p>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:opacity-80"
        >
          Tiến hành cập nhật Voucher
        </button>
      </div>
    </div>
  );
};

export default FormVoucherUpdate;
