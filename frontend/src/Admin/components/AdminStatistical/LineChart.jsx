import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import PieChart from "./PieChart";
import { Col, Row } from "antd";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const LineChart = (props) => {
  return <Line data={props.data} options={props.options}></Line>;
};

export default LineChart;
