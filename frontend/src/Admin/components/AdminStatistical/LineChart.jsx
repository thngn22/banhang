import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const LineChart = (props) => {
  return (
    <div>
      <Line data={props.data} options={props.options}></Line>
    </div>
  );
};

export default LineChart;
