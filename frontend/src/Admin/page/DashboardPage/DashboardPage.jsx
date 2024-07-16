import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import createAxiosInstance from "../../../services/createAxiosInstance";
import { useQuery } from "@tanstack/react-query";
import * as RevenueService from "../../../services/RevenueService";
import StatCard from "../../components/AdminStatistical/StatCard";
import DateField from "../../components/AdminStatistical/DateField";
import LineChart from "../../components/AdminStatistical/LineChart";
import PieChart from "../../components/AdminStatistical/PieChart";

import moneyIcon from "../../../Data/icon/Remove-bg.ai_1719739592370.png";
import userIcon from "../../../Data/icon/Remove-bg.ai_1719739646383.png";
import cartIcon from "../../../Data/icon/Remove-bg.ai_1719739681936.png";

const DashboardPage = () => {
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

  console.log({ optionChart, date });

  const { data: revenue, refetch } = useQuery({
    queryKey: ["revenue", date],
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-4xl font-extrabold uppercase">Shoes.co</p>

        <div className="flex gap-8 items-center">
          <img
            className="object-cover rounded-full h-[3rem]"
            src={auth?.avatar}
            alt="avatar"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-4">
        <StatCard
          title="Doanh thu"
          value={revenue?.totalRevenue.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
          icon={moneyIcon}
          bgColor="linear-gradient(to right, #a8e063, #56ab2f)"
          textColor="black"
        />
        <StatCard
          title="Người dùng mới"
          value={revenue?.totalAccount}
          icon={userIcon}
          bgColor="linear-gradient(to right, #74ebd5, #5a8dae)"
          textColor="black"
        />
        <StatCard
          title="Số đơn hàng"
          value={revenue?.totalNumberOrders}
          icon={cartIcon}
          bgColor="linear-gradient(to right, rgb(255, 150, 20), #d9376e)"
          textColor="black"
        />
      </div>

      <DateField
        optionChart={optionChart}
        onOptionChange={handleOptionChange}
        date={date}
        onDateChange={(value) => {
          handleDateChange(value);
          refetch();
        }}
      />

      <div className="flex gap-4">
        <div className="flex-1 bg-white mt-2 shadow-lg rounded-xl p-2 w-[760px]">
          <LineChart data={data} />
        </div>
        <div className="w-1/3 bg-white h-[400px] mt-2 shadow-lg rounded-xl p-4">
          <PieChart
            data={[
              revenue?.totalNumberOrdersSuccess,
              revenue?.totalNumberOrdersFailure,
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
