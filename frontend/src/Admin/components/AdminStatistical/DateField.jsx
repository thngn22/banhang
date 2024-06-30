import React, { useState } from "react";
import { DatePicker, Select, Space } from "antd";
import dayjs from "dayjs";
import { formatDateEnd, formatDate } from "../../../utils/untils";

const { RangePicker } = DatePicker;
const { Option } = Select;

const DateField = ({ optionChart, onOptionChange, date, onDateChange }) => {
  const [type, setType] = useState(optionChart);
  const [time, setTimeChart] = useState(date);

  const handleOptionChange = (value) => {
    setType(value);
    onOptionChange(value);
    setTimeChart([null, null]);
    onDateChange([null, null]);
  };
  const handleDateChange = () => {
    onDateChange(time);
  };

  const handleChange = (value) => {
    if (Array.isArray(value)) {
      const formattedValues = [];
      formattedValues.push(value[0] ? formatDate(type, value[0]) : "");
      formattedValues.push(value[1] ? formatDateEnd(type, value[1]) : "");
      setTimeChart(formattedValues);
    } else {
      const startDate = formatDate(type, value);
      const endDate = formatDateEnd(type, value);
      setTimeChart([startDate, endDate]);
    }
  };

  const PickerWithType = ({ type }) => {
    switch (type) {
      case "hour":
        return (
          <DatePicker
            value={time[0] ? dayjs(time[0], "DD-MM-YYYY HH:mm:ss") : null}
            onChange={handleChange}
          />
        );
      case "day":
        return (
          <RangePicker
            value={[
              time[0] ? dayjs(time[0], "DD-MM-YYYY HH:mm:ss") : null,
              time[1] ? dayjs(time[1], "DD-MM-YYYY HH:mm:ss") : null,
            ]}
            onChange={handleChange}
          />
        );
      default:
        return (
          <RangePicker
            value={[
              time[0] ? dayjs(time[0], "DD-MM-YYYY HH:mm:ss") : null,
              time[1] ? dayjs(time[1], "DD-MM-YYYY HH:mm:ss") : null,
            ]}
            picker={type}
            onChange={handleChange}
          />
        );
    }
  };

  return (
    <Space className="mt-4">
      <Select value={type} onChange={handleOptionChange}>
        <Option value="hour">Giờ</Option>
        <Option value="day">Ngày</Option>
        <Option value="month">Tháng</Option>
        <Option value="year">Năm</Option>
      </Select>
      <PickerWithType type={type} />

      {time[0] !== null && time[1] !== null ? (
        <button
          className="bg-black text-white p-1 px-11 border border-transparent rounded-md font-bold tracking-wide uppercase cursor-pointer hover:opacity-70"
          onClick={handleDateChange}
        >
          Lọc
        </button>
      ) : (
        <></>
      )}
    </Space>
  );
};

export default DateField;
