import React from "react";
import { DatePicker } from "antd";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

const FormVoucherCreate = ({
  registerCreate,
  control,
  errors,
  setValueCreate,
  navigate,
}) => {
  const { RangePicker } = DatePicker;

  const handleComeback = () => {
    navigate("/admin/vouchers");
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <input
          type="text"
          placeholder="Mã Voucher"
          {...registerCreate("voucherCode")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.voucherCode && (
          <span className="text-red-600 text-sm">
            {errors.voucherCode.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Tên"
          {...registerCreate("name")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.name && (
          <span className="text-red-600 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Tỉ lệ giảm giá"
          {...registerCreate("discountRate")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.discountRate && (
          <span className="text-red-600 text-sm">
            {errors.discountRate.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Giá trị giảm giá tối đa"
          {...registerCreate("maximumDiscountValidPrice")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.maximumDiscountValidPrice && (
          <span className="text-red-600 text-sm">
            {errors.maximumDiscountValidPrice.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Giá trị đơn hàng tối thiểu"
          {...registerCreate("minimumCartPrice")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.minimumCartPrice && (
          <span className="text-red-600 text-sm">
            {errors.minimumCartPrice.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Số lượng"
          {...registerCreate("quantity")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.quantity && (
          <span className="text-red-600 text-sm">
            {errors.quantity.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <Controller
          name="dateRange"
          control={control}
          render={({ field: { value, onChange } }) => (
            <RangePicker
              className="w-full mb-2"
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              value={
                value
                  ? [
                      dayjs(value[0], "DD/MM/YYYY 00:00:00"),
                      dayjs(value[1], "DD/MM/YYYY 00:00:00"),
                    ]
                  : [null, null]
              }
              format={"DD/MM/YYYY"}
              onChange={(dates, dateStrings) => {
                onChange(dateStrings);
              }}
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
          Tiến hành tạo Voucher
        </button>
      </div>
    </div>
  );
};

export default FormVoucherCreate;
