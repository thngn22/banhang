import React from "react";
import { WrapperHeader } from "./style";
import LineChart from "./LineChart";

const AdminStatistical = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed"],
    datasets: [
      {
        label: "Scale of the Week",
        data: [6, 3, 9],
        borderWidth: 1,
        backgroundColor: "aqua",
        borderColor: "black",
        pointBorderColor: "aqua",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Scale of the Week2",
        data: [2, 5, 1],
        borderWidth: 1,
        backgroundColor: "aqua",
        borderColor: "black",
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
      <LineChart data={data} options={options}></LineChart>
    </div>
  );
};

export default AdminStatistical;
