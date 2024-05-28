import React, { useState } from "react";
import { WrapperHeader } from "./style";
import LineChart from "./LineChart";
import { Row } from "antd";
import {
  DollarCircleOutlined,
  UserOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import * as RevenueService from "../../../services/RevenueService";
import { useQuery } from "@tanstack/react-query";
import PieChart from "./PieChart";
import DateField from "./DateField";
import createAxiosInstance from "../../../services/createAxiosInstance";
import StatCard from "./StatCard"; // Import StatCard

const AdminStatistical = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [optionChart, setOptionChart] = useState("year");
  const [date, setDate] = useState([
    "01-01-2023 00:00:00",
    "31-12-2024 23:59:59",
  ]);

  const handleOptionChange = (value) => {
    setOptionChart(value);
  };
  const handleDateChange = (value) => {
    setDate(value);
  };

  const { data: revenue, refetch } = useQuery({
    queryKey: "revenue",
    queryFn: () => {
      return RevenueService.getRevenue(
        { from: date[0], to: date[1], type: optionChart },
        auth.accessToken,
        axiosJWT
      );
    },
    enabled: Boolean(auth?.accessToken),
  });

  const data = {
    labels: revenue?.listOrdersRevenue.map((element) => {
      return element.time;
    }),
    datasets: [
      {
        label: "Doanh thu",
        data: revenue?.listOrdersRevenue.map((element) => {
          return element.totalRevenue;
        }),
        borderWidth: 1,
        backgroundColor: "aqua",
        borderColor: "blue",
        fill: true,
        tension: 0,
      },
    ],
  };

  return (
    <div>
      <WrapperHeader>Thống kê</WrapperHeader>
      <Row justify="space-between">
        <StatCard
          title="Doanh thu"
          value={revenue?.totalRevenue.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
          icon={<DollarCircleOutlined />}
          bgColor="rgba(144, 238, 144, 0.7)"
          textColor="black"
          borderColor="rgba(144, 238, 144, 1)"
        />
        <StatCard
          title="Số người dùng"
          value={revenue?.totalAccount}
          icon={<UserOutlined />}
          bgColor="rgba(255, 165, 0, 0.7)"
          textColor="black"
          borderColor="orange"
        />
        <StatCard
          title="Số lượng đơn hàng"
          value={revenue?.totalNumberOrders}
          icon={<CopyOutlined />}
          bgColor="rgba(255, 255, 153, 0.7)"
          textColor="black"
          borderColor="yellow"
        />
        <StatCard
          title="Đơn hoàn thành"
          value={revenue?.totalNumberOrdersSuccess}
          icon={<CheckCircleOutlined />}
          bgColor="rgba(173, 216, 230, 0.7)"
          textColor="green"
          borderColor="rgba(173, 216, 230, 1)"
        />
        <StatCard
          title="Đơn thất bại"
          value={revenue?.totalNumberOrdersFailure}
          icon={<CloseCircleOutlined />}
          bgColor="rgba(255, 192, 203, 0.7)"
          textColor="red"
          borderColor="pink"
        />
      </Row>

      <DateField
        optionChart={optionChart}
        onOptionChange={handleOptionChange}
        date={date}
        onDateChange={(value) => {
          handleDateChange(value);
          refetch();
        }}
      />

      <div style={{ display: "flex" }}>
        <div style={{ flex: "1" }}>
          <LineChart data={data}></LineChart>
        </div>
        <div style={{ width: "32%" }}>
          <PieChart
            data={[
              revenue?.totalNumberOrdersSuccess,
              revenue?.totalNumberOrdersFailure,
            ]}
          ></PieChart>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistical;
