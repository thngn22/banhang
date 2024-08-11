import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

const FormVoucherUpdate = ({
  registerUpdate,
  control,
  errors,
  setValueUpdate,
  navigate,
  idVoucher,
  data,
}) => {
  const { RangePicker } = DatePicker;
  const [time, setTime] = useState([data?.startDate, data?.endDate]);

  useEffect(() => {
    if (data) {
      setTime([data?.startDate, data?.endDate]);
      setValueUpdate("dateRange", [data?.startDate, data?.endDate]);
    }
  }, [data, setValueUpdate]);

  const handleChangeTime = (value, onChange) => {
    const formattedValues = [];
    if (value && value[0] && value[1]) {
      formattedValues.push(dayjs(value[0]).format("DD-MM-YYYY 00:00:00"));
      formattedValues.push(dayjs(value[1]).format("DD-MM-YYYY 00:00:00"));
    } else {
      formattedValues.push("");
      formattedValues.push("");
    }
    setTime(formattedValues);
    onChange(formattedValues);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <input
          type="text"
          placeholder="Mã Voucher"
          defaultValue={data?.voucherCode}
          {...registerUpdate("voucherCode")}
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
          defaultValue={data?.name}
          {...registerUpdate("name")}
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
          defaultValue={data?.discountRate}
          {...registerUpdate("discountRate")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.discountRate && (
          <span className="text-red-600 text-sm">
            {errors.discountRate.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <Controller
          name="dateRange"
          control={control}
          rules={{ required: "Không được để trống" }}
          render={({ field: { value, onChange } }) => (
            <RangePicker
              className="w-full mb-2"
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              value={
                value && value[0] && value[1]
                  ? [
                      dayjs(value[0], "DD-MM-YYYY"),
                      dayjs(value[1], "DD-MM-YYYY"),
                    ]
                  : [null, null]
              }
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

      <div className="w-full">
        <input
          type="text"
          placeholder="Giá trị giảm giá tối đa"
          defaultValue={data?.maximumDiscountValidPrice}
          {...registerUpdate("maximumDiscountValidPrice")}
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
          defaultValue={data?.minimumCartPrice}
          {...registerUpdate("minimumCartPrice")}
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
          defaultValue={data?.quantity}
          {...registerUpdate("quantity")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.quantity && (
          <span className="text-red-600 text-sm">
            {errors.quantity.message}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <p
          className="cursor-pointer"
          onClick={() => navigate("/admin/vouchers")}
        >
          {"<"} Quay lại
        </p>
        <button className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500">
          Cập nhật mã voucher
        </button>
      </div>
    </div>
  );
};

export default FormVoucherUpdate;
