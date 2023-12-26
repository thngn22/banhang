import React, { useState } from "react";
import { WrapperHeader } from "./style";
import LineChart from "./LineChart";
import { Col, Row, Select } from "antd";
import {
  DollarCircleOutlined,
  UserOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import * as AuthService from "../../../services/AuthService";
import * as RevenueService from "../../../services/RevenueService";
import { loginSuccess } from "../../../redux/slides/authSlice";
import { useQuery } from "@tanstack/react-query";
import PieChart from "./PieChart";
import { Option } from "antd/es/mentions";

const AdminStatistical = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const [optionChart, setOptionChart] = useState("year");

  const getLabels = (listOrdersRevenue) => {
    if (optionChart === "month") {
      const currentMonth = new Date().getMonth() + 1;
      const daysInMonth = new Date(
        new Date().getFullYear(),
        currentMonth,
        0
      ).getDate();
      const labels = [];

      let startDay = 1;
      while (startDay <= daysInMonth) {
        const endDay = Math.min(startDay + 6, daysInMonth);
        labels.push(`${startDay}-${endDay}`);
        startDay += 7;
      }

      return labels;
    }

    const labels = listOrdersRevenue?.map((element, index) => {
      return element.time;
    });
    return labels;
  };
  const getDatas = (listOrdersRevenue) => {
    const datas = listOrdersRevenue?.map((element, index) => {
      return parseInt(element.totalRevenue);
    });
    return datas;
  };
  const handleOptionChange = (value) => {
    setOptionChart(value);
  };

  const refreshToken = async () => {
    try {
      const data = await AuthService.refreshToken();
      return data?.accessToken;
    } catch (err) {
      console.log("err", err);
    }
  };
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      if (auth?.accessToken) {
        const decodAccessToken = jwtDecode(auth?.accessToken);
        if (decodAccessToken.exp < date.getTime() / 1000) {
          const data = await refreshToken();
          const refreshUser = {
            ...auth,
            accessToken: data,
          };

          dispatch(loginSuccess(refreshUser));
          config.headers["Authorization"] = `Bearer ${data}`;
        }
      }

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const { data: revenue } = useQuery({
    queryKey: [optionChart],
    queryFn: () => {
      return RevenueService.getRevenue(
        { filter: optionChart },
        auth.accessToken,
        axiosJWT
      );
    },
    enabled: Boolean(auth?.accessToken),
  });
  console.log("revenue", revenue);

  const data = {
    labels: getLabels(revenue?.listOrdersRevenue),
    datasets: [
      {
        label: "Doanh thu",
        data: getDatas(revenue?.listOrdersRevenue),
        borderWidth: 1,
        backgroundColor: "aqua",
        borderColor: "blue",
        pointBorderColor: "aqua",
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const options = {
    plugins: {
      legend: true,
    },
    scales: {
      y: {
        // min: 0,
        // max: 10,
      },
    },
  };

  return (
    <div>
      <WrapperHeader>Thống kê</WrapperHeader>
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
      >
        <Col className="gutter-row" span={5}>
          <div
            style={{
              padding: "8px 8px",
              backgroundColor: "rgba(144, 238, 144, 0.7)",
              borderRadius: "10px", // Border radius
              fontWeight: "600", // Semi-bold font
              fontSize: "1.2em", // Font size
              margin: "8px 0", // Margin for spacing
              height: "88px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "2px solid",
            }}
          >
            <p>Doanh thu</p>
            <p>
              <DollarCircleOutlined style={{ marginRight: "4px" }} />{" "}
              {revenue?.totalRevenue.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        </Col>
        <Col className="gutter-row" span={4}>
          <div
            style={{
              padding: "8px 8px",
              backgroundColor: "rgba(255, 165, 0, 0.7)",
              borderRadius: "10px", // Border radius
              fontWeight: "600", // Semi-bold font
              fontSize: "1.2em", // Font size
              margin: "8px 0", // Margin for spacing
              height: "88px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "2px solid",
            }}
          >
            <p>Số người dùng</p>
            <p>
              <UserOutlined style={{ marginRight: "6px" }} />
              {revenue?.totalAccount}
            </p>
          </div>
        </Col>
        <Col className="gutter-row" span={5}>
          <div
            style={{
              padding: "8px 8px",
              backgroundColor: "rgba(255, 255, 153, 0.7)",
              borderRadius: "10px", // Border radius
              fontWeight: "600", // Semi-bold font
              fontSize: "1.2em", // Font size
              margin: "8px 0", // Margin for spacing
              height: "88px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "2px solid",
            }}
          >
            <p>Số lượng đơn hàng</p>
            <p>
              <CopyOutlined style={{ marginRight: "6px" }} />
              {revenue?.totalNumberOrders}
            </p>
          </div>
        </Col>
        <Col className="gutter-row" span={5}>
          <div
            style={{
              padding: "8px 8px",
              backgroundColor: "rgba(173, 216, 230, 0.7)",
              borderRadius: "10px", // Border radius
              fontWeight: "600", // Semi-bold font
              fontSize: "1.2em", // Font size
              margin: "8px 0", // Margin for spacing
              height: "88px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "2px solid",
            }}
          >
            <p>Đơn hoàn thành</p>
            <p style={{ color: "green" }}>
              <CheckCircleOutlined style={{ marginRight: "6px" }} />
              {revenue?.totalNumberOrdersSuccess}
            </p>
          </div>
        </Col>

        <Col className="gutter-row" span={5}>
          <div
            style={{
              padding: "8px 8px",
              backgroundColor: "rgba(255, 192, 203, 0.7)",
              borderRadius: "10px", // Border radius
              fontWeight: "600", // Semi-bold font
              fontSize: "1.2em", // Font size
              margin: "8px 0", // Margin for spacing
              height: "88px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "2px solid",
            }}
          >
            <p>Đơn thất bại</p>
            <p style={{ color: "green" }}>
              <CloseCircleOutlined style={{ marginRight: "6px" }} />
              {revenue?.totalNumberOrdersFailure}
            </p>
          </div>
        </Col>
      </Row>

      <Select
        value={optionChart}
        onChange={handleOptionChange}
        style={{ width: 120, marginTop: "20px" }}
      >
        <Option value="year">Năm</Option>
        <Option value="month">Tháng</Option>
        <Option value="week">Tuần</Option>
        <Option value="day">Ngày</Option>
      </Select>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "1" }}>
          <LineChart data={data} options={options}></LineChart>
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
