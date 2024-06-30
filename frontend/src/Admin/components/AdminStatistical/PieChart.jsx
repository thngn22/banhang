import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = (props) => {
  const data = {
    labels: ["Thành công", "Thất bại"],
    datasets: [
      {
        label: "Sales",
        data: props?.data,
        borderColor: "black",
        backgroundColor: ["rgb(116, 235, 213)", "rgb(217, 55, 110)"],
      },
    ],
  };

  const options = {};

  return (
    <div>
      <Pie data={data} options={options}></Pie>
    </div>
  );
};

export default PieChart;
