import React from "react";
import { WrapperHeader } from "./style";
import LineChart from "./LineChart";
import { Col, Row } from "antd";
import {
  DollarCircleOutlined,
  DollarOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import * as AuthService from "../../../services/AuthService";
import * as RevenueService from "../../../services/RevenueService";
import { loginSuccess } from "../../../redux/slides/authSlice";
import { useQuery } from "@tanstack/react-query";

const AdminStatistical = () => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();

  const getMonthlyLabels = () => {
    const currentMonth = new Date().getMonth() + 1; // Lấy tháng hiện tại
    const startMonth = 8; // Tháng bắt đầu từ tháng 8
    const months = [];
    for (let i = startMonth; i <= currentMonth; i++) {
      months.push(`${i}/2023`);
    }
    return months;
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

  const getAllProductsAdmin = async () => {
    const res = await RevenueService.getRevenue(auth.accessToken, axiosJWT);
    return res;
  };
  const { data: revenue, refetch } = useQuery({
    queryKey: ["revenue"],
    queryFn: getAllProductsAdmin,
    enabled: Boolean(auth?.accessToken),
  });

  const data = {
    labels: getMonthlyLabels(),
    datasets: [
      {
        label: "Scale of the Week",
        data: [
          0,
          parseInt(revenue?.totalRevenue / 3),
          parseInt(revenue?.totalRevenue) / 2,
          parseInt(revenue?.totalRevenue * 3),
          parseInt(revenue?.totalRevenue) * 6,
          parseInt(revenue?.totalRevenue * 8),
          parseInt(revenue?.totalRevenue) * 10,
        ],
        borderWidth: 1,
        backgroundColor: "aqua",
        borderColor: "blue",
        pointBorderColor: "aqua",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Scale of the Week2",
        data: [
          0,
          parseInt(revenue?.totalFee / 10),
          parseInt(revenue?.totalFee / 7),
          parseInt(revenue?.totalFee / 5),
          parseInt(revenue?.totalFee),
        ],
        borderWidth: 1,
        backgroundColor: "aqua",
        borderColor: "red",
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
        <Col className="gutter-row" span={6}>
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
            }}
          >
            <p>Doanh thu</p>
            <p style={{ color: "red" }}>
              <DollarCircleOutlined style={{ marginRight: "4px" }} />{" "}
              {revenue?.totalRevenue.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
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
            }}
          >
            <p>Chi phí</p>
            <p style={{ color: "#fff" }}>
              <DollarOutlined style={{ marginRight: "6px" }} />
              {revenue?.totalFee.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
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
            }}
          >
            <p>Số lượng đơn hàng</p>
            <p>
              <CopyOutlined style={{ marginRight: "6px" }} />
              {revenue?.totalNumberOrders}
            </p>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
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
            }}
          >
            <p>Đơn hàng hoàn thành</p>
            <p style={{ color: "green" }}>
              <CheckCircleOutlined style={{ marginRight: "6px" }} />
              {revenue?.totalNumberOrdersSuccess}
            </p>
          </div>
        </Col>
      </Row>

      <LineChart data={data} options={options}></LineChart>
    </div>
  );
};

export default AdminStatistical;
